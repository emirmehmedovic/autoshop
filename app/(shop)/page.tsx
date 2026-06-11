import Link from "next/link"
import { ArrowRight, Award, Package2, Users, Sparkles, Shield, Zap, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero sekcija */}
      <section className="relative bg-slate-800 text-white py-24 md:py-32 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 opacity-90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gray-400 uppercase tracking-wider text-sm mb-4 font-semibold">
              KVALITET I PRECIZNOST U SVAKOM PROIZVODU
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              PROFESIONALNI PROIZVODI ZA SVAKO VOZILO
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              Premium auto kozmetika i repromatrijali za profesionalce i entuzijaste
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-lime-400 text-slate-900 rounded-lg font-bold hover:bg-lime-300 transition text-lg"
              >
                Pregledaj Proizvode
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white rounded-lg font-bold hover:bg-slate-700 transition border-2 border-white text-lg"
              >
                B2B Registracija
              </Link>
            </div>
          </div>

          {/* Stats overlay - na dnu hero sekcije */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-lime-400 rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">GODINE ISKUSTVA</h3>
                  <p className="text-gray-400 text-sm">
                    Decenije tradicije u oblasti auto kozmetike, pružajući preciznost i pouzdanost našoj zajednici.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-lime-400 rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">ZADOVOLJNIH KLIJENATA</h3>
                  <p className="text-gray-400 text-sm">
                    Od klasičnih do luksuznih vozila, uspješno smo riješili hiljade zahtjeva klijenata.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-1 h-12 bg-lime-400 rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">CERTIFICIRANI STRUČNJACI</h3>
                  <p className="text-gray-400 text-sm">
                    Naš kompletan tim ASE-certificiranih tehničara posvećen je održavanju najviših standarda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              OD SKROMNE RADIAONICE DO POUZDANE DESTINACIJE — AUTOSHOP JE IZGRAĐEN NA VJEŠTINI, UPORNOSTI I ISKRENOJ BRIZI ZA SVAKOG VOZAČA KOJEG SLUŽIMO.
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Upoznajte ljude koji čine AutoShop pokretačem — jedan proizvod, jedno vozilo, jedan lojalan kupac u isto vrijeme.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="text-lime-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">PRECIZNOST NA PRVOM MJESTU</h3>
              <p className="text-gray-600">
                Svaka dijagnoza počinje sa detaljnim, ne žurnim alatima i provjerenim metodama za rješavanje problema sa bezobzirnom tačnošću.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-lime-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">POSAO KOJI TRAJE</h3>
              <p className="text-gray-600">
                Popravke su rađene sa dugoročnim garancijama — kvalitet rezervnih dijelova, čist rad i dugotrajna ravnoteža za kraće vrijeme zastoja.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="text-lime-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">JEDNOSTAVNA USLUGA</h3>
              <p className="text-gray-600">
                Mi vam dajemo ono što vam treba, što se može učiniti, što košta i šta se ne mora često prekoračiti.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-lime-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">TIM KOJI BRINE</h3>
              <p className="text-gray-600">
                AutoShop je izgrađen od strane ljudi koji vole automobile, cijene preciznost i poštuju svaki podržani auto što i vi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-gray-600 uppercase tracking-wider text-sm mb-2 font-semibold">USLUGE</p>
              <h2 className="text-4xl font-bold text-slate-900">STRUČNE AUTO USLUGE</h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center text-slate-900 hover:text-lime-600 font-semibold transition"
            >
              Vidi sve usluge
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/shop?category=auto-kozmetika"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-lime-400 opacity-0 group-hover:opacity-10 transition" />
                <Sparkles className="text-white" size={48} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-lime-600 transition">
                  Auto Kozmetika
                </h3>
                <p className="text-gray-600">
                  Premium proizvodi za čišćenje, poliranje i zaštitu eksterijera i enterijera vozila.
                </p>
              </div>
            </Link>

            <Link
              href="/shop?category=repromatrijali"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-lime-400 opacity-0 group-hover:opacity-10 transition" />
                <Package2 className="text-white" size={48} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-lime-600 transition">
                  Repromatrijali
                </h3>
                <p className="text-gray-600">
                  Profesionalni materijali za lakirnicu - temeljni premazi, lakovi i preparacija površina.
                </p>
              </div>
            </Link>

            <Link
              href="/shop?category=poliranje"
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-lime-400 opacity-0 group-hover:opacity-10 transition" />
                <Clock className="text-white" size={48} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-lime-600 transition">
                  Poliranje & Detailing
                </h3>
                <p className="text-gray-600">
                  Paste i sredstva za profesionalno poliranje, korekciju boje i završnu obradu.
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link
              href="/shop"
              className="inline-flex items-center text-slate-900 hover:text-lime-600 font-semibold transition"
            >
              Vidi sve usluge
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Zainteresovani za veleprodaju?</h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
            Registrujte se za B2B nalog i ostvarite ekskluzivne popuste na sve proizvode sa prioritetnom podrškom
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-4 bg-lime-400 text-slate-900 rounded-lg font-bold hover:bg-lime-300 transition text-lg"
          >
            B2B Registracija
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
