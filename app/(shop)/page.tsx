import Link from "next/link"
import { ArrowRight, Package2, Sparkles, Truck, Shield, Award, CheckCircle, Star, ShoppingBag } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/ProductCard"
import { LoadMoreProducts } from "@/components/shop/LoadMoreProducts"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export default async function HomePage() {
  // Fetch istaknuti proizvodi (samo na stanju)
  const featuredProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
      stock: { gt: 0 },
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  })

  // Fetch ostali proizvodi (ne-istaknuti, samo na stanju) - prvih 10
  const otherProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: false,
      stock: { gt: 0 },
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col">
      {/* Hero sekcija - Bento Grid */}
      <section className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Lijeva strana - Video */}
            <ScrollReveal className="lg:col-span-2">
              <div className="relative rounded-[2rem] overflow-hidden min-h-[400px] lg:min-h-[500px] ring-1 ring-white/20">
                {/* Video pozadina */}
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    className="w-full h-full object-cover"
                  >
                    <source src="/hero-video.mp4" type="video/mp4" />
                  </video>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                </div>

                {/* Sadržaj */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/30 to-orange-500/20 backdrop-blur-sm rounded-full mb-4 w-fit ring-1 ring-white/10">
                    <span className="text-amber-200 uppercase tracking-[0.2em] text-[10px] font-bold">
                      Premium Auto Kozmetika
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.1] max-w-xl tracking-tight">
                    Profesionalni proizvodi za svako vozilo
                  </h1>
                  <p className="text-white/70 mb-8 max-w-md text-[15px] leading-relaxed">
                    Dostava širom BiH. Plaćanje pouzećem. Originalni proizvodi sa garancijom kvaliteta.
                  </p>
                  <div>
                    <Link
                      href="/shop"
                      className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold hover:from-amber-500 hover:to-orange-600 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-xl shadow-orange-500/30 active:scale-[0.98]"
                    >
                      <span>Pregledaj Proizvode</span>
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Desna strana - Kartice sa staggered reveal */}
            <div className="flex flex-col gap-4">
              {/* Kartica 1 - Brza dostava - Blue accent */}
              <ScrollReveal delay={100} className="flex-1">
                <div className="group h-full relative overflow-hidden rounded-[1.5rem] p-1 bg-gradient-to-br from-sky-50/80 via-white/90 to-blue-50/60 ring-1 ring-sky-200/40 shadow-[0_4px_20px_rgba(14,165,233,0.06)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.15)] hover:ring-sky-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5">
                  <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-md shadow-sky-500/25">
                        <Truck className="h-5 w-5 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm tracking-tight">Brza dostava</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          Isporuka u roku od 1-3 radna dana na teritoriji cijele BiH.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Kartica 2 - Plaćanje pouzećem - Emerald accent */}
              <ScrollReveal delay={200} className="flex-1">
                <div className="group h-full relative overflow-hidden rounded-[1.5rem] p-1 bg-gradient-to-br from-emerald-50/80 via-white/90 to-teal-50/60 ring-1 ring-emerald-200/40 shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.15)] hover:ring-emerald-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5">
                  <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/25">
                        <Shield className="h-5 w-5 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm tracking-tight">Plaćanje pouzećem</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          Platite prilikom preuzimanja paketa. Sigurno i praktično.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Kartica 3 - Originalni proizvodi - Amber accent */}
              <ScrollReveal delay={300} className="flex-1">
                <div className="group h-full relative overflow-hidden rounded-[1.5rem] p-1 bg-gradient-to-br from-amber-50/80 via-white/90 to-orange-50/60 ring-1 ring-amber-200/40 shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.15)] hover:ring-amber-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5">
                  <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/25">
                        <Award className="h-5 w-5 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm tracking-tight">Originalni proizvodi</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          100% originalni proizvodi renomiranih brendova sa garancijom.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Istaknuti proizvodi - Bento Grid */}
      {featuredProducts.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 rounded-full mb-4">
                    <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
                    <span className="text-amber-700 uppercase tracking-[0.2em] text-[10px] font-bold">Istaknuto</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Istaknuti proizvodi</h2>
                </div>
                <Link
                  href="/shop"
                  className="hidden md:inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 font-medium transition-colors duration-300 group"
                >
                  <span>Vidi sve proizvode</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 gap-4">
              {/* Glavni istaknuti proizvod - lijevo */}
              {featuredProducts[0] && (
                <ScrollReveal delay={100} className="lg:col-span-2 lg:row-span-3">
                  <Link
                    href={`/product/${featuredProducts[0].slug}`}
                    className="block h-full group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-900 to-stone-900 min-h-[400px] lg:min-h-[500px] ring-1 ring-white/10 shadow-2xl shadow-amber-950/30"
                  >
                    {/* Slika */}
                    {featuredProducts[0].images[0] && (
                      <div className="absolute inset-0">
                        <img
                          src={featuredProducts[0].images[0].url}
                          alt={featuredProducts[0].name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-5 left-5 z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold text-gray-900">Najpopularnije</span>
                      </div>
                    </div>

                    {/* Popust badge */}
                    {featuredProducts[0].comparePrice && featuredProducts[0].comparePrice > featuredProducts[0].price && (
                      <div className="absolute top-5 right-5 z-10 bg-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-rose-500/30">
                        -{Math.round(((featuredProducts[0].comparePrice - featuredProducts[0].price) / featuredProducts[0].comparePrice) * 100)}%
                      </div>
                    )}

                    {/* Sadržaj */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10">
                      <div className="inline-flex items-center px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full mb-4">
                        <span className="text-white/90 text-[10px] font-semibold uppercase tracking-[0.2em]">
                          {featuredProducts[0].category.name}
                        </span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors duration-300 tracking-tight leading-tight">
                        {featuredProducts[0].name}
                      </h3>
                      {featuredProducts[0].shortDesc && (
                        <p className="text-white/70 mb-5 line-clamp-2 max-w-lg text-[15px] leading-relaxed">
                          {featuredProducts[0].shortDesc}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-bold text-white tabular-nums">{featuredProducts[0].price.toFixed(2)}</span>
                          <span className="text-white/60 text-sm">KM</span>
                        </div>
                        {featuredProducts[0].comparePrice && featuredProducts[0].comparePrice > featuredProducts[0].price && (
                          <span className="text-white/40 line-through text-sm tabular-nums">{featuredProducts[0].comparePrice.toFixed(2)} KM</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {/* Ostali proizvodi - desno */}
              {featuredProducts.slice(1, 4).map((product, index) => (
                <ScrollReveal key={product.id} delay={200 + index * 100}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="block h-full group relative overflow-hidden rounded-[1.5rem] p-1 bg-gradient-to-br from-amber-100/40 to-white/60 ring-1 ring-amber-200/30 shadow-[0_4px_20px_rgba(120,53,15,0.06)] hover:shadow-[0_12px_32px_rgba(120,53,15,0.12)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                  >
                    <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white p-4 flex gap-4">
                      {/* Slika proizvoda */}
                      <div className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 rounded-xl overflow-hidden bg-stone-50 ring-1 ring-stone-100">
                        {product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-100">
                            <Package2 className="w-6 h-6 text-stone-400" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600 mb-1">
                          {product.category.name}
                        </span>
                        <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2 mb-2 text-sm tracking-tight leading-snug">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-gray-900 tabular-nums">{product.price.toFixed(2)}</span>
                          <span className="text-xs text-gray-400">KM</span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-xs text-gray-400 line-through tabular-nums">{product.comparePrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-8 md:hidden text-center">
              <Link
                href="/shop"
                className="inline-flex items-center text-gray-900 hover:text-yellow-600 font-semibold transition"
              >
                Vidi sve proizvode
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Ostali proizvodi */}
      {otherProducts.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full mb-4">
                    <ShoppingBag className="h-3.5 w-3.5 text-stone-600" strokeWidth={1.5} />
                    <span className="text-stone-600 uppercase tracking-[0.2em] text-[10px] font-bold">Katalog</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Ostali proizvodi</h2>
                </div>
                <Link
                  href="/shop"
                  className="hidden md:inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 font-medium transition-colors duration-300 group"
                >
                  <span>Vidi sve proizvode</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </ScrollReveal>

            <LoadMoreProducts initialProducts={otherProducts} initialOffset={10} />

            <div className="mt-10 md:hidden text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 font-medium transition-colors duration-300"
              >
                <span>Vidi sve proizvode</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Kategorije proizvoda */}
      <section className="py-24 bg-gradient-to-b from-stone-50/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-12">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-amber-100/80 rounded-full mb-4">
                  <span className="text-amber-700 uppercase tracking-[0.2em] text-[10px] font-bold">Kategorije</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Naši proizvodi</h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 font-medium transition-colors duration-300 group"
              >
                <span>Vidi sve proizvode</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ScrollReveal delay={100}>
              <Link
                href="/shop?category=auto-kozmetika"
                className="block group rounded-[1.75rem] p-1.5 bg-gradient-to-br from-sky-50/60 via-white/80 to-blue-50/40 ring-1 ring-sky-200/40 shadow-[0_4px_24px_rgba(14,165,233,0.06)] hover:shadow-[0_16px_48px_rgba(14,165,233,0.15)] hover:ring-sky-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] overflow-hidden bg-white/80 backdrop-blur-sm">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src="/categories/Autokozmetika.png"
                      alt="Auto Kozmetika"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-sky-600 transition-colors duration-300 tracking-tight">
                      Auto Kozmetika
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Premium proizvodi za čišćenje i zaštitu vozila.
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Link
                href="/shop?category=repromatrijali"
                className="block group rounded-[1.75rem] p-1.5 bg-gradient-to-br from-violet-50/60 via-white/80 to-purple-50/40 ring-1 ring-violet-200/40 shadow-[0_4px_24px_rgba(139,92,246,0.06)] hover:shadow-[0_16px_48px_rgba(139,92,246,0.15)] hover:ring-violet-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] overflow-hidden bg-white/80 backdrop-blur-sm">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src="/categories/repromaterijal.png"
                      alt="Repromatrijali"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-900/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-violet-600 transition-colors duration-300 tracking-tight">
                      Repromatrijali
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Profesionalni materijali za lakirnicu.
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Link
                href="/shop?category=poliranje"
                className="block group rounded-[1.75rem] p-1.5 bg-gradient-to-br from-emerald-50/60 via-white/80 to-teal-50/40 ring-1 ring-emerald-200/40 shadow-[0_4px_24px_rgba(16,185,129,0.06)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.15)] hover:ring-emerald-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] overflow-hidden bg-white/80 backdrop-blur-sm">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src="/categories/poliranje.png"
                      alt="Poliranje & Detailing"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-emerald-600 transition-colors duration-300 tracking-tight">
                      Poliranje & Detailing
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Paste i sredstva za profesionalno poliranje.
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>

          <div className="mt-10 md:hidden text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 font-medium transition-colors duration-300"
            >
              <span>Vidi sve proizvode</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Zašto mi */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mb-5 shadow-lg shadow-violet-500/25">
                <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                <span className="text-white uppercase tracking-[0.2em] text-[10px] font-bold">Zašto GlossDrive</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Prednosti kupovine kod nas</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Kartica 1 - Violet */}
            <ScrollReveal delay={100}>
              <div className="group h-full rounded-[1.5rem] p-1 bg-gradient-to-br from-violet-50/70 via-white/80 to-purple-50/50 ring-1 ring-violet-200/40 shadow-[0_4px_20px_rgba(139,92,246,0.06)] hover:shadow-[0_12px_32px_rgba(139,92,246,0.15)] hover:ring-violet-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <CheckCircle className="text-white" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 tracking-tight">Provjereni proizvodi</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Testirani od strane našeg tima stručnjaka
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Kartica 2 - Sky */}
            <ScrollReveal delay={200}>
              <div className="group h-full rounded-[1.5rem] p-1 bg-gradient-to-br from-sky-50/70 via-white/80 to-cyan-50/50 ring-1 ring-sky-200/40 shadow-[0_4px_20px_rgba(14,165,233,0.06)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.15)] hover:ring-sky-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <Truck className="text-white" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 tracking-tight">Brza dostava</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    1-3 radna dana na vašu adresu u BiH
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Kartica 3 - Emerald */}
            <ScrollReveal delay={300}>
              <div className="group h-full rounded-[1.5rem] p-1 bg-gradient-to-br from-emerald-50/70 via-white/80 to-teal-50/50 ring-1 ring-emerald-200/40 shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.15)] hover:ring-emerald-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <Shield className="text-white" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 tracking-tight">Sigurna kupovina</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Plaćanje pouzećem - bez rizika
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Kartica 4 - Amber */}
            <ScrollReveal delay={400}>
              <div className="group h-full rounded-[1.5rem] p-1 bg-gradient-to-br from-amber-50/70 via-white/80 to-orange-50/50 ring-1 ring-amber-200/40 shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.15)] hover:ring-amber-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <div className="h-full rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <Award className="text-white" size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 tracking-tight">Garancija kvaliteta</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    100% originalni brendirani proizvodi
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
