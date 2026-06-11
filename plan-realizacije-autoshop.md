# Plan Realizacije — Auto Kozmetika & Repromatrijali Shop

> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · Prisma ORM · NextAuth.js v5  
> **Tip projekta:** B2C + B2B e-commerce s admin panelom  
> **Tržište:** BiH · Jezik: BHS · Plaćanje: Pouzećem (COD)  
> **Datum izrade plana:** Juni 2026

---

## 1. Pregled Arhitekture

```
autoshop/
├── app/                          # Next.js App Router
│   ├── (shop)/                   # Public shop routes
│   │   ├── page.tsx              # Homepage
│   │   ├── shop/                 # Katalog proizvoda
│   │   ├── product/[slug]/       # Stranica proizvoda
│   │   ├── category/[slug]/      # Kategorija
│   │   ├── cart/                 # Korpa
│   │   ├── checkout/             # Narudžba
│   │   ├── order/[id]/           # Potvrda narudžbe
│   │   ├── blog/                 # Blog index
│   │   ├── blog/[slug]/          # Blog post
│   │   └── landing/[slug]/       # Campaign landing pages
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   └── register/
│   ├── (account)/                # Korisnički panel
│   │   ├── orders/
│   │   ├── profile/
│   │   └── b2b/                  # B2B specifičan panel
│   ├── admin/                    # Admin panel (zaštićen)
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── customers/
│   │   ├── blog/
│   │   ├── landing-pages/
│   │   ├── analytics/
│   │   └── settings/
│   └── api/                      # API route handlers
│       ├── auth/
│       ├── orders/
│       ├── products/
│       ├── webhooks/
│       └── notifications/
├── components/
│   ├── ui/                       # Bazne UI komponente
│   ├── shop/                     # Shop-specifične komponente
│   ├── admin/                    # Admin komponente
│   └── landing/                  # Landing page blokovi
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── notifications/
│   │   ├── email.ts              # Resend / Nodemailer
│   │   └── telegram.ts           # Telegram Bot API
│   └── analytics/
│       ├── meta-pixel.ts
│       └── clarity.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── public/
```

---

## 2. Baza Podataka — Prisma Schema

### 2.1 Korisnici i autentifikacija

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  passwordHash  String?
  role          UserRole  @default(CUSTOMER)
  customerType  CustomerType @default(B2C)
  isApproved    Boolean   @default(true)   // false za B2B dok admin ne odobri
  createdAt     DateTime  @default(now())

  addresses     Address[]
  orders        Order[]
  b2bProfile    B2BProfile?
  sessions      Session[]
}

enum UserRole {
  ADMIN
  CUSTOMER
}

enum CustomerType {
  B2C
  B2B
}

model B2BProfile {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  companyName   String
  pib           String?  // PDV/PIB broj
  address       String
  contactPerson String
  priceGroupId  String?
  priceGroup    PriceGroup? @relation(fields: [priceGroupId], references: [id])
}

model PriceGroup {
  id          String       @id @default(cuid())
  name        String       // npr. "Veleprodaja A", "Veleprodaja B"
  discount    Float        // postotak popusta (0-100)
  b2bProfiles B2BProfile[]
  productPrices ProductPriceGroup[]
}
```

### 2.2 Proizvodi i kategorije

```prisma
model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  imageUrl    String?
  parentId    String?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  products    Product[]
  sortOrder   Int        @default(0)
  isVisible   Boolean    @default(true)
}

model Product {
  id             String    @id @default(cuid())
  name           String
  slug           String    @unique
  description    String
  shortDesc      String?
  sku            String    @unique
  price          Float                    // B2C cijena
  comparePrice   Float?                   // Prekrižena cijena
  stock          Int       @default(0)
  lowStockAlert  Int       @default(5)    // Upozorenje kad padne ispod
  isActive       Boolean   @default(true)
  isFeatured     Boolean   @default(false)
  categoryId     String
  category       Category  @relation(fields: [categoryId], references: [id])
  images         ProductImage[]
  tags           ProductTag[]
  orderItems     OrderItem[]
  priceGroups    ProductPriceGroup[]      // B2B cijene po grupama
  metaTitle      String?
  metaDesc       String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  alt       String?
  sortOrder Int     @default(0)
}

