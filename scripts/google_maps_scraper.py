#!/usr/bin/env python3
"""
Google Maps Scraper - Besplatna alternativa Google Places API
Koristi Playwright za scraping Google Maps rezultata
"""

import asyncio
import json
import sys
import re
from typing import Optional
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout


async def search_google_maps(query: str, limit: int = 20) -> list[dict]:
    """
    Pretražuje Google Maps i vraća listu biznisa

    Args:
        query: Pretraga (npr. "autopraonica Tuzla")
        limit: Maksimalan broj rezultata

    Returns:
        Lista dict-ova sa podacima o biznisima
    """
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )

        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            locale='bs-BA',
            timezone_id='Europe/Sarajevo'
        )

        page = await context.new_page()

        try:
            # Idi na Google Maps pretragu
            search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            await page.goto(search_url, wait_until='networkidle', timeout=30000)

            # Prihvati cookies ako se pojavi
            try:
                accept_btn = page.locator('button:has-text("Accept all"), button:has-text("Prihvati sve")')
                if await accept_btn.count() > 0:
                    await accept_btn.first.click()
                    await page.wait_for_timeout(1000)
            except:
                pass

            # Čekaj da se učita feed sa rezultatima
            await page.wait_for_timeout(3000)

            # Pronađi feed container
            feed = page.locator('div[role="feed"]')
            if await feed.count() == 0:
                # Možda je direktno otvoren jedan rezultat
                feed = page.locator('div[role="main"]')

            # Scroll za učitavanje više rezultata
            for scroll_attempt in range(5):
                try:
                    await feed.evaluate('el => el.scrollTop = el.scrollHeight')
                    await page.wait_for_timeout(1500)
                except:
                    break

            # Dohvati sve linkove rezultata
            items = await page.locator('div[role="feed"] a[href*="/maps/place/"]').all()

            if len(items) == 0:
                # Alternativni selektor
                items = await page.locator('a[href*="/maps/place/"]').all()

            processed = 0

            for item in items:
                if processed >= limit:
                    break

                try:
                    href = await item.get_attribute('href')
                    if not href or '/maps/place/' not in href:
                        continue

                    # Klikni na rezultat
                    await item.click()
                    await page.wait_for_timeout(2000)

                    # Ekstraktuj podatke
                    data = await extract_place_data(page)

                    if data and data.get('name'):
                        # Dodaj Google Maps URL
                        data['google_maps_url'] = page.url

                        # Ekstraktuj place_id iz URL-a
                        place_id_match = re.search(r'!1s([^!]+)', page.url)
                        if place_id_match:
                            data['google_place_id'] = place_id_match.group(1)
                        else:
                            # Generiraj pseudo ID
                            data['google_place_id'] = f"scraped_{hash(data['name'] + (data.get('address') or ''))}"

                        results.append(data)
                        processed += 1

                    # Vrati se nazad na listu
                    back_button = page.locator('button[aria-label*="Back"], button[aria-label*="Nazad"]')
                    if await back_button.count() > 0:
                        await back_button.first.click()
                        await page.wait_for_timeout(1000)

                except PlaywrightTimeout:
                    continue
                except Exception as e:
                    continue

        except Exception as e:
            print(json.dumps({"error": str(e)}), file=sys.stderr)

        finally:
            await browser.close()

    return results


