import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* O nama */}
          <div>
            <img
              src="/logo.png"
              alt="GlossDrive"
              className="h-12 sm:h-14 w-auto mb-5 brightness-0 invert opacity-90"
            />
            <p className="text-sm leading-relaxed text-stone-500">
              Vaš pouzdani partner za premium auto kozmetiku, detailing i car care proizvode u Bosni i Hercegovini.
            </p>
          </div>

          {/* Kategorije */}
          <div>
            <h3 className="text-stone-200 font-semibold text-xs uppercase tracking-[0.2em] mb-5">Proizvodi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop?category=auto-kozmetika" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Auto Kozmetika
                </Link>
              </li>
              <li>
                <Link href="/shop?category=repromatrijali" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Repromatrijali
                </Link>
              </li>
              <li>
                <Link href="/shop?category=poliranje" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Poliranje
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pranje" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Pranje
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Svi Proizvodi
                </Link>
              </li>
            </ul>
          </div>

          {/* Informacije */}
          <div>
            <h3 className="text-stone-200 font-semibold text-xs uppercase tracking-[0.2em] mb-5">Informacije</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/o-nama" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  O nama
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/dostava" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Dostava i plaćanje
                </Link>
              </li>
              <li>
                <Link href="/veleprodaja" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Veleprodaja / B2B
                </Link>
              </li>
              <li>
                <Link href="/privatnost" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  Politika privatnosti
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-stone-200 font-semibold text-xs uppercase tracking-[0.2em] mb-5">Kontakt</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-amber-500 shrink-0" strokeWidth={1.5} />
                <a href="tel:+38761577576" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  +387 61 577 576
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-amber-500 shrink-0" strokeWidth={1.5} />
                <a href="mailto:info@glossdrive.ba" className="text-stone-500 hover:text-amber-400 transition-colors duration-300">
                  info@glossdrive.ba
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-amber-500 shrink-0" strokeWidth={1.5} />
                <span className="text-stone-500">Tuzla, Bosna i Hercegovina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800/50 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-stone-600">&copy; {new Date().getFullYear()} GlossDrive. Sva prava zadržana.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privatnost" className="text-stone-600 hover:text-amber-400 transition-colors duration-300">
              Privatnost
            </Link>
            <Link href="/uslovi" className="text-stone-600 hover:text-amber-400 transition-colors duration-300">
              Uslovi korištenja
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