model ProductPriceGroup {
  id           String     @id @default(cuid())
  productId    String
  product      Product    @relation(fields: [productId], references: [id])
  priceGroupId String
  priceGroup   PriceGroup @relation(fields: [priceGroupId], references: [id])
  price        Float      // Specifična B2B cijena za ovaj proizvod
}
```

### 2.3 Narudžbe

```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique @default(cuid()) // Prikazan kupcu: #AK-2024-001
  userId          String?
  user            User?       @relation(fields: [userId], references: [id])
  
  // Guest checkout podaci
  guestName       String?
  guestEmail      String?
  guestPhone      String?

  status          OrderStatus @default(PENDING)
  paymentMethod   String      @default("COD")
  
  // Adresa dostave (snapshot u trenutku narudžbe)
  shippingName    String
  shippingPhone   String
  shippingAddress String
  shippingCity    String
  shippingZip     String?
  shippingNote    String?

  // Finansije
  subtotal        Float
  shippingCost    Float       @default(0)
  discount        Float       @default(0)
  total           Float

  // B2B
  isB2B           Boolean     @default(false)
  invoiceRequested Boolean    @default(false)
  invoiceNumber   String?

  items           OrderItem[]
  statusHistory   OrderStatusHistory[]
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum OrderStatus {
  PENDING          // Nova narudžba
  CONFIRMED        // Potvrđena
  PROCESSING       // U pripremi
  SHIPPED          // Poslana
  DELIVERED        // Dostavljena
  CANCELLED        // Otkazana
  RETURNED         // Vraćena
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id])
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  quantity    Int
  unitPrice   Float   // Snapshot cijene u trenutku narudžbe
  total       Float
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id])
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())
}
```

### 2.4 Blog i Landing Pages

```prisma
model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   // HTML / MDX
  excerpt     String?
  imageUrl    String?
  isPublished Boolean  @default(false)
  metaTitle   String?
  metaDesc    String?
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model LandingPage {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     Json     // Blokovi: hero, features, testimonials, CTA...
  isActive    Boolean  @default(true)
  metaTitle   String?
  metaDesc    String?
  // Tracking
  pixelEventName String? // npr. "Purchase", "Lead"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2.5 Analitika Ads Spenda

```prisma
model AdSpendRecord {
  id          String   @id @default(cuid())
  platform    String   // "meta", "google"
  date        DateTime
  spend       Float
  impressions Int?
  clicks      Int?
  conversions Int?
  revenue     Float?
  campaignId  String?
  campaignName String?
  createdAt   DateTime @default(now())
}
```

---

## 3. Autentifikacija — NextAuth.js v5

Koristimo **NextAuth.js v5** (Auth.js) s:
- **Credentials provider** (email + password, bcrypt hash)
- **Session strategy: JWT** (bez DB sesija, brže)
- Middleware za zaštitu `/admin/*` i `/account/*` ruta

```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user || !user.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null
        if (!user.isApproved) throw new Error("B2B nalog čeka odobrenje")
        return { id: user.id, email: user.email, role: user.role, customerType: user.customerType }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.customerType = user.customerType
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      session.user.customerType = token.customerType
      return session
    }
  }
})
```

```typescript
// middleware.ts
import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdmin = req.auth?.user?.role === "ADMIN"

  if (pathname.startsWith("/admin") && !isAdmin) {
    return Response.redirect(new URL("/login", req.url))
  }
  if (pathname.startsWith("/account") && !req.auth) {
    return Response.redirect(new URL("/login", req.url))
  }
})

export const config = { matcher: ["/admin/:path*", "/account/:path*"] }
```

---

## 4. Notifikacijski Sistem

### 4.1 Email (Resend)

```typescript
// lib/notifications/email.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationToCustomer(order: Order) {
  await resend.emails.send({
    from: "narudzbe@autoshop.ba",
    to: order.guestEmail || order.user?.email,
    subject: `Potvrda narudžbe #${order.orderNumber}`,
    html: orderConfirmationTemplate(order)
  })
}

export async function sendNewOrderToAdmin(order: Order) {
  await resend.emails.send({
    from: "sistem@autoshop.ba",
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 Nova narudžba #${order.orderNumber} — ${order.total} KM`,
    html: adminOrderTemplate(order)
  })
}
```

### 4.2 Telegram Bot

```typescript
// lib/notifications/telegram.ts
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegramNotification(message: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML"
    })
  })
}