async def extract_place_data(page) -> Optional[dict]:
    """Ekstraktuje podatke o biznisu sa trenutne stranice"""

    data = {
        'name': None,
        'address': None,
        'phone': None,
        'website': None,
        'rating': None,
        'reviews': None,
        'business_type': None,
        'city': None
    }

    try:
        # Naziv
        name_el = page.locator('h1').first
        if await name_el.count() > 0:
            data['name'] = await name_el.text_content()

        # Pronađi info elemente
        info_buttons = await page.locator('button[data-item-id]').all()

        for btn in info_buttons:
            try:
                aria_label = await btn.get_attribute('aria-label') or ''
                data_id = await btn.get_attribute('data-item-id') or ''

                # Adresa
                if 'address' in data_id or 'Adresa' in aria_label or 'Address' in aria_label:
                    addr = aria_label.replace('Adresa:', '').replace('Address:', '').strip()
                    if addr:
                        data['address'] = addr
                        # Ekstraktuj grad
                        data['city'] = extract_city_from_address(addr)

                # Telefon
                elif 'phone' in data_id or 'Telefon' in aria_label or 'Phone' in aria_label:
                    phone = aria_label.replace('Telefon:', '').replace('Phone:', '').strip()
                    if phone:
                        data['phone'] = phone

                # Web stranica
                elif 'authority' in data_id or 'website' in data_id or 'Web' in aria_label:
                    website = aria_label.replace('Web lokacija:', '').replace('Website:', '').strip()
                    if website and website.startswith('http'):
                        data['website'] = website
                    elif website:
                        data['website'] = f"https://{website}"

            except:
                continue

        # Rating i broj recenzija
        try:
            rating_el = page.locator('div[role="img"][aria-label*="zvjezdic"], div[role="img"][aria-label*="star"]').first
            if await rating_el.count() > 0:
                rating_text = await rating_el.get_attribute('aria-label') or ''
                # Format: "4,5 zvjezdica" ili "4.5 stars"
                rating_match = re.search(r'([\d,\.]+)', rating_text)
                if rating_match:
                    data['rating'] = float(rating_match.group(1).replace(',', '.'))

            # Broj recenzija
            reviews_el = page.locator('button[aria-label*="recenzij"], button[aria-label*="review"]').first
            if await reviews_el.count() > 0:
                reviews_text = await reviews_el.get_attribute('aria-label') or ''
                reviews_match = re.search(r'([\d\.]+)', reviews_text.replace('.', ''))
                if reviews_match:
                    data['reviews'] = int(reviews_match.group(1))
        except:
            pass

        # Tip biznisa
        try:
            category_el = page.locator('button[jsaction*="category"]').first
            if await category_el.count() > 0:
                data['business_type'] = await category_el.text_content()
        except:
            pass

        return data

    except Exception as e:
        return None


def extract_city_from_address(address: str) -> Optional[str]:
    """Ekstraktuje grad iz adrese"""
    if not address:
        return None

    # Tipičan format: "Ulica broj, Grad, Država" ili "Ulica broj, Poštanski broj Grad"
    parts = [p.strip() for p in address.split(',')]

    if len(parts) >= 2:
        # Probaj predzadnji dio (obično grad)
        potential_city = parts[-2] if len(parts) > 2 else parts[-1]
        # Ukloni poštanski broj ako postoji
        potential_city = re.sub(r'\d{5}', '', potential_city).strip()

        # Poznati gradovi u BiH
        bih_cities = [
            'Tuzla', 'Sarajevo', 'Banja Luka', 'Zenica', 'Mostar', 'Bijeljina',
            'Brčko', 'Bihać', 'Prijedor', 'Trebinje', 'Doboj', 'Cazin',
            'Gradačac', 'Živinice', 'Lukavac', 'Gračanica', 'Srebrenik',
            'Bugojno', 'Travnik', 'Visoko', 'Goražde', 'Konjic', 'Jablanica'
        ]

        for city in bih_cities:
            if city.lower() in potential_city.lower():
                return city

        return potential_city if potential_city else None

    return None


def determine_business_type(raw_type: Optional[str]) -> str:
    """Mapira tip biznisa na standardne kategorije"""
    if not raw_type:
        return "Ostalo"

    raw_lower = raw_type.lower()

    if 'pranje' in raw_lower or 'praonica' in raw_lower or 'car wash' in raw_lower:
        return "Autopraonica"
    elif 'detailing' in raw_lower or 'polish' in raw_lower:
        return "Detailing studio"
    elif 'servis' in raw_lower or 'repair' in raw_lower or 'mehaničar' in raw_lower:
        return "Autoservis"
    elif 'pumpa' in raw_lower or 'benzin' in raw_lower or 'gas' in raw_lower:
        return "Benzinska pumpa"
    elif 'salon' in raw_lower or 'dealer' in raw_lower or 'prodaja' in raw_lower:
        return "Auto salon"

    return raw_type


async def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Nedostaje upit za pretragu"}))
        sys.exit(1)

    query = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 20

    try:
        results = await search_google_maps(query, limit)

        # Formatiraj izlaz za API
        output = {
            "leads": [
                {
                    "googlePlaceId": r.get('google_place_id'),
                    "companyName": r.get('name'),
                    "address": r.get('address'),
                    "city": r.get('city'),
                    "phone": r.get('phone'),
                    "website": r.get('website'),
                    "googleMapsUrl": r.get('google_maps_url'),
                    "googleRating": r.get('rating'),
                    "googleReviews": r.get('reviews'),
                    "businessType": determine_business_type(r.get('business_type'))
                }
                for r in results
            ],
            "total": len(results)
        }

        print(json.dumps(output, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == '__main__':
    asyncio.run(main())
