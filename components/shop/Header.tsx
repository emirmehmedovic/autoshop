"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, LogOut, Menu, X, ChevronDown, Sparkles, Droplets, SprayCan, Car, Phone } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/lib/store/cartStore"

const categories = [
  {
    title: "Auto Kozmetika",
    href: "/shop?category=auto-kozmetika",
    description: "Sredstva za čišćenje i njegu vozila",
    icon: Sparkles,
  },
  {
    title: "Repromatrijali",
    href: "/shop?category=repromatrijali",
    description: "Profesionalni materijali za lakirnicu",
    icon: SprayCan,
  },
  {
    title: "Poliranje",
    href: "/shop?category=poliranje",
    description: "Paste i sredstva za poliranje",
    icon: Droplets,
  },
  {
    title: "Pranje",
    href: "/shop?category=pranje",
    description: "Šamponi i sredstva za pranje",
    icon: Car,
  },
]

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <header className="sticky top-4 z-50 mx-4 lg:mx-8">
      <nav className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/70 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="GlossDrive - Detailing & Car Care"
              className="h-10 w-[180px] sm:h-12 sm:w-[220px] md:h-14 md:w-[280px] object-contain object-left"
            />
          </Link>

          {/* Desktop navigacija */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/shop"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
            >
              Svi Proizvodi
            </Link>

            {/* Kategorije Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
              >
                Kategorije
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-white/20 bg-white/80 p-2 shadow-xl backdrop-blur-xl">
                  <div className="grid gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="flex items-start gap-3 rounded-lg p-3 hover:bg-orange-50 transition group"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition">
                          <category.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-orange-500 transition">
                            {category.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
            >
              Blog
            </Link>
          </div>

          {/* Desna strana - Akcije */}
          <div className="flex items-center space-x-2">
            {/* Telefon */}
            <a
              href="tel:+38761577576"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition"
            >
              <Phone className="h-4 w-4 text-orange-500" />
              <span>+387 61 577 576</span>
            </a>

            {/* Korpa */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User - samo ako je ulogovan */}
            {session && (
              <div className="hidden sm:flex items-center space-x-1">
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/account"}
                  className="flex h-10 items-center gap-2 rounded-lg px-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{session.user.name || 'Account'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
                  title="Odjavi se"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-orange-50 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-gray-200/50 pt-4 lg:hidden">
            <div className="space-y-1">
              <Link
                href="/shop"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Svi Proizvodi
              </Link>

              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Kategorije
              </div>

              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <category.icon className="h-5 w-5 text-orange-500" />
                  {category.title}
                </Link>
              ))}

              <Link
                href="/blog"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <a
                href="tel:+38761577576"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
              >
                <Phone className="h-5 w-5 text-orange-500" />
                +387 61 577 576
              </a>

              {session && (
                <>
                  <div className="my-2 border-t border-gray-200/50" />
                  <Link
                    href={session.user.role === "ADMIN" ? "/admin" : "/account"}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {session.user.name || 'Moj račun'}
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Odjavi se
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
