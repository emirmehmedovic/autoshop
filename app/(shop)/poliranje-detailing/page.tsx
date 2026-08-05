import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Award, HelpCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/ProductCard"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Poliranje i Detailing - Profesionalni proizvodi",
  description: "Profesionalni proizvodi za poliranje i detailing automobila. Paste za poliranje, voskovi, keramički premazi i zaštita laka. Dostava širom BiH.",
  keywords: ["poliranje auta", "auto detailing", "pasta za poliranje", "vosk za auto", "keramički premaz", "zaštita laka bih"],
  url: "/poliranje-detailing",
})

const features = [
  {
    icon: Sparkles,
    title: "Profesionalni sjaj",
    description: "Paste i polir sredstva koja vraćaju duboki sjaj i uklanjaju ogrebotine",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Dugotrajnja zaštita",
    description: "Voskovi i keramički premazi koji štite lak mjesecima",
    color: "blue",
  },
  {
    icon: Award,
    title: "Pro kvaliteta",
    description: "Isti proizvodi koje koriste profesionalni detailing studiji",
    color: "orange",
  },
]

const faqItems = [
  {
    question: "Koja je razlika između voska i keramičkog premaza?",
    answer: "Vosak pruža zaštitu 1-3 mjeseca i daje topao, dubok sjaj. Keramički premaz traje 1-3 godine, pruža jaču zaštitu od kemikalija i UV zraka, ali zahtijeva profesionalnu aplikaciju za najbolje rezultate.",
  },
  {
    question: "Kako ukloniti ogrebotine sa laka?",
    answer: "Za površinske ogrebotine koristite finu polir pastu i pjenasti aplikator. Za dublje ogrebotine potreban je višestepeni proces - počnite sa grubljom pastom, pa pređite na finiju. Za najbolje rezultate koristite rotacionu ili DA polirku.",
  },
  {
    question: "Koliko često treba polirati automobil?",
    answer: "Poliranje jednom godišnje je dovoljno za većinu vozila. Češće poliranje može stanjiti lak. Umjesto toga, održavajte zaštitu redovnim nanošenjem voska ili quick detailera.",
  },
]

export default async function PoliranjePage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { category: { slug: "poliranje" } },
        { category: { slug: "detailing" } },
        { name: { contains: "polir", mode: "insensitive" } },
        { name: { contains: "vosk", mode: "insensitive" } },
        { name: { contains: "wax", mode: "insensitive" } },
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
              <p className="text-purple-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                POLIRANJE & DETAILING
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Profesionalni proizvodi za savršen sjaj
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Otkrijte svijet profesionalnog detailinga sa našom premium ponudom proizvoda
                za poliranje i zaštitu laka. Od polir pasta koje uklanjaju ogrebotine i vraćaju
                sjaj, preko luksuznih voskova, do najnovijih keramičkih premaza - imamo sve
                što vam treba za showroom finish.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bilo da ste entuzijast koji želi svoj automobil dovesti do savršenstva ili
                profesionalac u detailing industriji, naši proizvodi garantuju rezultate.
                Nudimo i kompletne setove za početnike kao i profesionalnu opremu za studije.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-600 transition"
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
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                <div className="rounded-[calc(1.5rem-4px)] overflow-hidden">
                  <img
                    src="/categories/poliranje.png"
                    alt="Poliranje i detailing automobila"
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
              Profesionalni detailing rezultati
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const colors = {
                purple: "from-purple-500/10 via-pink-400/5 to-rose-500/10",
                blue: "from-blue-500/10 via-indigo-400/5 to-violet-500/10",
                orange: "from-orange-500/10 via-amber-400/5 to-yellow-500/10",
              }
              const iconColors = {
                purple: "from-purple-500 to-pink-500 shadow-purple-500/30",
                blue: "from-blue-500 to-indigo-500 shadow-blue-500/30",
                orange: "from-orange-500 to-amber-500 shadow-orange-500/30",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Detailing proizvodi po kategorijama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Polir paste", desc: "Compound i polish za korekciju laka" },
              { title: "Voskovi", desc: "Karnauba i sintetički voskovi za zaštitu" },
              { title: "Keramički premazi", desc: "Dugotrajni SiO2 i grafenski premazi" },
              { title: "Quick detaileri", desc: "Brzo osvježavanje i zaštita između pranja" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proces poliranja */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proces profesionalnog poliranja</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Slijedite ove korake za postizanje showroom finish rezultata
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Priprema", desc: "Temeljito pranje i dekontaminacija površine clay barom" },
              { step: 2, title: "Korekcija", desc: "Poliranje compound pastom za uklanjanje defekata" },
              { step: 3, title: "Finishing", desc: "Fino poliranje za maksimalan sjaj i dubinu boje" },
              { step: 4, title: "Zaštita", desc: "Nanošenje voska ili keramičkog premaza" },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-500/30">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proizvodi */}
      {products.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Proizvodi za poliranje</h2>
                <p className="text-gray-600 mt-2">Profesionalna sredstva za detailing</p>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center text-purple-500 hover:text-purple-600 font-semibold transition"
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
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
              <HelpCircle className="h-4 w-4 text-purple-500" />
              <span className="text-purple-600 uppercase tracking-wider text-xs font-bold">FAQ</span>
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-8 lg:p-12">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Profesionalac u detailing industriji?
              </h2>
              <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
                Pogledajte našu veleprodajnu ponudu i postanite naš partner.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/veleprodaja"
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-purple-50 transition"
                >
                  Veleprodaja
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Kontaktirajte nas
                </Link>
              </div>
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
            name: "Poliranje i Detailing - GlossDrive",
            description: "Profesionalni proizvodi za poliranje i detailing automobila.",
            url: `${siteConfig.url}/poliranje-detailing`,
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
