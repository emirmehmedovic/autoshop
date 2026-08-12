import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Package, Percent, Truck, Users, Shield, Clock, CheckCircle, HelpCircle } from "lucide-react"
import { ContactForm } from "@/components/shop/ContactForm"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Veleprodaja Auto Kozmetike - B2B Partneri",
  description: "Veleprodaja auto kozmetike i repromatrijala za autopraonice, detailing studije i trgovine. Posebne cijene, brza dostava širom BiH.",
  keywords: ["veleprodaja auto kozmetike", "repromaterijal", "b2b", "veleprodaja bih", "auto kozmetika na veliko", "wholesale car care"],
  url: "/veleprodaja",
})

const benefits = [
  {
    icon: Percent,
    title: "Veleprodajne cijene",
    description: "Specijalne cijene za količinske narudžbe i redovne partnere",
    color: "orange",
  },
  {
    icon: Package,
    title: "Širok asortiman",
    description: "Kompletna ponuda auto kozmetike i repromatrijala na jednom mjestu",
    color: "blue",
  },
  {
    icon: Truck,
    title: "Brza isporuka",
    description: "Redovna dostava širom BiH sa mogućnošću hitne isporuke",
    color: "emerald",
  },
  {
    icon: Users,
    title: "Podrška partnera",
    description: "Dedicirani account manager za sve vaše potrebe",
    color: "purple",
  },
]

const faqItems = [
  {
    question: "Koji su uslovi za veleprodajnu saradnju?",
    answer: "Za veleprodajnu saradnju potrebna je registrirana firma (d.o.o., obrt ili drugi pravni oblik). Minimalna prva narudžba iznosi 200 KM, a za redovne partnere nema minimalnog iznosa narudžbe.",
  },
  {
    question: "Kako postati veleprodajni partner?",
    answer: "Kontaktirajte nas putem forme na ovoj stranici ili direktno na telefon. Dostavite nam podatke o firmi i vrsti djelatnosti. Nakon provjere, dobićete pristup veleprodajnim cijenama i uslovima.",
  },
  {
    question: "Da li je moguće plaćanje na odgodu?",
    answer: "Da, za provjerene partnere nudimo plaćanje na 15, 30 ili 45 dana ovisno o obimu saradnje. Za nove partnere prvo plaćanje je avansno ili pouzećem.",
  },
  {
    question: "Koliki su popusti za veleprodaju?",
    answer: "Veleprodajni popusti kreću se od 15% do 40% ovisno o količini narudžbe, vrsti proizvoda i dužini saradnje. Kontaktirajte nas za individualni cjenovnik.",
  },
]

