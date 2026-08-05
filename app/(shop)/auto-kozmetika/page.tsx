import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Award, CheckCircle, HelpCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/ProductCard"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Auto Kozmetika - Premium proizvodi za njegu vozila",
  description: "Otkrijte premium auto kozmetiku za profesionalnu njegu vašeg vozila. Sredstva za čišćenje, zaštitu i poliranje. Brza dostava širom BiH.",
  keywords: ["auto kozmetika", "sredstva za auto", "njega vozila bih", "auto kozmetika tuzla", "car care", "detailing proizvodi"],
  url: "/auto-kozmetika",
})

const features = [
  {
    icon: Sparkles,
    title: "Premium kvaliteta",
    description: "Samo provjereni proizvodi renomiranih svjetskih brendova",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Zaštita vozila",
    description: "Dugotrajni proizvodi koji štite vaš automobil od vanjskih utjecaja",
    color: "blue",
  },
  {
    icon: Award,
    title: "Profesionalni rezultati",
    description: "Isti proizvodi koje koriste profesionalni detailing studiji",
    color: "emerald",
  },
]

const faqItems = [
  {
    question: "Kako odabrati pravu auto kozmetiku za moje vozilo?",
    answer: "Odabir ovisi o tipu površine i vrsti zaštite koju želite. Za redovno održavanje preporučujemo set za pranje i quick detailer. Za dubinsko čišćenje pogledajte naše specijalizirane proizvode za enterijer i eksterijer.",
  },
  {
    question: "Da li su vaši proizvodi sigurni za sve tipove laka?",
    answer: "Da, svi naši proizvodi su testirani i sigurni za sve tipove laka, uključujući metalik, biserni i mat lakove. Za mat lakove imamo posebnu liniju proizvoda.",
  },
  {
    question: "Koliko često treba održavati auto kozmetikom?",
    answer: "Preporučujemo pranje svakih 1-2 sedmice, a detailing i zaštitu 2-4 puta godišnje, ovisno o uvjetima parkiranje i vožnje.",
  },
]

export default async function AutoKozmetikaPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { category: { slug: "auto-kozmetika" } },
        { category: { slug: "kozmetika" } },
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
              <p className="text-orange-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                AUTO KOZMETIKA
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Premium proizvodi za njegu vašeg vozila
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Otkrijte našu kolekciju premium auto kozmetike koja će vaš automobil učiniti
                blistavim poput novog. Od sredstava za pranje i čišćenje do profesionalnih
                proizvoda za zaštitu i poliranje - imamo sve što vam treba za savršenu njegu vozila.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bilo da ste entuzijast koji voli održavati svoj automobil ili profesionalac
                u auto industriji, naša ponuda kvalitetne auto kozmetike zadovoljit će sve
                vaše potrebe. Dostava širom Bosne i Hercegovine.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
                >
                  Pregledaj proizvode
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Zatraži ponudu
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-1">
                <div className="rounded-[calc(1.5rem-4px)] overflow-hidden">
                  <img
                    src="/categories/Autokozmetika.png"
                    alt="Auto kozmetika - premium proizvodi"
                    className="w-full h-auto object-cover"
                  />
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
              Zašto odabrati našu auto kozmetiku?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nudimo samo provjerene proizvode koji garantuju rezultate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const colors = {
                orange: "from-orange-500/10 via-amber-400/5 to-yellow-500/10",
                blue: "from-blue-500/10 via-indigo-400/5 to-violet-500/10",
                emerald: "from-emerald-500/10 via-green-400/5 to-teal-500/10",
              }
              const iconColors = {
                orange: "from-orange-500 to-amber-500 shadow-orange-500/30",
                blue: "from-blue-500 to-indigo-500 shadow-blue-500/30",
                emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
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

      {/* Kategorije proizvoda */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Vrste auto kozmetike</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Sredstva za pranje", href: "/ciscenje-eksterijera", desc: "Šamponi, pjene i sredstva za pranje" },
              { title: "Čišćenje enterijera", href: "/ciscenje-enterijera", desc: "Sredstva za kožu, plastiku i tekstil" },
              { title: "Poliranje", href: "/poliranje-detailing", desc: "Paste, vosk i zaštitni premazi" },
              { title: "Mirisi za auto", href: "/mirisi-za-auto", desc: "Osvježivači i auto parfemi" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group p-5 rounded-xl bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </Link>
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
                <h2 className="text-3xl font-bold text-gray-900">Istaknuti proizvodi</h2>
                <p className="text-gray-600 mt-2">Najpopularniji proizvodi iz naše ponude</p>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold transition"
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

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/shop"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold transition"
              >
                Vidi sve proizvode
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
              <HelpCircle className="h-4 w-4 text-orange-500" />
              <span className="text-orange-600 uppercase tracking-wider text-xs font-bold">FAQ</span>
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 lg:p-12">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent" />
            </div>
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Trebate savjet o auto kozmetici?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Naš tim stručnjaka je tu da vam pomogne odabrati prave proizvode za vaše vozilo.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
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
            name: "Auto Kozmetika - GlossDrive",
            description: "Premium auto kozmetika za profesionalnu njegu vozila. Sredstva za čišćenje, zaštitu i poliranje.",
            url: `${siteConfig.url}/auto-kozmetika`,
            provider: {
              "@type": "LocalBusiness",
              name: "GlossDrive",
              address: { "@type": "PostalAddress", addressLocality: "Tuzla", addressCountry: "BA" },
            },
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
