import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* O nama */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4 tracking-tight">AUTOSHOP</h3>
            <p className="text-sm leading-relaxed">
              Vaš pouzdani partner za premium auto kozmetiku i repromatrijale u Bosni i Hercegovini.
            </p>
          </div>

          {/* Kategorije */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Proizvodi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop?category=auto-kozmetika" className="hover:text-lime-400 transition">
                  Auto Kozmetika
                </Link>
              </li>
              <li>
                <Link href="/shop?category=repromatrijali" className="hover:text-lime-400 transition">
                  Repromatrijali
                </Link>
              </li>
              <li>
                <Link href="/shop?category=poliranje" className="hover:text-lime-400 transition">
                  Poliranje
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pranje" className="hover:text-lime-400 transition">
                  Pranje
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-lime-400 transition">
                  Svi Proizvodi
                </Link>
              </li>
            </ul>
          </div>

          {/* Informacije */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Informacije</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-lime-400 transition">
                  O nama
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-lime-400 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-lime-400 transition">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-lime-400 transition">
                  Dostava i plaćanje
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-lime-400 transition">
                  Politika privatnosti
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Kontakt</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="mt-0.5 text-lime-400 flex-shrink-0" />
                <span>+387 XX XXX XXX</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="mt-0.5 text-lime-400 flex-shrink-0" />
                <a href="mailto:info@autoshop.ba" className="hover:text-lime-400 transition">
                  info@autoshop.ba
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 text-lime-400 flex-shrink-0" />
                <span>Sarajevo, Bosna i Hercegovina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} AutoShop. Sva prava zadržana.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-lime-400 transition">
              Privatnost
            </Link>
            <Link href="/terms" className="hover:text-lime-400 transition">
              Uslovi korištenja
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
