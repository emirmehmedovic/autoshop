import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Droplets, Sparkles, Shield, HelpCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/ProductCard"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Čišćenje Eksterijera - Sredstva za pranje automobila",
  description: "Premium sredstva za pranje i čišćenje eksterijera automobila. Šamponi, pjene za pranje, sredstva za felge i stakla. Dostava širom BiH.",
  keywords: ["pranje auta", "sredstva za pranje", "šampon za auto", "auto šampon", "čišćenje eksterijera", "pranje vozila bih"],
  url: "/ciscenje-eksterijera",
})

const features = [
  {
    icon: Droplets,
    title: "Sigurno pranje",
    description: "pH neutralni proizvodi koji ne oštećuju lak, gumu ili plastiku vozila",
    color: "blue",
  },
  {
    icon: Sparkles,
    title: "Sjaj bez mrlja",
    description: "Formule koje ostavljaju kristalno čistu površinu bez vodenih mrlja",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Zaštita laka",
    description: "Proizvodi obogaćeni zaštitnim komponentama za dugotrajni sjaj",
    color: "emerald",
  },
]

const faqItems = [
  {
    question: "Koji šampon je najbolji za pranje automobila?",
    answer: "Za redovno pranje preporučujemo pH neutralni auto šampon koji nježno čisti bez skidanja zaštitnog voska. Za dublje čišćenje koristite šampon sa jačom formulom, ali ga ne ostavljajte predugo na površini.",
  },
  {
    question: "Kako pravilno oprati automobil?",
    answer: "Uvijek perite u hladu, nikad na suncu. Koristite metodu dva kantice - jedna sa šamponom, druga sa čistom vodom za ispiranje rukavice. Perite od vrha prema dolje i ispirite često.",
  },
  {
    question: "Koliko često treba prati automobil?",
    answer: "Preporučujemo pranje svakih 1-2 sedmice za održavanje čistoće i zaštitu laka. Ako vozite po prašnjavim ili blatnim putevima, perite češće da spriječite oštećenje laka.",
  },
]

export default async function CiscenjeEksterijeraPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { category: { slug: "eksterijer" } },
        { category: { slug: "pranje" } },
        { name: { contains: "šampon", mode: "insensitive" } },
        { name: { contains: "pranje", mode: "insensitive" } },
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
              <p className="text-blue-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                ČIŠĆENJE EKSTERIJERA
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Sredstva za profesionalno pranje vozila
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Eksterijer vašeg automobila izložen je svakodnevnim utjecajima - prašini, insektima,
                kiseloj kiši i UV zrakama. Naša sredstva za pranje i čišćenje eksterijera
                osmišljena su da efikasno uklone prljavštinu, a istovremeno zaštite lak vašeg vozila.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Od profesionalnih auto šampona i pjena za pranje, preko sredstava za felge i gume,
                do specijaliziranih proizvoda za stakla - nudimo kompletan asortiman za besprijekoran
                eksterijer. Svi proizvodi su sigurni za sve tipove laka i dostupni sa dostavom širom BiH.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition"
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
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-8 lg:p-12">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                </div>
                <div className="relative text-center text-white">
                  <Droplets className="w-20 h-20 mx-auto mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Čist eksterijer</h3>
                  <p className="text-white/80">
                    Premium proizvodi za savršen sjaj
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
              Zašto odabrati naša sredstva za pranje?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const colors = {
                blue: "from-blue-500/10 via-cyan-400/5 to-sky-500/10",
                orange: "from-orange-500/10 via-amber-400/5 to-yellow-500/10",
                emerald: "from-emerald-500/10 via-green-400/5 to-teal-500/10",
              }
              const iconColors = {
                blue: "from-blue-500 to-cyan-500 shadow-blue-500/30",
                orange: "from-orange-500 to-amber-500 shadow-orange-500/30",
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

      {/* Tipovi proizvoda */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sredstva za eksterijer po namjeni</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Auto šamponi", desc: "pH neutralni šamponi za sigurno pranje" },
              { title: "Pjene za pranje", desc: "Snow foam za contactless pranje" },
              { title: "Sredstva za felge", desc: "Čistači za alu i čelične felge" },
              { title: "Čistači za stakla", desc: "Za kristalno čista stakla i retrovizore" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
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
                <h2 className="text-3xl font-bold text-gray-900">Proizvodi za eksterijer</h2>
                <p className="text-gray-600 mt-2">Profesionalna sredstva za pranje i čišćenje</p>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center text-blue-500 hover:text-blue-600 font-semibold transition"
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4">
              <HelpCircle className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600 uppercase tracking-wider text-xs font-bold">FAQ</span>
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-8 lg:p-12">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Imate autopraonice ili detailing studio?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Pogledajte našu veleprodajnu ponudu sa posebnim cijenama za profesionalce.
              </p>
              <Link
                href="/veleprodaja"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition"
              >
                Veleprodaja
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
            name: "Čišćenje Eksterijera - GlossDrive",
            description: "Premium sredstva za pranje i čišćenje eksterijera automobila.",
            url: `${siteConfig.url}/ciscenje-eksterijera`,
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
