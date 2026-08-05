import Link from "next/link"
import { ArrowRight, Package2, Sparkles, Clock, Truck, Shield, Award, CheckCircle, Star } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/ProductCard"

export default async function HomePage() {
  // Fetch istaknuti proizvodi
  const featuredProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
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

  return (
    <div className="flex flex-col">
      {/* Hero sekcija - Bento Grid */}
      <section className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Lijeva strana - Video */}
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-[500px]">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              </div>

              {/* Sadržaj */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-10">
                <p className="text-orange-400 uppercase tracking-wider text-sm mb-3 font-semibold">
                  Premium Auto Kozmetika
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight max-w-xl">
                  Profesionalni proizvodi za svako vozilo
                </h1>
                <p className="text-gray-300 mb-6 max-w-md">
                  Dostava širom BiH. Plaćanje pouzećem. Originalni proizvodi sa garancijom kvaliteta.
                </p>
                <div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
                  >
                    Pregledaj Proizvode
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Desna strana - Kartice Glassmorphism */}
            <div className="flex flex-col gap-4">
              {/* Kartica 1 - Brza dostava */}
              <div className="group flex-1 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-sky-500/10 via-blue-400/5 to-cyan-500/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(14,165,233,0.1)] hover:shadow-[0_8px_32px_rgba(14,165,233,0.2)] hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-lg shadow-sky-500/20 backdrop-blur-sm border border-white/50">
                    <Truck className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">BRZA DOSTAVA</h3>
                    <p className="text-sm text-gray-700">
                      Isporuka u roku od 1-3 radna dana na teritoriji cijele BiH.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kartica 2 - Plaćanje pouzećem */}
              <div className="group flex-1 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-blue-500/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(59,130,246,0.1)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.2)] hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-white/50">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">PLAĆANJE POUZEĆEM</h3>
                    <p className="text-sm text-gray-700">
                      Platite prilikom preuzimanja paketa. Sigurno i praktično.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kartica 3 - Originalni proizvodi */}
              <div className="group flex-1 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 via-slate-400/5 to-indigo-500/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(99,102,241,0.1)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.2)] hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-lg shadow-indigo-500/20 backdrop-blur-sm border border-white/50">
                    <Award className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">ORIGINALNI PROIZVODI</h3>
                    <p className="text-sm text-gray-700">
                      100% originalni proizvodi renomiranih brendova sa garancijom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Istaknuti proizvodi - Bento Grid */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full mb-3">
                  <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                  <span className="text-orange-600 uppercase tracking-wider text-xs font-bold">Istaknuto</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Istaknuti proizvodi</h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center text-gray-900 hover:text-orange-500 font-semibold transition"
              >
                Vidi sve proizvode
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Glavni istaknuti proizvod - lijevo */}
              {featuredProducts[0] && (
                <Link
                  href={`/product/${featuredProducts[0].slug}`}
                  className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 min-h-[400px] lg:min-h-[500px] border-[5px] border-white/80"
                >
                  {/* Slika */}
                  {featuredProducts[0].images[0] && (
                    <div className="absolute inset-0">
                      <img
                        src={featuredProducts[0].images[0].url}
                        alt={featuredProducts[0].name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                      <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                      <span className="text-sm font-bold text-gray-900">Najpopularnije</span>
                    </div>
                  </div>

                  {/* Popust badge */}
                  {featuredProducts[0].comparePrice && featuredProducts[0].comparePrice > featuredProducts[0].price && (
                    <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                      -{Math.round(((featuredProducts[0].comparePrice - featuredProducts[0].price) / featuredProducts[0].comparePrice) * 100)}%
                    </div>
                  )}

                  {/* Sadržaj */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider mb-3">
                      {featuredProducts[0].category.name}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-orange-200 transition">
                      {featuredProducts[0].name}
                    </h3>
                    {featuredProducts[0].shortDesc && (
                      <p className="text-white/80 mb-4 line-clamp-2 max-w-lg">
                        {featuredProducts[0].shortDesc}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{featuredProducts[0].price.toFixed(2)}</span>
                        <span className="text-white/70">KM</span>
                      </div>
                      {featuredProducts[0].comparePrice && featuredProducts[0].comparePrice > featuredProducts[0].price && (
                        <span className="text-white/50 line-through">{featuredProducts[0].comparePrice.toFixed(2)} KM</span>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {/* Ostali proizvodi - desno */}
              {featuredProducts.slice(1, 4).map((product, index) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className={`group relative overflow-hidden rounded-2xl min-h-[160px] ${
                    index === 0
                      ? 'bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-violet-500/20'
                      : index === 1
                        ? 'bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-500/20'
                        : 'bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-rose-500/20'
                  } backdrop-blur-xl border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 pointer-events-none" />

                  <div className="relative h-full p-5 flex gap-4">
                    {/* Slika proizvoda */}
                    <div className="w-24 h-24 lg:w-28 lg:h-28 shrink-0 rounded-xl overflow-hidden bg-white shadow-md">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        {product.category.name}
                      </span>
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">{product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">KM</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">{product.comparePrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-gray-900" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 md:hidden text-center">
              <Link
                href="/shop"
                className="inline-flex items-center text-gray-900 hover:text-orange-500 font-semibold transition"
              >
                Vidi sve proizvode
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Kategorije proizvoda */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-orange-500 uppercase tracking-wider text-sm mb-2 font-semibold">KATEGORIJE</p>
              <h2 className="text-3xl font-bold text-gray-900">Naši proizvodi</h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center text-gray-900 hover:text-orange-500 font-semibold transition"
            >
              Vidi sve proizvode
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/shop?category=auto-kozmetika"
              className="group backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-orange-50/90 rounded-2xl overflow-hidden border-[5px] border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="/categories/Autokozmetika.png"
                  alt="Auto Kozmetika"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition">
                  Auto Kozmetika
                </h3>
                <p className="text-sm text-gray-600">
                  Premium proizvodi za čišćenje i zaštitu vozila.
                </p>
              </div>
            </Link>

            <Link
              href="/shop?category=repromatrijali"
              className="group backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-blue-50/90 rounded-2xl overflow-hidden border-[5px] border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="/categories/repromaterijal.png"
                  alt="Repromatrijali"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition">
                  Repromatrijali
                </h3>
                <p className="text-sm text-gray-600">
                  Profesionalni materijali za lakirnicu.
                </p>
              </div>
            </Link>

            <Link
              href="/shop?category=poliranje"
              className="group backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-purple-50/90 rounded-2xl overflow-hidden border-[5px] border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="/categories/poliranje.png"
                  alt="Poliranje & Detailing"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition">
                  Poliranje & Detailing
                </h3>
                <p className="text-sm text-gray-600">
                  Paste i sredstva za profesionalno poliranje.
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link
              href="/shop"
              className="inline-flex items-center text-gray-900 hover:text-orange-500 font-semibold transition"
            >
              Vidi sve proizvode
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Zašto mi - Glassmorphism */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span className="text-orange-600 uppercase tracking-wider text-xs font-bold">Zašto GlossDrive</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Prednosti kupovine kod nas</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Kartica 1 */}
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-yellow-500/10 border-[5px] border-white/80 shadow-[0_4px_24px_rgba(249,115,22,0.1)] hover:shadow-[0_8px_32px_rgba(249,115,22,0.2)] hover:scale-[1.03] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Provjereni proizvodi</h3>
                <p className="text-gray-600 text-sm">
                  Testirani od strane našeg tima stručnjaka
                </p>
              </div>
            </div>

            {/* Kartica 2 */}
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-violet-500/10 border-[5px] border-white/80 shadow-[0_4px_24px_rgba(59,130,246,0.1)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.2)] hover:scale-[1.03] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Brza dostava</h3>
                <p className="text-gray-600 text-sm">
                  1-3 radna dana na vašu adresu u BiH
                </p>
              </div>
            </div>

            {/* Kartica 3 */}
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10 border-[5px] border-white/80 shadow-[0_4px_24px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.2)] hover:scale-[1.03] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Sigurna kupovina</h3>
                <p className="text-gray-600 text-sm">
                  Plaćanje pouzećem - bez rizika
                </p>
              </div>
            </div>

            {/* Kartica 4 */}
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-pink-400/5 to-rose-500/10 border-[5px] border-white/80 shadow-[0_4px_24px_rgba(168,85,247,0.1)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.2)] hover:scale-[1.03] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Award className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Garancija kvaliteta</h3>
                <p className="text-gray-600 text-sm">
                  100% originalni brendirani proizvodi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
