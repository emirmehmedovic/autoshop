import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Sofa, Sparkles, Shield, HelpCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/ProductCard"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Čišćenje Enterijera - Sredstva za unutrašnjost vozila",
  description: "Profesionalna sredstva za čišćenje enterijera automobila. Proizvodi za kožu, plastiku, tekstil i tapacirano. Brza dostava širom BiH.",
  keywords: ["čišćenje enterijera auta", "sredstva za enterijer", "unutrašnjost vozila", "čišćenje kože auto", "čišćenje sjedišta", "auto enterijer bih"],
  url: "/ciscenje-enterijera",
})

const features = [
  {
    icon: Sofa,
    title: "Sve površine",
    description: "Sredstva za kožu, plastiku, tekstil, alcantaru i sve ostale materijale u vozilu",
    color: "emerald",
  },
  {
    icon: Sparkles,
    title: "Dubinsko čišćenje",
    description: "Uklanjanje tvrdokornih mrlja, prljavštine i neugodnih mirisa iz enterijera",
    color: "blue",
  },
  {
    icon: Shield,
    title: "Zaštita materijala",
    description: "Proizvodi koji čiste i štite, produžavajući vijek trajanja enterijera",
    color: "purple",
  },
]

const faqItems = [
  {
    question: "Kako očistiti kožna sjedišta u automobilu?",
    answer: "Za kožna sjedišta koristite specijalizirani čistač za kožu. Nanesite proizvod na meku krpu, nježno obrišite sjedište, a zatim koristite kondicioner za kožu koji će je nahraniti i zaštititi od pucanja.",
  },
  {
    question: "Kako ukloniti mrlje sa tekstilnih sjedišta?",
    answer: "Koristite čistač za tkanine - nanesite na mrlju, ostavite nekoliko minuta da djeluje, a zatim četkom utrljajte u vlakna. Obrišite čistom vlažnom krpom i ostavite da se osuši.",
  },
  {
    question: "Koliko često treba čistiti enterijer automobila?",
    answer: "Preporučujemo temeljito čišćenje enterijera jednom mjesečno, dok brzo brisanje prašine i prljavštine možete raditi sedmično. Za vozila sa djecom ili kućnim ljubimcima, čistite češće.",
  },
]

export default async function CiscenjeEnterijeraPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { category: { slug: "enterijer" } },
        { name: { contains: "enterijer", mode: "insensitive" } },
        { name: { contains: "koža", mode: "insensitive" } },
        { name: { contains: "plastika", mode: "insensitive" } },
      ],
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                ČIŠĆENJE ENTERIJERA
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Sredstva za besprijekornu unutrašnjost vozila
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Enterijer vašeg automobila zaslužuje posebnu pažnju. Nudimo profesionalna sredstva
                za čišćenje svih površina u kabini - od kožnih i tekstilnih sjedišta, preko plastičnih
                dijelova, do stakala i armature. Svaki proizvod je pažljivo odabran da pruži
                najbolje rezultate bez oštećenja materijala.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bilo da želite ukloniti tvrdokorne mrlje, osvježiti tekstilna sjedišta ili
                nahraniti kožu - u našoj ponudi ćete pronaći sve što vam treba za profesionalno
                čišćenje enterijera automobila. Dostava širom Bosne i Hercegovine.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition"
                >
                  Pregledaj proizvode
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Zatraži savjet
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-8 lg:p-12">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                </div>
                <div className="relative text-center text-white">
                  <Sofa className="w-20 h-20 mx-auto mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Čist enterijer</h3>
                  <p className="text-white/80">
                    Profesionalni rezultati u vašem domu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prednosti */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kompletna njega enterijera
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const colors = {
                emerald: "from-emerald-500/10 via-green-400/5 to-teal-500/10",
                blue: "from-blue-500/10 via-indigo-400/5 to-violet-500/10",
                purple: "from-purple-500/10 via-pink-400/5 to-rose-500/10",
              }
              const iconColors = {
                emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
                blue: "from-blue-500 to-indigo-500 shadow-blue-500/30",
                purple: "from-purple-500 to-pink-500 shadow-purple-500/30",
              }
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br ${colors[feature.color as keyof typeof colors]} border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
                  <div className="relative">
                    <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${iconColors[feature.color as keyof typeof iconColors]} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tipovi proizvoda */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sredstva za enterijer po tipu površine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Čistači za kožu", desc: "Čišćenje i njega kožnih površina" },
              { title: "Čistači za plastiku", desc: "Obnova i zaštita plastičnih dijelova" },
              { title: "Čistači za tekstil", desc: "Dubinsko čišćenje tkanina i tepiha" },
              { title: "Čistači za stakla", desc: "Kristalno čista stakla bez tragova" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proizvodi */}
      {products.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Proizvodi za enterijer</h2>
                <p className="text-gray-600 mt-2">Profesionalna sredstva za čišćenje unutrašnjosti</p>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center text-emerald-500 hover:text-emerald-600 font-semibold transition"
              >
                Vidi sve
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-4">
              <HelpCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600 uppercase tracking-wider text-xs font-bold">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Česta pitanja</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 lg:p-12">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Potrebna vam je pomoć pri odabiru?
              </h2>
              <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                Kontaktirajte nas i pomoći ćemo vam odabrati prave proizvode za vaš enterijer.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-full font-bold hover:bg-emerald-50 transition"
              >
                Kontaktirajte nas
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Čišćenje Enterijera - GlossDrive",
            description: "Profesionalna sredstva za čišćenje enterijera automobila.",
            url: `${siteConfig.url}/ciscenje-enterijera`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />
    </div>
  )
}
