import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, Truck, Package, Shield, CheckCircle, Phone } from "lucide-react"
import { ContactForm } from "@/components/shop/ContactForm"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Oprema za Autopraonice Tuzla - Repromaterijal",
  description: "Repromaterijal i oprema za autopraonice u Tuzli i TK. Sredstva za pranje, šamponi, voskovi. Brza lokalna dostava i veleprodajne cijene.",
  keywords: ["oprema autopraonice tuzla", "repromaterijal tuzla", "sredstva za pranje tuzla", "autopraonice tuzlanski kanton"],
  url: "/autopraonice-tuzla",
})

export default function AutopraoniceTuzlaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 uppercase tracking-wider text-xs font-bold">TUZLA & TK</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Oprema za autopraonice u Tuzli
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Vodite autopraonice u Tuzli ili Tuzlanskom kantonu? GlossDrive je vaš lokalni
                partner za repromaterijal i opremu. Nudimo kompletnu ponudu sredstava za pranje,
                čišćenje i zaštitu vozila po veleprodajnim cijenama.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Brza lokalna dostava, mogućnost osobnog preuzimanja i fleksibilni uslovi plaćanja
                za lokalne partnere. Postanite naš partner i uživajte u prednostima lokalne saradnje.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#kontakt-forma"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition"
                >
                  Zatraži ponudu
                  <ArrowRight className="ml-2" size={18} />
                </a>
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
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-8 lg:p-12">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                </div>
                <div className="relative text-center text-white">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Lokalni dobavljač</h3>
                  <p className="text-white/80 mb-4">
                    Za autopraonice u Tuzli i TK
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">Dostava 1-2 dana</span>
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
              Prednosti lokalne saradnje
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Brza dostava", desc: "1-2 dana za Tuzlu i TK", color: "blue" },
              { icon: MapPin, title: "Preuzimanje", desc: "Osobno preuzimanje u Tuzli", color: "emerald" },
              { icon: Shield, title: "Kvaliteta", desc: "Provjereni profesionalni proizvodi", color: "orange" },
              { icon: Package, title: "Zalihe", desc: "Proizvodi uvijek dostupni", color: "purple" },
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

      {/* Ponuda */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Šta nudimo autopraonama u Tuzli
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Sredstva za pranje",
                items: ["Auto šamponi", "Aktivna pjena", "Snow foam", "Predpranje"],
              },
              {
                title: "Zaštita i sjaj",
                items: ["Tekući voskovi", "Quick detaileri", "Sealanti", "Keramički premazi"],
              },
              {
                title: "Čišćenje enterijera",
                items: ["Čistači za plastiku", "Sredstva za kožu", "Čistači za tekstil", "Osvježivači"],
              },
              {
                title: "Specijalna sredstva",
                items: ["Čistači za felge", "Odmaščivači", "Tar removeri", "Čistači za stakla"],
              },
              {
                title: "Oprema",
                items: ["Krpe i aplikatori", "Četke", "Rukavice za pranje", "Bočice za raspršivanje"],
              },
              {
                title: "Veleprodaja",
                items: ["Kanisteri 20L/25L", "Bačve 200L", "IBC 1000L", "Bulk narudžbe"],
              },
            ].map((category, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition"
              >
                <h3 className="font-bold text-gray-900 text-lg mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/oprema-za-autopraonice"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 font-semibold transition"
            >
              Pogledaj kompletnu ponudu
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Kontakt forma */}
      <section id="kontakt-forma" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Zatražite ponudu za vašu autopraonice
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Opišite nam vaše potrebe - pripremit ćemo individualnu ponudu sa najboljim
                cijenama za autopraonice u Tuzli i okolini.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Veleprodajne cijene za lokalne partnere",
                  "Brza dostava u roku 1-2 dana",
                  "Mogućnost osobnog preuzimanja",
                  "Fleksibilni uslovi plaćanja",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-5 bg-blue-50 border border-blue-100">
                <p className="text-gray-700">
                  <strong>Hitna narudžba?</strong> Nazovite nas direktno na{" "}
                  <a href="tel:+38761577576" className="text-blue-600 font-bold">
                    +387 61 577 576
                  </a>
                </p>
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

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "GlossDrive - Oprema za autopraonice Tuzla",
            description: "Repromaterijal i oprema za autopraonice u Tuzli i Tuzlanskom kantonu.",
            url: `${siteConfig.url}/autopraonice-tuzla`,
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
          }),
        }}
      />
    </div>
  )
}
