#!/bin/bash

# Setup script za Google Maps scraper
# Pokreni kao: sudo bash scripts/setup_scraper.sh

echo "=== Instalacija Python Google Maps Scraper-a ==="

# Provjeri Python verziju
python3 --version || {
    echo "Python3 nije instaliran. Instaliram..."
    apt-get update && apt-get install -y python3 python3-pip python3-venv
}

# Kreiraj virtual environment
echo "Kreiram Python virtual environment..."
cd "$(dirname "$0")"
python3 -m venv venv

# Aktiviraj venv i instaliraj dependencies
echo "Instaliram Python pakete..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Instaliraj Playwright browsere
echo "Instaliram Chromium browser za Playwright..."
playwright install chromium

# Instaliraj system dependencies za Playwright
echo "Instaliram system dependencies..."
playwright install-deps chromium

# Test
echo "Testiram scraper..."
python3 google_maps_scraper.py "autopraonica Tuzla" 3

echo ""
echo "=== Setup završen! ==="
echo ""
echo "Za korištenje scrapera iz aplikacije, ažuriraj putanju u .env:"
echo "SCRAPER_PYTHON_PATH=/var/www/autokozmetika/autoshop/scripts/venv/bin/python3"
echo ""