export async function notifyNewOrder(order: Order) {
  const msg = `
🛒 <b>Nova narudžba!</b>
📦 Broj: <code>#${order.orderNumber}</code>
👤 Kupac: ${order.shippingName}
📞 Tel: ${order.shippingPhone}
💰 Iznos: <b>${order.total} KM</b> (pouzećem)
📍 Grad: ${order.shippingCity}
${order.isB2B ? "🏢 <b>B2B narudžba</b>" : ""}
  `
  await sendTelegramNotification(msg)
}
```

---

## 5. Tracking & Analitika

### 5.1 Meta Pixel

```typescript
// lib/analytics/meta-pixel.ts
// Inicijalizacija u layout.tsx putem Script komponente

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// Standard events
export const trackEvent = (event: string, data?: object) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data)
  }
}

export const trackPurchase = (order: { total: number; orderNumber: string }) => {
  trackEvent("Purchase", {
    value: order.total,
    currency: "BAM",
    order_id: order.orderNumber
  })
}

export const trackAddToCart = (product: { id: string; name: string; price: number }) => {
  trackEvent("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: "BAM"
  })
}

export const trackInitiateCheckout = (cart: { total: number; itemCount: number }) => {
  trackEvent("InitiateCheckout", {
    value: cart.total,
    num_items: cart.itemCount,
    currency: "BAM"
  })
}
```

### 5.2 Microsoft Clarity

```tsx
// components/ClarityScript.tsx
import Script from "next/script"

