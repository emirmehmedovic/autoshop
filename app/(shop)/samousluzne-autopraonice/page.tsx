import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Settings, Droplets, Shield, Zap, CheckCircle, HelpCircle } from "lucide-react"
import { ContactForm } from "@/components/shop/ContactForm"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Samouslužne Autopraonice - Oprema i sredstva",
  description: "Oprema i sredstva za samouslužne autopraonice. Profesionalna hemija za SB wash sisteme, dozirna oprema i tehničke konzultacije. Dostava širom BiH.",
  keywords: ["samouslužne autopraonice oprema", "sredstva za praonice", "sb wash", "self service car wash", "samousluzna autopraonica bih"],
  url: "/samousluzne-autopraonice",
})

const features = [
  {
    icon: Droplets,
    title: "Aktivna pjena",
    description: "Visokopjena sredstva za samouslužne sisteme koja ostavljaju zaštitni sloj",
    color: "blue",
  },
  {
    icon: Shield,
    title: "Vosk programi",
    description: "Tekući voskovi i sealanti za automatske aplikatore",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Brzo sušenje",
    description: "Sredstva za brzo sušenje i sjaj bez vodenih mrlja",
    color: "orange",
  },
  {
    icon: Settings,
    title: "Dozirna oprema",
    description: "Pumpe i dozatori za precizno doziranje hemije",
    color: "purple",
  },
]

const programs = [
  { name: "Predpranje", desc: "Aktivna pjena za odmašćivanje" },
  { name: "Pranje", desc: "pH neutralni auto šampon" },
  { name: "Ispiranje", desc: "Demineralizirana voda" },
  { name: "Voštenje", desc: "Tekući vosk za zaštitu" },
  { name: "Sjaj", desc: "Sredstvo za brzo sušenje" },
  { name: "Felge", desc: "Čistač za alu felge" },
]

const faqItems = [
  {
    question: "Koja sredstva su potrebna za samouslužnu autopraonice?",
    answer: "Osnovni set uključuje: aktivnu pjenu, auto šampon, tekući vosk, sredstvo za brzo sušenje i čistač za felge. Ovisno o programima, možete dodati premaze, sredstva za gume i specijalizirane čistače.",
  },
  {
    question: "Da li nudite tehničke konzultacije?",
    answer: "Da, nudimo tehničku podršku pri odabiru hemije, podešavanju dozatora i optimizaciji procesa. Možemo preporučiti koncentracije i setinge za vaš sistem.",
  },
  {
    question: "Kako se vrši dostava za samouslužne praonice?",
    answer: "Dostavljamo u kanisterima od 20L, 25L i IBC kontejnerima od 1000L. Za redovne isporuke nudimo povoljnije uslove i dogovorene termine dostave.",
  },
]

export default function SamousluzneAutopraonicePage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-purple-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                SAMOUSLUŽNE PRAONICE
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Oprema i sredstva za samouslužne autopraonice
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Specijalizirani smo za opskrbu samouslužnih autopraonica profesionalnom hemijom
                i opremom. Naša sredstva su dizajnirana za automatske dozirne sisteme i garantuju
                konzistentne rezultate program za programom.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Od aktivnih pjena i auto šampona, preko tekućih voskova i sealanata, do sredstava
                za brzo sušenje - nudimo kompletnu paletu proizvoda za sve programe vaše samouslužne
                praonice. Tehnička podrška i redovna dostava uključeni.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#kontakt-forma"
                  className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-600 transition"
                >
                  Zatraži ponudu
                  <ArrowRight className="ml-2" size={18} />
                </a>
                <Link
                  href="/veleprodaja"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Uslovi saradnje
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-500 p-8 lg:p-12">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                </div>
                <div className="relative text-center text-white">
                  <Settings className="w-20 h-20 mx-auto mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">SB Wash sistemi</h3>
                  <p className="text-white/80">
                    Profesionalna hemija za sve programe
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
              Zašto naša sredstva za samouslužne praonice?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const colors = {
                blue: "from-blue-500/10 via-cyan-400/5 to-sky-500/10",
                emerald: "from-emerald-500/10 via-green-400/5 to-teal-500/10",
                orange: "from-orange-500/10 via-amber-400/5 to-yellow-500/10",
                purple: "from-purple-500/10 via-pink-400/5 to-rose-500/10",
              }
              const iconColors = {
                blue: "from-blue-500 to-cyan-500 shadow-blue-500/30",
                emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
                orange: "from-orange-500 to-amber-500 shadow-orange-500/30",
                purple: "from-purple-500 to-indigo-500 shadow-purple-500/30",
              }
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br ${colors[feature.color as keyof typeof colors]} border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
                  <div className="relative text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${iconColors[feature.color as keyof typeof iconColors]} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Programi */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Standardni programi SB praonice</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nudimo sredstva za sve standardne programe samouslužne praonice
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {programs.map((program, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:shadow-lg transition"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{program.name}</h3>
                <p className="text-gray-600 text-xs">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pakovanje */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Opcije pakovanja
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Nudimo fleksibilne opcije pakovanja prilagođene veličini vaše praonice i potrošnji.
              </p>

              <div className="space-y-4">
                {[
                  { size: "20L / 25L kanisteri", desc: "Za manje praonice i testiranje proizvoda" },
                  { size: "200L bačve", desc: "Za srednje praonice sa umjerenom potrošnjom" },
                  { size: "1000L IBC kontejneri", desc: "Za veće praonice i redovnu isporuku" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200">
                    <CheckCircle className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900">{item.size}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 p-8 lg:p-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Redovna isporuka</h3>
                <p className="text-gray-600 mb-6">
                  Organizujemo redovnu isporuku prema vašim potrebama - sedmično, dvosedmično
                  ili mjesečno. Bez brige o zalihama!
                </p>
                <ul className="text-left space-y-2 max-w-sm mx-auto">
                  {[
                    "Automatsko praćenje potrošnje",
                    "Pravovremena dostava",
                    "Fleksibilni uslovi plaćanja",
                    "Dedicirani account manager",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt forma */}
      <section id="kontakt-forma" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Zatražite ponudu za vašu samouslužnu praonice
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Opišite nam vaš sistem i potrebe - pripremit ćemo ponudu sa optimalnim
                proizvodima i koncentracijama za vaše programe.
              </p>

              <div className="rounded-2xl p-6 bg-purple-50 border border-purple-100">
                <h3 className="font-bold text-gray-900 mb-4">Šta dobijate:</h3>
                <ul className="space-y-3">
                  {[
                    "Individualna ponuda prema vašim potrebama",
                    "Preporuke za optimalne koncentracije",
                    "Tehnička podrška pri podešavanju",
                    "Redovna isporuka i praćenje zaliha",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-purple-50/50 border-[5px] border-white/80 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Pošaljite upit</h3>
                <ContactForm defaultTipUpita="veleprodaja" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4">
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

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "GlossDrive - Samouslužne autopraonice",
            description: "Oprema i sredstva za samouslužne autopraonice u Bosni i Hercegovini.",
            url: `${siteConfig.url}/samousluzne-autopraonice`,
            telephone: "+38761577576",
            address: { "@type": "PostalAddress", addressLocality: "Tuzla", addressCountry: "BA" },
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
