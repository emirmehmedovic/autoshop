import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, Truck, Shield, Package, CheckCircle, Globe } from "lucide-react"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Auto Kozmetika BiH - Dostava širom Bosne i Hercegovine",
  description: "Najveći izbor auto kozmetike u Bosni i Hercegovini. Premium proizvodi za detailing, pranje i njegu vozila. Dostava 1-3 dana širom BiH.",
  keywords: ["auto kozmetika bosna", "detailing bih", "car care bosna i hercegovina", "auto kozmetika sarajevo", "auto kozmetika banja luka"],
  url: "/auto-kozmetika-bih",
})

const gradovi = [
  { name: "Sarajevo", region: "Kanton Sarajevo" },
  { name: "Banja Luka", region: "Republika Srpska" },
  { name: "Tuzla", region: "Tuzlanski kanton" },
  { name: "Zenica", region: "Zeničko-dobojski kanton" },
  { name: "Mostar", region: "Hercegovačko-neretvanski kanton" },
  { name: "Bijeljina", region: "Republika Srpska" },
  { name: "Brčko", region: "Brčko Distrikt" },
  { name: "Bihać", region: "Unsko-sanski kanton" },
  { name: "Prijedor", region: "Republika Srpska" },
  { name: "Trebinje", region: "Republika Srpska" },
  { name: "Doboj", region: "Republika Srpska" },
  { name: "Cazin", region: "Unsko-sanski kanton" },
]

export default function AutoKozmetikaBihPage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 uppercase tracking-wider text-xs font-bold">BOSNA I HERCEGOVINA</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Auto kozmetika - Dostava širom BiH
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                GlossDrive je vodeći online shop za auto kozmetiku u Bosni i Hercegovini.
                Dostavljamo premium proizvode za njegu vozila na svaku adresu - od Sarajeva
                do Banja Luke, od Mostara do Tuzle i svuda između.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bez obzira gdje se nalazite u BiH, možete računati na brzu dostavu u roku
                od 1-3 radna dana. Plaćanje pouzećem, originalni proizvodi i stručna podrška
                - sve što vam treba za savršenu njegu vašeg vozila.
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
                  Kontaktiraj nas
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                <div className="rounded-[calc(1.5rem-4px)] overflow-hidden">
                  <img
                    src="/categories/Autokozmetika.png"
                    alt="Auto kozmetika BiH"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border-[5px] border-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1-3</p>
                    <p className="text-sm text-gray-600">dana dostava</p>
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
              Zašto kupovati kod nas?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Brza dostava", desc: "1-3 radna dana širom BiH", color: "blue" },
              { icon: Shield, title: "Originalni proizvodi", desc: "100% autentični brendovi", color: "emerald" },
              { icon: Package, title: "Plaćanje pouzećem", desc: "Bez rizika - platite kad stigne", color: "orange" },
              { icon: MapPin, title: "Cijela BiH", desc: "FBiH, RS i Brčko Distrikt", color: "purple" },
            ].map((item, index) => {
              const colors = {
                blue: "from-blue-500/10 via-indigo-400/5 to-violet-500/10",
                emerald: "from-emerald-500/10 via-green-400/5 to-teal-500/10",
                orange: "from-orange-500/10 via-amber-400/5 to-yellow-500/10",
                purple: "from-purple-500/10 via-pink-400/5 to-rose-500/10",
              }
              const iconColors = {
                blue: "from-blue-500 to-indigo-500 shadow-blue-500/30",
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

      {/* Područja dostave */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dostavljamo u sve gradove BiH
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bez obzira gdje se nalazite u Bosni i Hercegovini, vaša narudžba stiže
              u roku od 1-3 radna dana
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gradovi.map((grad) => (
              <div
                key={grad.name}
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">{grad.name}</p>
                    <p className="text-xs text-gray-500">{grad.region}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8">
            I svi ostali gradovi i mjesta u BiH...
          </p>
        </div>
      </section>

      {/* Kategorije */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Naš asortiman
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Auto kozmetika", href: "/auto-kozmetika", desc: "Kompletna ponuda za njegu vozila" },
              { title: "Čišćenje eksterijera", href: "/ciscenje-eksterijera", desc: "Šamponi, pjene i sredstva za pranje" },
              { title: "Čišćenje enterijera", href: "/ciscenje-enterijera", desc: "Sredstva za kožu, plastiku i tekstil" },
              { title: "Poliranje & Detailing", href: "/poliranje-detailing", desc: "Paste, voskovi i premazi" },
              { title: "Mirisi za auto", href: "/mirisi-za-auto", desc: "Osvježivači i auto parfemi" },
              { title: "Veleprodaja", href: "/veleprodaja", desc: "Za autopraonice i profesionalce" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-500 transition">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                <span className="text-blue-500 font-semibold text-sm inline-flex items-center">
                  Pregledaj
                  <ArrowRight className="ml-1" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lokalne stranice */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Lokalne stranice</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auto-kozmetika-tuzla"
              className="px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
            >
              Auto kozmetika Tuzla
            </Link>
            <Link
              href="/autopraonice-tuzla"
              className="px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
            >
              Autopraonice Tuzla
            </Link>
            <Link
              href="/oprema-za-autopraonice"
              className="px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
            >
              Oprema za autopraonice
            </Link>
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
                Naručite danas - dostava u 1-3 dana!
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Premium auto kozmetika sa dostavom na vašu adresu bilo gdje u BiH.
                Plaćanje pouzećem, bez dodatnih troškova.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition"
              >
                Započni kupovinu
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
            "@type": "LocalBusiness",
            name: "GlossDrive",
            description: "Auto kozmetika i detailing proizvodi sa dostavom širom Bosne i Hercegovine.",
            url: `${siteConfig.url}/auto-kozmetika-bih`,
            telephone: "+38761577576",
            email: "info@glossdrive.ba",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tuzla",
              addressCountry: "BA",
            },
            areaServed: {
              "@type": "Country",
              name: "Bosnia and Herzegovina",
            },
            priceRange: "$$",
          }),
        }}
      />
    </div>
  )
}
