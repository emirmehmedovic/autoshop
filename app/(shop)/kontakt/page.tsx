import { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { ContactForm } from "@/components/shop/ContactForm"
import { generateSEOMetadata, siteConfig } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Kontakt",
  description: "Kontaktirajte GlossDrive tim za sve upite o auto kozmetici, veleprodaji i narudžbama. Brzi odgovor garantovan. Tuzla, BiH.",
  keywords: ["kontakt", "glossdrive kontakt", "auto kozmetika tuzla", "kontakt forma", "veleprodaja upit"],
  url: "/kontakt",
})

export default function KontaktPage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 uppercase tracking-wider text-sm mb-3 font-semibold">
              KONTAKT
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Stupite u kontakt s nama
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Imate pitanje o proizvodima, veleprodaji ili želite posebnu ponudu?
              Naš tim je tu da vam pomogne. Odgovaramo u najkraćem mogućem roku.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Kontakt informacije */}
            <div className="space-y-6">
              {/* Kontakt kartice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telefon */}
                <a
                  href="tel:+38761577576"
                  className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-yellow-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 pointer-events-none" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Telefon</h3>
                      <p className="text-gray-700 group-hover:text-orange-600 transition">
                        +387 61 577 576
                      </p>
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@glossdrive.ba"
                  className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-violet-500/10 border-[5px] border-white/80 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 pointer-events-none" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-700 group-hover:text-blue-600 transition">
                        info@glossdrive.ba
                      </p>
                    </div>
                  </div>
                </a>

                {/* Lokacija */}
                <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10 border-[5px] border-white/80 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 pointer-events-none" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Lokacija</h3>
                      <p className="text-gray-700">
                        Tuzla, Bosna i Hercegovina
                      </p>
                    </div>
                  </div>
                </div>

                {/* Radno vrijeme */}
                <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-pink-400/5 to-rose-500/10 border-[5px] border-white/80 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 pointer-events-none" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Radno vrijeme</h3>
                      <p className="text-gray-700">
                        Pon - Pet: 09:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dodatne informacije */}
              <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 border-[5px] border-white/80 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Brzi odgovor garantovan</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Na sve upite odgovaramo u roku od 24 sata. Za hitne upite, slobodno nas nazovite direktno.
                      Za veleprodajne upite i veće narudžbe, pripremit ćemo vam posebnu ponudu.
                    </p>
                  </div>
                </div>
              </div>

              {/* O čemu možete pitati */}
              <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-50 via-white to-amber-50 border-[5px] border-white/80 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4">O čemu nas možete pitati:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Informacije o proizvodima i njihovoj primjeni
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Veleprodajne cijene i količinski popusti
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Oprema za autopraonice i samouslužne praonice
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Savjeti za profesionalni detailing
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Status vaše narudžbe
                  </li>
                </ul>
              </div>
            </div>

            {/* Kontakt forma */}
            <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-orange-50/50 border-[5px] border-white/80 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />
              <div className="relative">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pošaljite nam poruku</h2>
                <p className="text-gray-600 mb-6">
                  Popunite formu ispod i javit ćemo vam se u najkraćem mogućem roku.
                </p>
                <ContactForm />
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
            "@type": "LocalBusiness",
            name: "GlossDrive",
            description: "Premium auto kozmetika, detailing proizvodi i oprema za autopraonice u Bosni i Hercegovini.",
            url: siteConfig.url,
            telephone: "+38761577576",
            email: "info@glossdrive.ba",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tuzla",
              addressCountry: "BA",
            },
            openingHours: "Mo-Fr 09:00-17:00",
            priceRange: "$$",
            areaServed: {
              "@type": "Country",
              name: "Bosnia and Herzegovina",
            },
          }),
        }}
      />
    </div>
  )
}