export default function VeleprodajaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-orange-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                B2B PARTNERSTVO
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Veleprodaja auto kozmetike i repromatrijala
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Tražite pouzdanog dobavljača auto kozmetike za vašu autopraonice, detailing studio
                ili trgovinu? GlossDrive nudi kompletan asortiman profesionalnih proizvoda po
                veleprodajnim cijenama sa redovnom dostavom širom Bosne i Hercegovine.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Postanite naš partner i uživajte u pogodnostima: konkurentne cijene, širok izbor
                kvalitetnih proizvoda, fleksibilni uslovi plaćanja i podrška stručnog tima.
                Opslužujemo autopraonice, detailing studije, auto servise i trgovine širom BiH.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#kontakt-forma"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
                >
                  Postani partner
                  <ArrowRight className="ml-2" size={18} />
                </a>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Pregledaj asortiman
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-1">
                <div className="rounded-[calc(1.5rem-4px)] overflow-hidden">
                  <img
                    src="/categories/repromaterijal.png"
                    alt="Veleprodaja auto kozmetike"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border-[5px] border-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">do 40%</p>
                    <p className="text-sm text-gray-600">Veleprodajni popust</p>
                  </div>
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
              Zašto postati naš partner?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nudimo sve što vam je potrebno za uspješno poslovanje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const colors = {
                orange: "from-orange-500/10 via-amber-400/5 to-yellow-500/10",
                blue: "from-blue-500/10 via-indigo-400/5 to-violet-500/10",
                emerald: "from-emerald-500/10 via-green-400/5 to-teal-500/10",
                purple: "from-purple-500/10 via-pink-400/5 to-rose-500/10",
              }
              const iconColors = {
                orange: "from-orange-500 to-amber-500 shadow-orange-500/30",
                blue: "from-blue-500 to-indigo-500 shadow-blue-500/30",
                emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
                purple: "from-purple-500 to-pink-500 shadow-purple-500/30",
              }
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br ${colors[benefit.color as keyof typeof colors]} border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
                  <div className="relative text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${iconColors[benefit.color as keyof typeof iconColors]} flex items-center justify-center shadow-lg`}>
                      <benefit.icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Za koga */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Idealno za vaše poslovanje
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Naša veleprodajna ponuda je prilagođena potrebama različitih poslovnih subjekata
                u auto industriji. Nudimo rješenja za:
              </p>
              <div className="space-y-4">
                {[
                  { title: "Autopraonice", desc: "Sredstva za ručno i automatsko pranje, šamponi, pjene, voskovi" },
                  { title: "Detailing studiji", desc: "Profesionalne polir paste, keramički premazi, zaštitni proizvodi" },
                  { title: "Auto servisi", desc: "Sredstva za čišćenje i njegu vozila tokom servisa" },
                  { title: "Trgovine", desc: "Kompletna ponuda za maloprodajnu djelatnost" },
                  { title: "Samouslužne praonice", desc: "Oprema i sredstva za samouslužne sisteme" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="/categories/Autokozmetika.png"
                    alt="Auto kozmetika"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-center">
                  <Shield className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-bold">100% Originalni proizvodi</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-center">
                  <Clock className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-bold">Brza isporuka 1-3 dana</p>
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="/categories/poliranje.png"
                    alt="Poliranje"
                    className="w-full h-40 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kako postati partner */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kako postati partner?</h2>
            <p className="text-gray-600">Jednostavan proces u 4 koraka</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Kontaktirajte nas", desc: "Popunite formu ili nas nazovite direktno" },
              { step: 2, title: "Dostavite podatke", desc: "Podaci o firmi i vrsti djelatnosti" },
              { step: 3, title: "Provjera i odobrenje", desc: "Odobravamo partnerstvo u roku 24h" },
              { step: 4, title: "Počnite naručivati", desc: "Pristup veleprodajnim cijenama" },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
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
                Zatražite veleprodajnu ponudu
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Popunite formu i naš tim će vam se javiti u najkraćem roku sa individualnom
                ponudom prilagođenom vašim potrebama.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50">
                  <Percent className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Popusti do 40%</h3>
                    <p className="text-gray-600 text-sm">Za količinske narudžbe i redovne partnere</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50">
                  <Truck className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Dostava 10 KM</h3>
                    <p className="text-gray-600 text-sm">Fiksna cijena dostave po narudžbi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50">
                  <Clock className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Plaćanje na odgodu</h3>
                    <p className="text-gray-600 text-sm">Do 45 dana za provjerene partnere</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-orange-50/50 border-[5px] border-white/80 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pošaljite upit</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Odgovaramo u roku 24 sata
                </p>
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
              <HelpCircle className="h-4 w-4 text-orange-500" />
              <span className="text-orange-600 uppercase tracking-wider text-xs font-bold">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Česta pitanja o veleprodaji</h2>
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
            name: "GlossDrive - Veleprodaja",
            description: "Veleprodaja auto kozmetike i repromatrijala za autopraonice, detailing studije i trgovine.",
            url: `${siteConfig.url}/veleprodaja`,
            telephone: "+38761577576",
            email: "info@glossdrive.ba",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tuzla",
              addressCountry: "BA",
            },
            priceRange: "$$",
            areaServed: { "@type": "Country", name: "Bosnia and Herzegovina" },
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
