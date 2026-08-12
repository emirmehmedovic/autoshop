import { Metadata } from "next"
import Link from "next/link"
import { Truck, CreditCard, Package, Clock, MapPin, Shield, HelpCircle, ArrowRight, CheckCircle } from "lucide-react"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Dostava i plaćanje",
  description: "Informacije o dostavi i načinima plaćanja na GlossDrive. Brza dostava 1-3 dana širom BiH. Plaćanje pouzećem bez dodatnih troškova.",
  keywords: ["dostava bih", "dostava tuzla", "kako naručiti", "plaćanje pouzećem", "dostava auto kozmetika"],
  url: "/dostava",
})

const faqItems = [
  {
    question: "Koliko traje dostava?",
    answer: "Standardna dostava traje 1-3 radna dana od trenutka potvrde narudžbe. Za Tuzlu i okolinu moguća je dostava istog ili sljedećeg dana.",
  },
  {
    question: "Da li mogu pratiti moju pošiljku?",
    answer: "Da, nakon što vaša narudžba bude poslana, dobićete SMS ili email sa brojem za praćenje pošiljke.",
  },
  {
    question: "Šta ako nisam kod kuće kada paket stigne?",
    answer: "Kurirska služba će vas kontaktirati telefonom prije dostave. Ako niste dostupni, paket će biti ostavljen u najbližoj pošti ili će kurir pokušati dostavu sljedeći dan.",
  },
  {
    question: "Da li je moguća dostava izvan BiH?",
    answer: "Trenutno vršimo dostavu samo na teritoriji Bosne i Hercegovine. Za upite o međunarodnoj dostavi, kontaktirajte nas direktno.",
  },
  {
    question: "Mogu li preuzeti narudžbu lično?",
    answer: "Da, moguće je osobno preuzimanje u Tuzli uz prethodnu najavu. Kontaktirajte nas za dogovor termina preuzimanja.",
  },
]

export default function DostavaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 uppercase tracking-wider text-sm mb-3 font-semibold">
              DOSTAVA I PLAĆANJE
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Brza i sigurna dostava
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dostavljamo proizvode na bilo koju adresu u Bosni i Hercegovini.
              Plaćanje pouzećem - platite tek kada primite paket.
            </p>
          </div>

          {/* Glavne prednosti */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-yellow-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Truck className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Brza dostava</h3>
                <p className="text-gray-600">
                  1-3 radna dana na bilo koju adresu u BiH
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-violet-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <CreditCard className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Plaćanje pouzećem</h3>
                <p className="text-gray-600">
                  Platite kada primite paket - bez rizika
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Package className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Sigurno pakovanje</h3>
                <p className="text-gray-600">
                  Svaki proizvod pažljivo zapakiramo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detalji o dostavi */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Dostava info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Informacije o dostavi</h2>
              </div>

              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-xl p-5 bg-white border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Vrijeme dostave</h3>
                      <p className="text-gray-600 text-sm">
                        Standardna dostava: <strong>1-3 radna dana</strong><br />
                        Express dostava (Tuzla): <strong>Isti ili sljedeći dan</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl p-5 bg-white border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Područje dostave</h3>
                      <p className="text-gray-600 text-sm">
                        Dostavljamo na sve adrese u <strong>Bosni i Hercegovini</strong> -
                        Federacija BiH, Republika Srpska i Brčko Distrikt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl p-5 bg-white border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Cijena dostave</h3>
                      <p className="text-gray-600 text-sm">
                        Standardna dostava: <strong>10 KM</strong><br />
                        Dostava se obračunava po narudžbi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl p-5 bg-white border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Kurirske službe</h3>
                      <p className="text-gray-600 text-sm">
                        Sarađujemo sa provjerenim kurirskim službama koje garantuju
                        sigurnu i brzu isporuku vaših narudžbi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plaćanje info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Načini plaćanja</h2>
              </div>

              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10 border-[5px] border-white/80 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Plaćanje pouzećem</h3>
                      <span className="text-sm text-emerald-600 font-medium">Najpopularniji način</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Platite gotovinom kuriru prilikom preuzimanja paketa. Sigurno, praktično i
                    bez rizika - vidite proizvod prije nego što platite.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Bez dodatnih troškova
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Plaćate tek kada primite paket
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Gotovinska uplata kuriru
                    </li>
                  </ul>
                </div>

                <div className="relative overflow-hidden rounded-xl p-5 bg-white border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Uplata na račun</h3>
                      <p className="text-gray-600 text-sm">
                        Za veleprodajne narudžbe i B2B kupce dostupno je plaćanje uplatom
                        na žiro račun sa rokom plaćanja.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl p-5 bg-orange-50 border border-orange-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Osobno preuzimanje</h3>
                      <p className="text-gray-600 text-sm">
                        Preuzmite narudžbu u Tuzli uz prethodnu najavu. Plaćanje gotovinom
                        prilikom preuzimanja.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kako naručiti */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kako naručiti?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naručivanje je jednostavno i brzo - samo 4 koraka do vaših proizvoda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Odaberite proizvode", desc: "Pregledajte našu ponudu i dodajte željene proizvode u korpu" },
              { step: 2, title: "Unesite podatke", desc: "Unesite adresu za dostavu i kontakt informacije" },
              { step: 3, title: "Potvrdite narudžbu", desc: "Pregledajte narudžbu i potvrdite kupovinu" },
              { step: 4, title: "Primite paket", desc: "Paket stiže na vašu adresu u roku od 1-3 dana" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-200 to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
            >
              Započni kupovinu
              <ArrowRight className="ml-2" size={18} />
            </Link>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Česta pitanja</h2>
            <p className="text-gray-600">
              Pronađite odgovore na najčešća pitanja o dostavi i plaćanju
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Imate dodatna pitanja?
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600 transition"
            >
              Kontaktirajte nas
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  )
}
