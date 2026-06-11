# AutoShop - Auto Kozmetika & Repromatrijali E-commerce

E-commerce platforma za prodaju auto kozmetike i repromatrijala u BiH sa B2C i B2B funkcionalnostima.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Jezik:** TypeScript
- **Stilovi:** Tailwind CSS + Lucide React ikone
- **Baza:** PostgreSQL + Prisma ORM
- **Autentifikacija:** NextAuth.js v5
- **State Management:** Zustand (korpa)
- **Email:** Resend
- **Notifikacije:** Telegram Bot API
- **Tracking:** Meta Pixel + Microsoft Clarity
- **PDF:** react-pdf/renderer (fakture)
- **Grafovi:** Recharts

## Ključne Funkcionalnosti

### 🛒 E-commerce
- Katalog proizvoda sa filterima i pretragom
- Kategorije sa hijerarhijom
- Korpa sa perzistencijom (localStorage)
- Guest i registered checkout
- Plaćanje pouzećem (COD)
- Order tracking sa statusima

### 👥 Korisnici
- B2C kupci (retail)
- B2B kupci (veleprodaja)
- B2B odobravanje od strane admina
- Cjenovne grupe sa popustima
- Korisnički panel sa historijom narudžbi

### 📊 Admin Panel
- Dashboard sa KPI metrikama
- Upravljanje proizvodima, kategorijama, narudžbama
- Upravljanje kupcima i B2B odobravanjima
- Low stock alerting
- Prodajna analitika sa grafovima
- Ad spend tracking sa ROAS kalkulacijom

### 📧 Notifikacije
- Email notifikacije (Resend)
- Telegram instant obavještenja
- Potvrde narudžbi za kupce
- Alert-i za admina

### 🎨 Content Management
- Blog sistem
- Landing pages
- SEO optimizacija (meta tagovi, sitemap, robots.txt)

### 📈 Analytics & Tracking
- Meta Pixel (Facebook Ads)
- Microsoft Clarity (heatmaps, recordings)
- Prodajna analitika
- Ad spend ROI tracking

### 🧾 B2B Features
- Specijalne cijene po cjenovnim grupama
- PDF fakture (automatska generacija)
- Veće količine
- Prioritetna podrška

## Pokretanje projekta

### 1. Instalacija dependencija

```bash
npm install
```

### 2. Baza podataka je već postavljena (Neon PostgreSQL)

DATABASE_URL je već konfigurisan u `.env` fajlu.

### 3. Push Prisma schema u bazu

```bash
npm run db:push
```

### 4. Seedovanje početnih podataka

```bash
npm run db:seed
```

Ovo će kreirati:
- **Admin korisnika** (email: `admin@autoshop.ba`, lozinka: `admin123`)
- Osnovne kategorije (Auto Kozmetika, Repromatrijali, Poliranje, Pranje)
- 3 demo proizvoda
- 3 B2B cjenovne grupe (15%, 10%, 5% popust)

### 5. Pokretanje development servera

```bash
npm run dev
```

Aplikacija će biti dostupna na [http://localhost:3000](http://localhost:3000)

### 6. Pristup admin panelu

Prijavite se sa admin kredencijalima:
- **Email:** `admin@autoshop.ba`
- **Lozinka:** `admin123`

**Admin panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

## Dostupne skripte

```bash
npm run dev          # Pokreni development server
npm run build        # Build za produkciju
npm run start        # Pokreni production server
npm run lint         # ESLint provjera

npm run db:generate  # Generiši Prisma klijent
npm run db:push      # Push schema u bazu (bez migracija)
npm run db:migrate   # Kreiraj i pokreni migracije
npm run db:seed      # Popuni bazu sa početnim podacima
npm run db:studio    # Otvori Prisma Studio
```

## Faze Razvoja - SVE ZAVRŠENO! ✅

### ✅ Faza 1 - Temelji
- [x] Next.js 15 projekat sa TypeScript i Tailwind CSS
- [x] PostgreSQL (Neon) + Prisma ORM sa kompletnom šemom
- [x] NextAuth.js v5 autentifikacija (login, register, middleware)
- [x] Bazni layout (Header, Footer, navigacija)
- [x] Sistem kategorija i prikaz proizvoda
- [x] Stranica pojedinačnog proizvoda sa galerijom

### ✅ Faza 2 - Kupovina
- [x] Korpa stranica (Zustand + localStorage)
- [x] Checkout forma sa validacijom (guest + logged-in)
- [x] COD logika narudžbe + API endpoint
- [x] Email notifikacije (Resend) - kupcu i adminu
- [x] Telegram notifikacije za nove narudžbe
- [x] Stranica potvrde narudžbe
- [x] Meta Pixel tracking (AddToCart, Purchase, ViewContent)

### ✅ Faza 3 - Admin Panel
- [x] Admin layout sa sidebar navigacijom
- [x] Dashboard sa KPI widgetima i grafovima
- [x] CRUD za proizvode (lista, akcije)
- [x] CRUD za kategorije (lista, akcije)
- [x] Upravljanje narudžbama (lista, statusi)
- [x] Upravljanje kupcima (B2C/B2B)
- [x] Low stock alerting sistem

### ✅ Faza 4 - B2B & Računi
- [x] B2B odobravanje kupaca (API + UI)
- [x] Cjenovne grupe (lista, popusti)
- [x] B2B specifične cijene proizvoda (pricing modul)
- [x] B2B korisnički panel (/account/b2b)
- [x] PDF generacija faktura (react-pdf/renderer)

### ✅ Faza 5 - Content & Landing Pages
- [x] Blog sistem (admin + public stranice)
- [x] SEO optimizacija (meta tagovi, Open Graph, JSON-LD)
- [x] Landing page builder (admin lista)
- [x] Microsoft Clarity integracija
- [x] Sitemap.xml i robots.txt (dynamic)

### ✅ Faza 6 - Analitika & Polishing
- [x] Ad Spend modul sa grafovima (Recharts)
- [x] Prodajna analitika dashboard (ROAS, CPA, AOV)
- [x] Email template-i (B2B odobrenje, status promjena)
- [x] Performance optimizacija (next.config, headers)
- [x] Finalna dokumentacija

## Struktura projekta

```
autoshop/
├── app/                    # Next.js App Router
│   ├── (shop)/            # Public shop routes
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (account)/         # Korisnički panel
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/
│   ├── shop/              # Shop komponente
│   ├── admin/             # Admin komponente
│   └── providers/         # Context providers
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   └── store/             # Zustand stores
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed podaci
└── public/                # Static fajlovi
```

## Environment Varijable

Pogledajte `.env.example` za listu svih potrebnih environment varijabli.

## Production Deployment (Hetzner VPS)

Projekat je optimizovan za deployment na Hetzner VPS serveru sa lokalnim skladištenjem podataka.

### Ključne karakteristike:
- **Baza podataka:** PostgreSQL lokalno na VPS-u
- **Slike:** Lokalno skladištenje u `public/images/` direktoriju
- **Web server:** Nginx kao reverse proxy
- **Process manager:** PM2 za Node.js aplikaciju
- **SSL:** Let's Encrypt certifikat

Za detaljne instrukcije deployment-a, pogledajte **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Licenca

Privatni projekat - Sva prava zadržana
