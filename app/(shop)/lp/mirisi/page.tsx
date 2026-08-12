import Link from "next/link"
import { ArrowRight, Check, Wind, Clock, Sparkles, Quote } from "lucide-react"
import type { Metadata } from "next"
import { LandingOrderForm } from "@/components/shop/LandingOrderForm"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Premium Auto Mirisi | Luksuz u Svakom Udisaju",
  description: "Pretvori svaku vožnju u ritual. Premium mirisi za ventilaciju auta inspirirani luksuznim brendovima. Elegancija, dugotrajnost, jednostavna montaža.",
}

// Slug proizvoda za landing page - promijeni prema potrebi
const PRODUCT_SLUG = "premium-auto-miris"

export default async function CarScentsLandingPage() {
  // Fetch proizvod sa opcijama iz baze
  const product = await prisma.product.findFirst({
    where: {
      slug: PRODUCT_SLUG,
      isActive: true,
    },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
      options: {
        orderBy: { sortOrder: "asc" },
        include: {
          values: {
            where: { isAvailable: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  })

  if (!product) {
    // Ako proizvod ne postoji, prikaži stranicu bez forme
    // ili možeš koristiti notFound()
    console.warn(`Product with slug "${PRODUCT_SLUG}" not found for landing page`)
  }

  return (
    <div className="flex flex-col bg-[#faf8f5] min-h-screen">
      {/* Hero Section */}
      <section className="relative -mt-28 pt-28 pb-8 lg:pb-12 bg-gradient-to-b from-amber-950 via-amber-950 to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-[#1a1410] to-neutral-900 min-h-[85vh] flex items-center">
        {/* Ambient light effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(180,140,100,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(160,120,80,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(120,90,60,0.1),transparent_40%)]" />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)"/%3E%3C/svg%3E")' }} />

            <div className="relative w-full px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-900/30 border border-amber-700/30 rounded-full mb-8">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-amber-200/70">Premium Kolekcija</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-8 leading-[1.1] tracking-tight">
                Pretvori svaku
                <br />
                vožnju u <span className="italic text-amber-200">ritual</span>
              </h1>

              <p className="text-lg md:text-xl text-amber-100/50 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Luksuzni mirisi za ventilaciju auta inspirirani najboljim parfimerskim kućama svijeta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link
                  href="/shop?category=mirisi-za-auto"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-200 to-amber-100 text-amber-950 text-sm uppercase tracking-wider hover:from-amber-100 hover:to-white transition-all rounded-full"
                >
                  Naruči odmah
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
                <a
                  href="#kolekcija"
                  className="inline-flex items-center justify-center px-8 py-4 border border-amber-200/20 text-amber-100 text-sm uppercase tracking-wider hover:bg-amber-200/5 transition-all rounded-full"
                >
                  Vidi mirise
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-amber-200/40">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500/70" />
                  <span>Dostava 1-3 dana</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500/70" />
                  <span>Plaćanje pouzećem</span>
                </div>
              </div>
            </div>

            {/* Right - Product Visual */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-700/30 via-amber-900/20 to-transparent rounded-3xl blur-3xl scale-110" />

              <div className="relative aspect-[4/5] bg-gradient-to-br from-amber-900/40 to-amber-950/60 backdrop-blur-sm border border-amber-500/10 rounded-3xl flex flex-col items-center justify-center overflow-hidden p-8">
                {/* Inner gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,140,100,0.15),transparent_70%)]" />

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-600/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-800/10 to-transparent" />

                {/* LUXE badge */}
                <div className="relative mb-6">
                  <div className="px-6 py-2 bg-gradient-to-b from-amber-900/80 to-amber-950 rounded-lg border border-amber-500/20 shadow-xl shadow-amber-900/50">
                    <span className="text-amber-200/90 font-light text-sm tracking-[0.5em]">LUXE</span>
                  </div>
                </div>

                {/* Product image */}
                <div className="relative flex-1 flex items-center justify-center w-full">
                  <img
                    src="/products/premium-auto-miris.png"
                    alt="Premium Auto Miris - Luksuzni miris za ventilaciju"
                    className="w-full max-w-xs object-contain rounded-2xl drop-shadow-2xl"
                  />
                </div>

                {/* Price */}
                <div className="relative mt-6 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/50 mb-1">Premium Car Fragrance</p>
                  <p className="text-amber-200/60 text-sm">Već od <span className="text-amber-100 font-medium">25 KM</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-800/30">
            <div className="flex items-center justify-center gap-4 py-8 px-6">
              <div className="w-12 h-12 rounded-full bg-amber-800/30 border border-amber-700/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-amber-100">Do 4 mjeseca</p>
                <p className="text-sm text-amber-200/50">+ 10ml refill bočica</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-8 px-6">
              <div className="w-12 h-12 rounded-full bg-amber-800/30 border border-amber-700/30 flex items-center justify-center">
                <Wind className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-amber-100">Jednostavna montaža</p>
                <p className="text-sm text-amber-200/50">Clip-on sistem</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-8 px-6">
              <div className="w-12 h-12 rounded-full bg-amber-800/30 border border-amber-700/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-amber-100">Premium formule</p>
                <p className="text-sm text-amber-200/50">Luksuzne note</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Scents Collection */}
      <section id="kolekcija" className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-950 via-[#1a1410] to-amber-950 py-20 lg:py-28 px-6 sm:px-10 lg:px-16">
            {/* Ambient effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(180,140,100,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(160,120,80,0.1),transparent_50%)]" />

            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-500/60 mb-4">Kolekcija</p>
                  <h2 className="text-3xl md:text-4xl font-light text-amber-100">
                    Pronađi svoju notu
                  </h2>
                </div>
                <Link
                  href="/shop?category=miris-za-auto"
                  className="group inline-flex items-center text-sm text-amber-300/60 hover:text-amber-200 transition-colors"
                >
                  Pogledaj sve mirise
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Collection 1 - Luxury Collection */}
                <Link href="/product/luxury-collection-miris-za-auto" className="group">
                  <div className="mb-5 overflow-hidden rounded-2xl border border-amber-700/20 group-hover:border-amber-600/40 transition-all">
                    <img
                      src="/products/luxury.png"
                      alt="Luxury Collection"
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105 rounded-2xl"
                    />
                  </div>
                  <h3 className="font-medium text-amber-100 mb-1">Luxury Collection</h3>
                  <p className="text-sm text-amber-200/40 mb-2">Ekskluzivne premium note za istinske poznavaoce</p>
                  <p className="text-sm font-medium text-amber-300">25 KM</p>
                </Link>

                {/* Collection 2 - Signature Collection */}
                <Link href="/product/signature-collection-miris-za-auto" className="group">
                  <div className="mb-5 overflow-hidden rounded-2xl border border-amber-700/20 group-hover:border-amber-600/40 transition-all">
                    <img
                      src="/products/signature.png"
                      alt="Signature Collection"
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105 rounded-2xl"
                    />
                  </div>
                  <h3 className="font-medium text-amber-100 mb-1">Signature Collection</h3>
                  <p className="text-sm text-amber-200/40 mb-2">Jedinstveni potpisi koji definiraju vaš stil</p>
                  <p className="text-sm font-medium text-amber-300">25 KM</p>
                </Link>

                {/* Collection 3 - Performance Collection */}
                <Link href="/product/performance-collection-miris-za-auto" className="group">
                  <div className="mb-5 overflow-hidden rounded-2xl border border-amber-700/20 group-hover:border-amber-600/40 transition-all">
                    <img
                      src="/products/performance.png"
                      alt="Performance Collection"
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105 rounded-2xl"
                    />
                  </div>
                  <h3 className="font-medium text-amber-100 mb-1">Performance Collection</h3>
                  <p className="text-sm text-amber-200/40 mb-2">Energične note za dinamičnu vožnju</p>
                  <p className="text-sm font-medium text-amber-300">25 KM</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      {product && (
        <section id="naruci" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left - Info */}
              <div className="lg:sticky lg:top-32">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-700/60 mb-4">Brza narudžba</p>
                <h2 className="text-3xl md:text-4xl font-light text-amber-950 mb-6 leading-tight">
                  Naruči svoj <span className="italic">ritual</span>
                </h2>
                <p className="text-amber-900/70 mb-8 leading-relaxed">
                  Odaberi omiljeni miris, unesi podatke za dostavu i tvoj premium auto parfem stiže za 1-3 radna dana. Plaćanje pouzećem.
                </p>

                {/* Product preview */}
                <div className="bg-gradient-to-br from-amber-900/90 to-amber-950 rounded-2xl p-8 mb-8">
                  <div className="flex items-center gap-6 mb-6">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border border-amber-500/20"
                      />
                    ) : (
                      <div className="w-20 h-12 bg-gradient-to-b from-amber-800/60 to-amber-900/80 rounded flex items-center justify-center border border-amber-500/20">
                        <span className="text-amber-200/90 text-[10px] tracking-[0.3em]">LUXE</span>
                      </div>
                    )}
                    <div>
                      <p className="text-amber-100 font-medium">{product.name}</p>
                      <p className="text-amber-300/60 text-sm">Clip-on za ventilaciju</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-amber-200/70">
                      <Check className="w-4 h-4 text-amber-500" />
                      <span>Do 4 mjeseca intenzivnog mirisa</span>
                    </div>
                    <div className="flex items-center gap-3 text-amber-200/70">
                      <Check className="w-4 h-4 text-amber-500" />
                      <span>Uključena 10ml refill bočica</span>
                    </div>
                    <div className="flex items-center gap-3 text-amber-200/70">
                      <Check className="w-4 h-4 text-amber-500" />
                      <span>Luksuzne parfimerske note</span>
                    </div>
                  </div>
                </div>

                {/* Price highlight */}
                <div className="flex items-baseline gap-3">
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-amber-500/60 line-through text-lg">
                      {product.comparePrice.toFixed(2)} KM
                    </span>
                  )}
                  <span className="text-4xl font-light text-amber-950">
                    {product.price.toFixed(2)} KM
                  </span>
                  <span className="text-amber-700/60">po komadu</span>
                </div>
              </div>

              {/* Right - Form */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/50 shadow-xl shadow-amber-900/5">
                <LandingOrderForm product={product} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Image grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/products/miris-1.png"
                  alt="Premium auto miris"
                  className="w-full rounded-2xl"
                />
                <img
                  src="/products/miris-2.png"
                  alt="Premium auto miris"
                  className="w-full rounded-2xl"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="/products/miris-3.png"
                  alt="Premium auto miris"
                  className="w-full rounded-2xl"
                />
                <img
                  src="/products/miris-4.png"
                  alt="Premium auto miris"
                  className="w-full rounded-2xl"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700/60 mb-4">O proizvodu</p>
              <h2 className="text-3xl md:text-4xl font-light text-amber-950 mb-6 leading-tight">
                Dizajniran za one koji cijene <span className="italic">detalje</span>
              </h2>
              <p className="text-amber-900/70 mb-6 leading-relaxed">
                Naši auto mirisi nisu obični osvježivači. To je pažljivo komponovana simfonija nota koje transformišu vaš automobil u prostor za uživanje.
              </p>
              <p className="text-amber-900/70 mb-8 leading-relaxed">
                Svaki miris prolazi kroz višemjesečni proces razvoja, inspirirani formulama luksuznih parfimerskih kuća, prilagođeni specifičnim uvjetima automobilskog enterijera.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-gradient-to-br from-amber-100/60 to-amber-50/40 rounded-xl border border-amber-200/50">
                  <p className="text-3xl font-light text-amber-900 mb-1">500+</p>
                  <p className="text-sm text-amber-700/60">Zadovoljnih kupaca</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-amber-100/60 to-amber-50/40 rounded-xl border border-amber-200/50">
                  <p className="text-3xl font-light text-amber-900 mb-1">4.9</p>
                  <p className="text-sm text-amber-700/60">Prosječna ocjena</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700/60 mb-4">Kako funkcioniše</p>
            <h2 className="text-3xl md:text-4xl font-light text-amber-950">
              Jednostavno kao 1, 2, 3
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-gradient-to-br from-[#faf8f5] to-amber-50/50 rounded-2xl p-8 border border-amber-200/50 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5 transition-all group">
              <div className="absolute -top-4 left-8 px-3 py-1 bg-gradient-to-r from-amber-900 to-amber-800 text-amber-100 text-xs tracking-wider">
                KORAK 01
              </div>
              <div className="pt-4">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center border border-amber-200/50 group-hover:from-amber-900 group-hover:to-amber-800 group-hover:border-amber-700 transition-all">
                  <svg className="w-7 h-7 text-amber-700 group-hover:text-amber-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-amber-950 mb-3">Odaberi miris</h3>
                <p className="text-amber-800/60 leading-relaxed">
                  Pregledaj našu kolekciju i pronađi notu koja odgovara tvom stilu.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-gradient-to-br from-[#faf8f5] to-amber-50/50 rounded-2xl p-8 border border-amber-200/50 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5 transition-all group">
              <div className="absolute -top-4 left-8 px-3 py-1 bg-gradient-to-r from-amber-900 to-amber-800 text-amber-100 text-xs tracking-wider">
                KORAK 02
              </div>
              <div className="pt-4">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center border border-amber-200/50 group-hover:from-amber-900 group-hover:to-amber-800 group-hover:border-amber-700 transition-all">
                  <svg className="w-7 h-7 text-amber-700 group-hover:text-amber-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-amber-950 mb-3">Postavi na vent</h3>
                <p className="text-amber-800/60 leading-relaxed">
                  Jednostavno umetni u lamele ventilacije klime. Traje 10 sekundi.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-gradient-to-br from-[#faf8f5] to-amber-50/50 rounded-2xl p-8 border border-amber-200/50 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5 transition-all group">
              <div className="absolute -top-4 left-8 px-3 py-1 bg-gradient-to-r from-amber-900 to-amber-800 text-amber-100 text-xs tracking-wider">
                KORAK 03
              </div>
              <div className="pt-4">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center border border-amber-200/50 group-hover:from-amber-900 group-hover:to-amber-800 group-hover:border-amber-700 transition-all">
                  <svg className="w-7 h-7 text-amber-700 group-hover:text-amber-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-amber-950 mb-3">Uživaj u vožnji</h3>
                <p className="text-amber-800/60 leading-relaxed">
                  Uključi klimu i pusti da miris ispuni cijeli enterijer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700/60 mb-4">Recenzije</p>
            <h2 className="text-3xl md:text-4xl font-light text-amber-950">
              Glasovi zadovoljnih vozača
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 border border-amber-200/50 shadow-sm">
              <Quote className="w-8 h-8 text-amber-300 mb-6" />
              <p className="text-amber-900/70 mb-8 leading-relaxed">
                &ldquo;Woody Oud me podsjeća na lobby luksuznog hotela. Svaki put kad uđem u auto, osjećam se posebno. Traje nevjerovatno dugo.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-amber-100 font-medium">
                  A
                </div>
                <div>
                  <p className="font-medium text-amber-950">Amir H.</p>
                  <p className="text-sm text-amber-700/50">BMW 5 Series</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 border border-amber-200/50 shadow-sm">
              <Quote className="w-8 h-8 text-amber-300 mb-6" />
              <p className="text-amber-900/70 mb-8 leading-relaxed">
                &ldquo;Napokon nešto elegantno za auto. Dizajn se savršeno uklapa u enterijer. Black Leather je pun pogodak.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-amber-100 font-medium">
                  E
                </div>
                <div>
                  <p className="font-medium text-amber-950">Edin M.</p>
                  <p className="text-sm text-amber-700/50">Mercedes C-Class</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 border border-amber-200/50 shadow-sm">
              <Quote className="w-8 h-8 text-amber-300 mb-6" />
              <p className="text-amber-900/70 mb-8 leading-relaxed">
                &ldquo;Sakura je suptilna i ženstvena, bez onog agresivnog mirisa kao kod običnih osvježivača. Oduševljena sam.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 font-medium">
                  L
                </div>
                <div>
                  <p className="font-medium text-amber-950">Lejla K.</p>
                  <p className="text-sm text-amber-700/50">Audi A3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-[#1a1410] to-amber-950 py-20 lg:py-28 px-6 sm:px-10 lg:px-16">
            {/* Ambient effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,140,100,0.2),transparent_60%)]" />

            <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500/60 mb-4">Spreman za upgrade?</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-amber-100 mb-6">
            Tvoj auto zaslužuje <span className="italic text-amber-300">više</span>
          </h2>
          <p className="text-lg text-amber-200/50 mb-12 max-w-2xl mx-auto">
            Pridruži se stotinama vozača koji su transformisali svoje iskustvo vožnje sa premium mirisima.
          </p>

          {/* Price card */}
          <div className="inline-block bg-amber-900/30 border border-amber-700/30 backdrop-blur-sm rounded-2xl p-8 mb-10">
            <div className="flex items-center justify-center gap-6">
              <div className="text-left">
                <p className="text-sm text-amber-300/60 mb-1">Premium Auto Miris</p>
                <p className="text-amber-100">+ 10ml refill bočica</p>
              </div>
              <div className="w-px h-12 bg-amber-700/30" />
              <div className="text-right">
                <p className="text-sm text-amber-400/50 line-through">29 KM</p>
                <p className="text-3xl font-light text-amber-200">25 KM</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <Link
              href="/shop?category=miris-za-auto"
              className="group inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-amber-200 to-amber-100 text-amber-950 text-sm uppercase tracking-wider hover:from-amber-100 hover:to-white transition-all"
            >
              Naruči svoj miris
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </div>

          {/* Final trust points */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-amber-300/50">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-500/60" />
              <span>Besplatna dostava iznad 50 KM</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-500/60" />
              <span>Plaćanje pouzećem</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-500/60" />
              <span>Garancija kvalitete</span>
            </div>
          </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
