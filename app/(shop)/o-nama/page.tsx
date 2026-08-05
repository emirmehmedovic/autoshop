import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Award, Users, Target, Heart, Sparkles, Shield, Truck, CheckCircle } from "lucide-react"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "O nama",
  description: "GlossDrive - Vaš pouzdani partner za premium auto kozmetiku i detailing u Tuzli i cijeloj BiH. Saznajte više o našoj misiji i vrijednostima.",
  keywords: ["o nama", "glossdrive", "auto kozmetika tuzla", "detailing bih", "car care bosna"],
  url: "/o-nama",
})

export default function ONamaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-orange-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                O NAMA
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Vaš partner za profesionalnu njegu vozila
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                GlossDrive je nastao iz strasti prema automobilima i želje da kvalitetna auto kozmetika
                bude dostupna svima u Bosni i Hercegovini. Specijalizirani smo za premium proizvode
                za detailing, čišćenje i zaštitu vozila, kao i profesionalnu opremu za autopraonice.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sa sjedištem u Tuzli, opslužujemo kupce širom BiH - od pojedinaca koji vole svoje
                automobile, do profesionalnih autopraonica i detailing studija koji traže pouzdanog
                partnera za repromaterijal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
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

            {/* Slika/Vizual */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-1">
                <div className="rounded-[calc(1.5rem-4px)] overflow-hidden">
                  <img
                    src="/categories/Autokozmetika.png"
                    alt="GlossDrive auto kozmetika"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border-[5px] border-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">Originalni proizvodi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Naša misija */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-orange-600 uppercase tracking-wider text-xs font-bold">Naša misija</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zašto postojimo
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Vjerujemo da svaki automobil zaslužuje najbolju njegu. Naša misija je učiniti premium
              auto kozmetiku dostupnom, pružiti stručne savjete i biti pouzdani partner našim kupcima -
              bilo da se radi o entuzijastima ili profesionalcima u auto industriji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartica 1 */}
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-yellow-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">Kvaliteta na prvom mjestu</h3>
                <p className="text-gray-600 leading-relaxed">
                  Pažljivo biramo samo provjerene proizvode renomiranih brendova koji garantuju rezultate.
                  Svaki proizvod testiramo prije nego što ga ponudimo našim kupcima.
                </p>
              </div>
            </div>

            {/* Kartica 2 */}
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-violet-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">Podrška kupcima</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nismo samo prodavnica - mi smo vaši savjetnici. Pomažemo vam odabrati prave proizvode
                  za vaše potrebe i pružamo stručne savjete za postizanje najboljih rezultata.
                </p>
              </div>
            </div>

            {/* Kartica 3 */}
            <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Heart className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">Strast prema automobilima</h3>
                <p className="text-gray-600 leading-relaxed">
                  Razumijemo vas jer dijelimo istu strast. Znamo koliko znači kada vaš automobil
                  blista i zato se trudimo da vam pružimo sve što je potrebno za savršen izgled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Naše vrijednosti */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src="/categories/poliranje.png"
                      alt="Poliranje automobila"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src="/categories/repromaterijal.png"
                      alt="Repromaterijal"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src="/categories/Autokozmetika.png"
                      alt="Auto kozmetika"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 to-amber-500 p-6 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-4xl font-bold">BiH</p>
                      <p className="text-sm opacity-90">Dostava širom zemlje</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-orange-500 uppercase tracking-wider text-sm mb-3 font-semibold">
                NAŠE VRIJEDNOSTI
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Šta nas izdvaja
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Originalni proizvodi</h3>
                    <p className="text-gray-600">
                      Garantujemo autentičnost svakog proizvoda. Sarađujemo direktno sa distributerima
                      i proizvođačima renomiranih brendova.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    <Truck className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Brza dostava</h3>
                    <p className="text-gray-600">
                      Isporučujemo u roku od 1-3 radna dana na bilo koju adresu u Bosni i Hercegovini.
                      Plaćanje pouzećem bez dodatnih troškova.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                    <Shield className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Povjerenje kupaca</h3>
                    <p className="text-gray-600">
                      Stotine zadovoljnih kupaca - od individualnih vlasnika automobila do profesionalnih
                      autopraonica i detailing studija.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">B2B partnerstva</h3>
                    <p className="text-gray-600">
                      Posebne cijene i uslovi za autopraonice, detailing studije i veleprodajne kupce.
                      Postanite naš partner i uživajte u pogodnostima.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA sekcija */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 lg:p-12">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent" />
            </div>
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Spremni za saradnju?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Bez obzira da li ste vlasnik automobila koji traži kvalitetne proizvode ili
                profesionalac u auto industriji - tu smo za vas.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
                >
                  Pregledaj ponudu
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/veleprodaja"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Veleprodaja / B2B
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "GlossDrive",
            description: "Premium auto kozmetika, detailing proizvodi i oprema za autopraonice u Bosni i Hercegovini.",
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo.png`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+38761577576",
              contactType: "customer service",
              areaServed: "BA",
              availableLanguage: ["bs", "hr", "sr"],
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tuzla",
              addressCountry: "BA",
            },
            sameAs: [],
          }),
        }}
      />
    </div>
  )
}
