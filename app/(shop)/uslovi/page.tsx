import { Metadata } from "next"
import Link from "next/link"
import { FileText, Mail, Phone } from "lucide-react"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Uslovi Korištenja",
  description: "Uslovi korištenja GlossDrive web stranice i online prodavnice. Pravila kupovine, dostave i povrata proizvoda.",
  keywords: ["uslovi korištenja", "pravila kupovine", "online prodaja", "uslovi prodaje"],
  url: "/uslovi",
  noIndex: false,
})

export default function UsloviPage() {
  return (
    <div className="flex flex-col">
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-4">
              <FileText className="h-4 w-4 text-orange-500" />
              <span className="text-orange-600 uppercase tracking-wider text-xs font-bold">PRAVNO</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Uslovi Korištenja
            </h1>
            <p className="text-gray-600">
              Posljednje ažuriranje: {new Date().toLocaleDateString("bs-BA", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Opće odredbe</h2>
                <p className="text-gray-600 leading-relaxed">
                  Ovi uslovi korištenja (&quot;Uslovi&quot;) regulišu korištenje web stranice glossdrive.ba
                  i povezanih usluga koje pruža GlossDrive (&quot;mi&quot;, &quot;naš&quot; ili &quot;Kompanija&quot;).
                  Korištenjem naše web stranice ili kupovinom proizvoda, prihvatate ove Uslove u cijelosti.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Registracija i korisnički račun</h2>
                <p className="text-gray-600 leading-relaxed">
                  Kupovina na našoj web stranici moguća je sa ili bez registracije. Ako kreirate korisnički
                  račun, odgovorni ste za održavanje povjerljivosti vaših pristupnih podataka i sve aktivnosti
                  koje se odvijaju pod vašim računom.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Narudžbe i cijene</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Sve cijene su izražene u konvertibilnim markama (KM) i uključuju PDV gdje je primjenjivo.</li>
                  <li>Zadržavamo pravo promjene cijena bez prethodne najave.</li>
                  <li>Narudžba je obvezujuća nakon potvrde od strane GlossDrive.</li>
                  <li>U slučaju greške u cijeni, kontaktirat ćemo vas prije obrade narudžbe.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Plaćanje</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Prihvaćamo sljedeće načine plaćanja:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Plaćanje pouzećem:</strong> Plaćate gotovinom kuriru prilikom preuzimanja paketa.</li>
                  <li><strong>Uplata na račun:</strong> Za veleprodajne kupce dostupno je plaćanje uplatom na žiro račun.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Dostava</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Dostava se vrši na teritoriji Bosne i Hercegovine.</li>
                  <li>Standardno vrijeme dostave iznosi 1-3 radna dana.</li>
                  <li>Cijena dostave iznosi 10 KM po narudžbi.</li>
                  <li>Rizik gubitka ili oštećenja proizvoda prelazi na kupca u trenutku isporuke.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Pravo na povrat (odustanak od kupovine)</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  U skladu sa Zakonom o zaštiti potrošača:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Imate pravo odustati od kupovine u roku od 14 dana bez navođenja razloga.</li>
                  <li>Proizvod mora biti vraćen u originalnom pakovanju, neoštećen i nekorišten.</li>
                  <li>Troškove povrata snosi kupac, osim u slučaju oštećenog ili pogrešnog proizvoda.</li>
                  <li>Povrat novca vrši se u roku od 14 dana od prijema vraćenog proizvoda.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Reklamacije</h2>
                <p className="text-gray-600 leading-relaxed">
                  Za reklamacije neispravnih proizvoda:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                  <li>Kontaktirajte nas u roku od 24 sata od prijema pošiljke za vidljiva oštećenja.</li>
                  <li>Za skrivene nedostatke, reklamaciju možete podnijeti u zakonskom roku.</li>
                  <li>Potrebno je dostaviti fotografije oštećenja i opis problema.</li>
                  <li>Odluku o reklamaciji donosimo u roku od 15 dana.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Garancija</h2>
                <p className="text-gray-600 leading-relaxed">
                  Svi proizvodi dolaze sa garancijom proizvođača gdje je primjenjivo. Garancija ne pokriva
                  oštećenja nastala nepravilnim korištenjem, mehaničkim oštećenjima ili prirodnim habanjem.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Intelektualno vlasništvo</h2>
                <p className="text-gray-600 leading-relaxed">
                  Sav sadržaj na ovoj web stranici (tekstovi, slike, logotipi, grafički elementi) zaštićen
                  je autorskim pravima i vlasništvo je GlossDrive ili naših licencora. Zabranjeno je
                  kopiranje, distribucija ili korištenje bez pisane dozvole.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Ograničenje odgovornosti</h2>
                <p className="text-gray-600 leading-relaxed">
                  GlossDrive ne odgovara za štete nastale nepravilnim korištenjem proizvoda, štete nastale
                  kašnjenjem u dostavi uslijed više sile, ili indirektne štete bilo koje vrste. Naša
                  odgovornost ograničena je na vrijednost kupljenih proizvoda.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Izmjene uslova</h2>
                <p className="text-gray-600 leading-relaxed">
                  Zadržavamo pravo izmjene ovih Uslova u bilo koje vrijeme. Promjene stupaju na snagu
                  objavom na ovoj stranici. Nastavak korištenja web stranice nakon objave izmjena
                  smatra se prihvatanjem novih Uslova.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. Mjerodavno pravo</h2>
                <p className="text-gray-600 leading-relaxed">
                  Ovi Uslovi regulišu se zakonima Bosne i Hercegovine. Za sve sporove nadležan je
                  sud u Tuzli, Bosna i Hercegovina.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">13. Kontakt</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Za pitanja u vezi ovih Uslova, kontaktirajte nas:
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:info@glossdrive.ba"
                    className="flex items-center gap-3 text-orange-600 hover:text-orange-700"
                  >
                    <Mail className="w-5 h-5" />
                    info@glossdrive.ba
                  </a>
                  <a
                    href="tel:+38761577576"
                    className="flex items-center gap-3 text-orange-600 hover:text-orange-700"
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
            <Link href="/privatnost" className="text-orange-600 hover:text-orange-700 font-semibold">
              Pogledaj Politiku privatnosti
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
