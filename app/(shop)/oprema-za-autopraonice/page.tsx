import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Droplets, Package, Shield, Truck, CheckCircle, HelpCircle } from "lucide-react"
import { ContactForm } from "@/components/shop/ContactForm"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Oprema za Autopraonice - Repromaterijal i sredstva",
  description: "Kompletna oprema i repromaterijal za autopraonice. Sredstva za pranje, šamponi, pjene, voskovi i zaštitni premazi. Veleprodajne cijene, dostava širom BiH.",
  keywords: ["oprema za autopraonice", "repromaterijal autopraonice", "sredstva za pranje auta", "autopraonice bih", "car wash equipment"],
  url: "/oprema-za-autopraonice",
})

const products = [
  {
    title: "Šamponi i pjene",
    items: ["Auto šamponi", "Snow foam", "Aktivna pjena", "Predprana sredstva"],
  },
  {
    title: "Voskovi i zaštita",
    items: ["Tekući voskovi", "Spray voskovi", "Sealanti", "Quick detaileri"],
  },
  {
    title: "Čišćenje enterijera",
    items: ["Čistači za plastiku", "Sredstva za kožu", "Čistači za tekstil", "Osvježivači"],
  },
  {
    title: "Specijalna sredstva",
    items: ["Čistači za felge", "Odmaščivači", "Tar removeri", "Iron removeri"],
  },
]

const faqItems = [
  {
    question: "Koja sredstva su potrebna za pokretanje autopraonice?",
    answer: "Za osnovnu ponudu potrebni su: auto šampon, aktivna pjena, vosk, čistač za felge, sredstva za enterijer (plastika, stakla) i osvježivači. Za premium usluge dodajte polir paste, keramičke premaze i specijalizirane čistače.",
  },
  {
    question: "Da li nudite tehničku podršku i edukaciju?",
    answer: "Da, nudimo besplatne savjete o primjeni proizvoda i optimizaciji procesa pranja. Za veće partnere organizujemo i edukacije na licu mjesta.",
  },
  {
    question: "Koliki su minimalni iznosi narudžbe?",
    answer: "Minimalna narudžba za nove kupce iznosi 200 KM. Za redovne partnere nema minimalnog iznosa. Besplatna dostava za narudžbe iznad 300 KM.",
  },
]

export default function OpremaZaAutopraonicePage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                ZA AUTOPRAONICE
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Oprema i repromaterijal za autopraonice
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Opremite svoju autopraonice kvalitetnim sredstvima i opremom po veleprodajnim
                cijenama. Nudimo kompletan asortiman za ručne i automatske autopraonice -
                od osnovnih sredstava za pranje do premium proizvoda za zaštitu i poliranje.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bilo da pokrećete novu autopraonice ili tražite pouzdanog dobavljača za
                postojeći biznis, GlossDrive je vaš partner. Redovna dostava, konkurentne
                cijene i stručna podrška - sve što vam je potrebno za uspješno poslovanje.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#kontakt-forma"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition"
                >
                  Zatraži ponudu
                  <ArrowRight className="ml-2" size={18} />
                </a>
                <Link
                  href="/veleprodaja"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Uslovi veleprodaje
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
                  <h3 className="text-2xl font-bold mb-2">Sve za vašu autopraonice</h3>
                  <p className="text-white/80">
                    Kompletna oprema i sredstva na jednom mjestu
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
              Zašto odabrati GlossDrive?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, title: "Širok asortiman", desc: "Sve što vam treba za autopraonice", color: "blue" },
              { icon: Shield, title: "Provjereni proizvodi", desc: "Testirani i odobreni od stručnjaka", color: "emerald" },
              { icon: Truck, title: "Brza dostava", desc: "1-3 dana širom BiH", color: "orange" },
              { icon: CheckCircle, title: "Stručna podrška", desc: "Savjeti i pomoć pri odabiru", color: "purple" },
            ].map((item, index) => {
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
                purple: "from-purple-500 to-pink-500 shadow-purple-500/30",
              }
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br ${colors[item.color as keyof typeof colors]} border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
                  <div className="relative text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${iconColors[item.color as keyof typeof iconColors]} flex items-center justify-center shadow-lg`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Asortiman */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Naš asortiman za autopraonice</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kompletan izbor proizvoda za sve faze procesa pranja i njege vozila
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((category, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition"
              >
                <h3 className="font-bold text-gray-900 text-lg mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 font-semibold transition"
            >
              Pregledaj sve proizvode
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Paketi za autopraonice */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Starter paketi za autopraonice</h2>
            <p className="text-gray-600">Kontaktirajte nas za individualiziranu ponudu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Basic paket",
                desc: "Za male autopraonice",
                features: ["Auto šampon 20L", "Aktivna pjena 20L", "Čistač za felge 5L", "Quick detailer 5L"],
              },
              {
                title: "Professional paket",
                desc: "Za srednje autopraonice",
                features: ["Sve iz Basic paketa", "Vosk 20L", "Čistač za enterijer", "Sredstva za kožu", "Osvježivači"],
                popular: true,
              },
              {
                title: "Premium paket",
                desc: "Za premium autopraonice",
                features: ["Sve iz Professional paketa", "Polir paste", "Keramički premazi", "Specijalni čistači", "Komplet alata"],
              },
            ].map((paket, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-[5px] ${
                  paket.popular ? "border-blue-500 bg-blue-50" : "border-white/80 bg-white"
                } p-6 shadow-lg`}
              >
                {paket.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    NAJPOPULARNIJI
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-xl mb-1">{paket.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{paket.desc}</p>
                <ul className="space-y-2 mb-6">
                  {paket.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontakt-forma"
                  className={`block text-center py-3 rounded-xl font-semibold transition ${
                    paket.popular
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Zatraži ponudu
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt forma */}
      <section id="kontakt-forma" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Zatražite ponudu za vašu autopraonice
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Opišite nam vaše potrebe i pripremit ćemo individualnu ponudu sa najboljim
                cijenama za vašu autopraonice.
              </p>

              <div className="space-y-4">
                {[
                  "Besplatna dostava za narudžbe iznad 300 KM",
                  "Popusti do 40% za redovne partnere",
                  "Plaćanje na odgodu do 45 dana",
                  "Stručna podrška pri odabiru",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-blue-50/50 border-[5px] border-white/80 shadow-xl">
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

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "GlossDrive - Oprema za autopraonice",
            description: "Kompletna oprema i repromaterijal za autopraonice u Bosni i Hercegovini.",
            url: `${siteConfig.url}/oprema-za-autopraonice`,
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
