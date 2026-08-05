import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, Truck, Clock, Shield, CheckCircle, Phone } from "lucide-react"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Auto Kozmetika Tuzla - Dostava istog dana",
  description: "Auto kozmetika i detailing proizvodi u Tuzli. Lokalna dostava istog dana. Sredstva za pranje, poliranje i zaštitu vozila. GlossDrive Tuzla.",
  keywords: ["auto kozmetika tuzla", "detailing tuzla", "car care tuzla", "sredstva za auto tuzla", "poliranje tuzla"],
  url: "/auto-kozmetika-tuzla",
})

export default function AutoKozmetikaTuzlaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600 uppercase tracking-wider text-xs font-bold">TUZLA</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Auto kozmetika u Tuzli - Brza lokalna dostava
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Tražite kvalitetnu auto kozmetiku u Tuzli? GlossDrive je vaša lokalna destinacija
                za premium proizvode za njegu vozila. Nudimo brzu dostavu na području Tuzle i
                Tuzlanskog kantona - često istog ili sljedećeg radnog dana.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bilo da vam trebaju sredstva za pranje, proizvodi za poliranje ili oprema za
                detailing - imamo sve na jednom mjestu. Za Tuzlu i okolinu nudimo mogućnost
                osobnog preuzimanja uz prethodnu najavu.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
                >
                  Pregledaj proizvode
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <a
                  href="tel:+38761577576"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
                >
                  <Phone className="mr-2" size={18} />
                  Nazovi odmah
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 lg:p-12">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                </div>
                <div className="relative text-center text-white">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Tuzla & TK</h3>
                  <p className="text-white/80 mb-4">
                    Dostava istog ili sljedećeg dana
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Radnim danom 09-17h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prednosti za Tuzlu */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prednosti kupovine u Tuzli
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Brza dostava", desc: "Istog ili sljedećeg dana za Tuzlu", color: "orange" },
              { icon: MapPin, title: "Osobno preuzimanje", desc: "Mogućnost preuzimanja u Tuzli", color: "blue" },
              { icon: Clock, title: "Bez čekanja", desc: "Proizvodi uvijek na lageru", color: "emerald" },
              { icon: Shield, title: "Lokalna podrška", desc: "Savjeti i pomoć pri odabiru", color: "purple" },
            ].map((item, index) => {
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

      {/* Područja dostave */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Područja brze dostave
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Dostavljamo na sve adrese u Tuzli i Tuzlanskom kantonu sa mogućnošću
                express dostave istog dana za hitne narudžbe.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Tuzla centar",
                  "Slatina",
                  "Stupine",
                  "Sjenjak",
                  "Irac",
                  "Brčanska Malta",
                  "Živinice",
                  "Lukavac",
                  "Gračanica",
                  "Srebrenik",
                  "Gradačac",
                  "Kalesija",
                ].map((mjesto) => (
                  <div key={mjesto} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{mjesto}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 bg-orange-50 border border-orange-100">
              <h3 className="font-bold text-gray-900 text-xl mb-4">Kontaktirajte nas</h3>
              <div className="space-y-4">
                <a
                  href="tel:+38761577576"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-orange-200 hover:border-orange-400 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="font-bold text-gray-900">+387 61 577 576</p>
                  </div>
                </a>
                <Link
                  href="/kontakt"
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
                >
                  Pošalji upit
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategorije */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Šta nudimo u Tuzli
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Sredstva za pranje", href: "/ciscenje-eksterijera", desc: "Šamponi, pjene i sredstva za eksterijer" },
              { title: "Čišćenje enterijera", href: "/ciscenje-enterijera", desc: "Sredstva za kožu, plastiku i tekstil" },
              { title: "Poliranje & Detailing", href: "/poliranje-detailing", desc: "Paste, voskovi i keramički premazi" },
              { title: "Mirisi za auto", href: "/mirisi-za-auto", desc: "Osvježivači i auto parfemi" },
              { title: "Auto kozmetika", href: "/auto-kozmetika", desc: "Kompletna ponuda proizvoda" },
              { title: "Veleprodaja", href: "/veleprodaja", desc: "Za autopraonice i servise" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-500 transition">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                <span className="text-orange-500 font-semibold text-sm inline-flex items-center">
                  Saznaj više
                  <ArrowRight className="ml-1" size={14} />
                </span>
              </Link>
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
                Naručite danas - dostava sutra u Tuzli!
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Za Tuzlu i Tuzlanski kanton nudimo express dostavu i mogućnost osobnog preuzimanja.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
                >
                  Naruči odmah
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <a
                  href="tel:+38761577576"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition backdrop-blur-sm"
                >
                  <Phone className="mr-2" size={18} />
                  +387 61 577 576
                </a>
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
            "@type": "LocalBusiness",
            name: "GlossDrive - Auto Kozmetika Tuzla",
            description: "Auto kozmetika i detailing proizvodi u Tuzli. Lokalna dostava istog dana.",
            url: `${siteConfig.url}/auto-kozmetika-tuzla`,
            telephone: "+38761577576",
            email: "info@glossdrive.ba",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tuzla",
              addressRegion: "Tuzlanski kanton",
              addressCountry: "BA",
            },
            areaServed: {
              "@type": "City",
              name: "Tuzla",
            },
            openingHours: "Mo-Fr 09:00-17:00",
          }),
        }}
      />
    </div>
  )
}