export function ClarityScript() {
  return (
    <Script id="clarity-script" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
      `}
    </Script>
  )
}
```

---

## 6. Admin Panel — Funkcionalnosti

### 6.1 Dashboard (/)
- Ukupan prihod danas / 7 dana / 30 dana / custom range
- Broj narudžbi po statusu (grafikon)
- Najtraženiji proizvodi (top 5)
- Niske zalihe — upozorenja
- Ad spend summary (Meta) s ROAS kalkulacijom

### 6.2 Narudžbe (/admin/orders)
- Tabela s filterima: status, datum, B2B/B2C, pretraga po broju/imenu
- Promjena statusa narudžbe s automatskim notifikacijama
- Detalj narudžbe: stavke, kupac, adresa, historija statusa
- Export u CSV
- Generacija fakture za B2B (PDF)

### 6.3 Proizvodi (/admin/products)
- CRUD za proizvode i kategorije
- Upload slika (Cloudflare R2 ili Vercel Blob)
- Upravljanje zalihama s low-stock alertima
- B2B cjenovne grupe — assignment po proizvodu
- Bulk edit stanja zaliha

### 6.4 Kupci (/admin/customers)
- Lista kupaca s filterom B2C/B2B
- B2B odobrenje novih naloga (isApproved toggle)
- Assignovanje u cjenovne grupe
- Historija narudžbi po kupcu

### 6.5 Blog (/admin/blog)
- Rich text editor (TipTap)
- SEO meta polja
- Publish/unpublish
- Thumbnail upload

### 6.6 Landing Pages (/admin/landing-pages)
- Page builder s predefiniranim blokovima:
  - Hero (naslov, podtekst, CTA, slika)
  - Features grid
  - Testimonials
  - Product showcase
  - FAQ (accordion)
  - CTA banner
- Postavljanje Meta Pixel eventa po stranici
- Preview mode

### 6.7 Analitika (/admin/analytics)

#### Prodajna statistika
- Prihod po periodu (LineChart — Recharts)
- Narudžbe po danu/tjednu/mjesecu (BarChart)
- Konverzija korpa → narudžba
- Prosjek vrijednosti narudžbe (AOV)
- Top proizvodi po prihodu i količini

#### Ad Spend statistika
- Ručni unos Meta ad spenda po danu/kampanji
- Automatski ROAS = prihod / spend
- CPA (cost per acquisition) = spend / broj narudžbi
- Grafikon spend vs prihod
- Usporedba perioda

---

## 7. Faze Razvoja

### Faza 1 — Temelji (2–3 sedmice)
- [ ] Inicijalizacija projekta (Next.js, TypeScript, Tailwind, Prisma)
- [ ] PostgreSQL setup + Prisma schema (kompletna)
- [ ] NextAuth.js v5 integracija
- [ ] Bazni layout (header, footer, navigacija)
- [ ] Sistem kategorija i proizvoda (prikaz)
- [ ] Stranica proizvoda

### Faza 2 — Kupovina (2 sedmice)
- [ ] Korpa (Zustand ili Context + localStorage)
- [ ] Checkout forma (guest + logged-in)
- [ ] COD logika narudžbe + API endpoint
- [ ] Notifikacije: email (Resend) + Telegram
- [ ] Stranica potvrde narudžbe
- [ ] Meta Pixel eventi (AddToCart, InitiateCheckout, Purchase)

### Faza 3 — Admin Panel (3 sedmice)
- [ ] Admin layout + autentifikacija (middleware)
- [ ] Dashboard s KPI widgetima
- [ ] CRUD proizvodi + kategorije + upload slika
- [ ] Upravljanje narudžbama + promjena statusa
- [ ] Upravljanje kupcima + B2B odobrenje
- [ ] Low stock alerting

### Faza 4 — B2B & Računi (1–2 sedmice)
- [ ] B2B registracija s odobrenjima
- [ ] Cjenovne grupe + assignment
- [ ] Faktura generacija (PDF — react-pdf)
- [ ] B2B korisnički panel

### Faza 5 — Content & Landing Pages (1–2 sedmice)
- [ ] Blog s TipTap editorom
- [ ] SEO meta tagovi (Next.js Metadata API)
- [ ] Landing page builder (blok sistem)
- [ ] Microsoft Clarity integracija
- [ ] Sitemap + robots.txt

### Faza 6 — Analitika & Polishing (1–2 sedmice)
- [ ] Ad Spend modul (unos + grafovi)
- [ ] Prodajna analitika dashboard
- [ ] Email templati (HTML)
- [ ] Mobile responsiveness audit
- [ ] Performance optimizacija (ISR, image optimization)
- [ ] Testiranje end-to-end flow-a

---

## 8. Environment Varijable

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://autoshop.ba"

# Email
RESEND_API_KEY="..."
ADMIN_EMAIL="admin@autoshop.ba"

# Telegram
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_CHAT_ID="..."

# Analytics
NEXT_PUBLIC_META_PIXEL_ID="..."
NEXT_PUBLIC_CLARITY_ID="..."

# Storage (slike)
CLOUDFLARE_R2_BUCKET="..."
CLOUDFLARE_R2_ACCESS_KEY="..."
CLOUDFLARE_R2_SECRET_KEY="..."
CLOUDFLARE_R2_PUBLIC_URL="..."
```

---

## 9. Tech Stack — Finalna Lista

| Kategorija | Tehnologija | Razlog |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/ISR, API routes, Metadata API |
| Jezik | TypeScript | Type safety |
| Stilovi | Tailwind CSS + shadcn/ui | Brz razvoj, konzistentnost |
| ORM | Prisma | Type-safe DB pristup |
| Baza | PostgreSQL | Relacijski podaci, ACID |
| Auth | NextAuth.js v5 | Credentials, JWT, middleware |
| Email | Resend | Moderna email API za BiH |
| Notif. | Telegram Bot API | Instant obavijesti |
| Tracking | Meta Pixel + MS Clarity | Konverzije + heatmaps |
| Rich text | TipTap | Blog editor |
| Grafovi | Recharts | Admin analitika |
| PDF | react-pdf / @react-pdf/renderer | B2B fakture |
| Upload | Cloudflare R2 | Jeftino, S3-compatible |
| State | Zustand | Korpa, UI state |
| Hosting | Vercel | Next.js optimizovan deploy |
| DNS/CDN | Cloudflare | Zaštita + brzina |

---

## 10. Sigurnost

- Rate limiting na checkout i auth endpointima (Upstash Ratelimit)
- CSRF zaštita (ugrađena u NextAuth.js)
- Input validacija — Zod schemas na svim API rutama
- Admin rute zaštićene middleware-om + server-side role check
- Slike servovane s privatnog R2 bucketa (signed URLs za admin)
- Helmet headers konfiguracija u `next.config.ts`
- B2B nalozi ne mogu kupovati dok admin ne odobri

---

*Plan je modularan — svaka faza se može razvijati i deployati nezavisno.*
