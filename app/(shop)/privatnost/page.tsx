import { Metadata } from "next"
import Link from "next/link"
import { Shield, Mail, Phone } from "lucide-react"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Politika Privatnosti",
  description: "Politika privatnosti i zaštita ličnih podataka na GlossDrive web stranici. Saznajte kako prikupljamo, koristimo i štitimo vaše podatke.",
  keywords: ["politika privatnosti", "zaštita podataka", "gdpr", "privatnost"],
  url: "/privatnost",
  noIndex: false,
})

export default function PrivatnostPage() {
  return (
    <div className="flex flex-col">
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600 uppercase tracking-wider text-xs font-bold">PRAVNO</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Politika Privatnosti
            </h1>
            <p className="text-gray-600">
              Posljednje ažuriranje: {new Date().toLocaleDateString("bs-BA", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Uvod</h2>
                <p className="text-gray-600 leading-relaxed">
                  GlossDrive (u daljem tekstu: &quot;mi&quot;, &quot;naš&quot; ili &quot;Kompanija&quot;) posvećen je zaštiti vaše privatnosti.
                  Ova politika privatnosti objašnjava kako prikupljamo, koristimo, obrađujemo i štitimo vaše lične podatke
                  kada koristite našu web stranicu glossdrive.ba i povezane usluge.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Podaci koje prikupljamo</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Možemo prikupljati sljedeće vrste podataka:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Lični podaci:</strong> Ime, prezime, email adresa, broj telefona, adresa za dostavu</li>
                  <li><strong>Podaci o narudžbama:</strong> Historija kupovina, preferencije proizvoda, detalji narudžbi</li>
                  <li><strong>Tehnički podaci:</strong> IP adresa, tip preglednika, operativni sistem, podaci o uređaju</li>
                  <li><strong>Podaci o korištenju:</strong> Informacije o tome kako koristite našu web stranicu</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Kako koristimo vaše podatke</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Vaše podatke koristimo za:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Obradu i isporuku vaših narudžbi</li>
                  <li>Komunikaciju u vezi vaših narudžbi i upita</li>
                  <li>Slanje promocija i ponuda (uz vašu saglasnost)</li>
                  <li>Poboljšanje naše web stranice i usluga</li>
                  <li>Ispunjavanje pravnih obaveza</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Dijeljenje podataka</h2>
                <p className="text-gray-600 leading-relaxed">
                  Vaše podatke možemo dijeliti sa:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                  <li><strong>Kurirske službe:</strong> Za isporuku vaših narudžbi</li>
                  <li><strong>Platni procesori:</strong> Za obradu plaćanja</li>
                  <li><strong>Pravni zahtjevi:</strong> Kada smo zakonski obavezni</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Ne prodajemo niti iznajmljujemo vaše lične podatke trećim stranama u marketinške svrhe.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Kolačići (Cookies)</h2>
                <p className="text-gray-600 leading-relaxed">
                  Naša web stranica koristi kolačiće za poboljšanje korisničkog iskustva. Kolačići su male
                  tekstualne datoteke koje se pohranjuju na vašem uređaju. Koristimo:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                  <li><strong>Neophodni kolačići:</strong> Za funkcioniranje web stranice</li>
                  <li><strong>Analitički kolačići:</strong> Za razumijevanje kako koristite stranicu</li>
                  <li><strong>Marketinški kolačići:</strong> Za prikazivanje relevantnih oglasa (uz saglasnost)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Sigurnost podataka</h2>
                <p className="text-gray-600 leading-relaxed">
                  Primjenjujemo odgovarajuće tehničke i organizacijske mjere za zaštitu vaših podataka od
                  neovlaštenog pristupa, gubitka ili zloupotrebe. Međutim, nijedna metoda prijenosa podataka
                  putem interneta nije 100% sigurna.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Vaša prava</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  U skladu sa važećim zakonima o zaštiti podataka, imate pravo na:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Pristup vašim ličnim podacima</li>
                  <li>Ispravku netačnih podataka</li>
                  <li>Brisanje vaših podataka (&quot;pravo na zaborav&quot;)</li>
                  <li>Ograničenje obrade</li>
                  <li>Prigovor na obradu</li>
                  <li>Prenosivost podataka</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Zadržavanje podataka</h2>
                <p className="text-gray-600 leading-relaxed">
                  Vaše podatke zadržavamo onoliko dugo koliko je potrebno za ispunjenje svrha za koje
                  su prikupljeni, uključujući ispunjavanje pravnih, računovodstvenih ili izvještajnih
                  zahtjeva.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Promjene politike privatnosti</h2>
                <p className="text-gray-600 leading-relaxed">
                  Možemo povremeno ažurirati ovu politiku privatnosti. Sve promjene će biti objavljene
                  na ovoj stranici sa novim datumom &quot;posljednjeg ažuriranja&quot;.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Kontakt</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Za pitanja o ovoj politici privatnosti ili vašim podacima, kontaktirajte nas:
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:info@glossdrive.ba"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="w-5 h-5" />
                    info@glossdrive.ba
                  </a>
                  <a
                    href="tel:+38761577576"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="w-5 h-5" />
                    +387 61 577 576
                  </a>
                </div>
              </section>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-8 text-center">
            <Link href="/uslovi" className="text-blue-600 hover:text-blue-700 font-semibold">
              Pogledaj Uslove korištenja
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
