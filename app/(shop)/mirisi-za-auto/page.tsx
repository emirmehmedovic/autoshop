import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Wind, Clock, Sparkles, HelpCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/ProductCard"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Mirisi za Auto - Osvježivači i Auto Parfemi",
  description: "Kvalitetni mirisi i osvježivači za auto. Dugotrajni auto parfemi koji će vaš automobil učiniti ugodnijim. Dostava širom BiH.",
  keywords: ["mirisi za auto", "osvježivači za auto", "auto parfemi", "car freshener", "miris za automobil", "auto miris bih"],
  url: "/mirisi-za-auto",
})

const features = [
  {
    icon: Wind,
    title: "Svjež miris",
    description: "Eliminira neugodne mirise i ostavlja ugodan, svjež miris u kabini",
    color: "blue",
  },
  {
    icon: Clock,
    title: "Dugotrajnost",
    description: "Naši osvježivači traju sedmicama, pružajući konstantan ugodan miris",
    color: "purple",
  },
  {
    icon: Sparkles,
    title: "Premium mirisne note",
    description: "Širok izbor mirisa - od svježih do luksuznih parfemskih nota",
    color: "orange",
  },
]

const faqItems = [
  {
    question: "Koliko dugo traje miris za auto?",
    answer: "Ovisno o tipu proizvoda, mirisi traju od 2 do 8 sedmica. Viseći osvježivači obično traju 3-4 sedmice, dok parfemi u bočici mogu trajati i do 2 mjeseca.",
  },
  {
    question: "Koji miris je najbolji za auto?",
    answer: "To ovisi o osobnim preferencijama. Najpopularniji su svježi mirisi poput nove aute, oceana i citrusnih nota. Za luksuzni doživljaj preporučujemo parfemske note poput kože ili vanilije.",
  },
  {
    question: "Da li su mirisi sigurni za alergičare?",
    answer: "Većina naših proizvoda je hipoalergena. Preporučujemo testiranje na manjem području prije postavljanja u vozilo ako imate osjetljivu kožu ili respiratorne probleme.",
  },
]

export default async function MirisiZaAutoPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { category: { slug: "mirisi" } },
        { category: { slug: "osvjezivaci" } },
        { name: { contains: "miris", mode: "insensitive" } },
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
                MIRISI ZA AUTO
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Osvježivači i parfemi za vaš automobil
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Pretvorite svaku vožnju u ugodno iskustvo sa našim premium mirisima za auto.
                Nudimo širok izbor osvježivača i auto parfema - od svježih citrusnih nota
                do luksuznih parfemskih mirisa koji će vaš automobil učiniti posebnim.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bilo da preferirate diskretne visece osvježivače, praktične vent clipove
                ili dugotrajne parfeme u bočici - imamo rješenje za svaki ukus. Svi naši
                proizvodi su dugotrajni i kvalitetni, dostupni sa brzom dostavom širom BiH.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition"
                >
                  Pregledaj mirise
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Saznaj više
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 p-8 lg:p-12">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                </div>
                <div className="relative text-center text-white">
                  <Wind className="w-20 h-20 mx-auto mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Svjež miris u kabini</h3>
                  <p className="text-white/80">
                    Uživajte u ugodnoj vožnji sa našim premium osvježivačima
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
              Zašto odabrati naše mirise za auto?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const colors = {
                blue: "from-blue-500/10 via-indigo-400/5 to-violet-500/10",
                purple: "from-purple-500/10 via-pink-400/5 to-rose-500/10",
                orange: "from-orange-500/10 via-amber-400/5 to-yellow-500/10",
              }
              const iconColors = {
                blue: "from-blue-500 to-indigo-500 shadow-blue-500/30",
                purple: "from-purple-500 to-pink-500 shadow-purple-500/30",
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

      {/* Tipovi mirisa */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Tipovi mirisa za auto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Viseći osvježivači", desc: "Klasični osvježivači za retrovizor" },
              { title: "Vent clipovi", desc: "Montiraju se na ventilacijske otvore" },
              { title: "Parfemi u bočici", desc: "Dugotrajni tekući osvježivači" },
              { title: "Spray osvježivači", desc: "Brzo osvježavanje enterijera" },
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
                <h2 className="text-3xl font-bold text-gray-900">Popularni mirisi</h2>
                <p className="text-gray-600 mt-2">Najtraženiji osvježivači i parfemi za auto</p>
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Učinite svaku vožnju ugodnijom
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Pregledajte našu kolekciju mirisa za auto i pronađite savršen miris za vaše vozilo.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition"
              >
                Pregledaj ponudu
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
            name: "Mirisi za Auto - GlossDrive",
            description: "Kvalitetni mirisi i osvježivači za auto. Dugotrajni auto parfemi.",
            url: `${siteConfig.url}/mirisi-za-auto`,
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
