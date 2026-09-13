"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, LogOut, Menu, X, ChevronDown, Sparkles, Droplets, SprayCan, Car, Phone } from "lucide-react"
import { useState, useEffect } from "react"
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
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <header className="sticky top-4 z-50 mx-4 lg:mx-8">
      <nav className="relative mx-auto max-w-7xl rounded-full px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl bg-white/80 ring-1 ring-black/[0.04]">
        <div className="relative">
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
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/shop"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full transition-colors duration-300"
            >
              Svi Proizvodi
            </Link>

            {/* Kategorije Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full transition-colors duration-300"
              >
                Kategorije
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 rounded-2xl bg-white/95 backdrop-blur-xl p-2 shadow-xl shadow-black/10 ring-1 ring-black/[0.04]">
                  <div className="grid gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="flex items-start gap-3 rounded-xl p-3 hover:bg-stone-50 transition-colors duration-200 group"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors duration-200">
                          <category.icon className="h-4 w-4" strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm group-hover:text-amber-700 transition-colors duration-200">
                            {category.title}
                          </div>
                          <div className="text-xs text-gray-500">
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
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full transition-colors duration-300"
            >
              Blog
            </Link>
          </div>

          {/* Desna strana - Akcije */}
          <div className="flex items-center gap-1">
            {/* Telefon */}
            <a
              href="tel:+38761577576"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <Phone className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
              <span>+387 61 577 576</span>
            </a>

            {/* Korpa */}
            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-stone-100 hover:text-gray-900 transition-colors duration-300"
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User - samo ako je ulogovan */}
            {session && (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/account"}
                  className="flex h-9 items-center gap-2 rounded-full px-3 text-gray-600 hover:bg-stone-100 hover:text-gray-900 transition-colors duration-300"
                >
                  <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  <span className="text-sm font-medium">{session.user.name || 'Account'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-300"
                  title="Odjavi se"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-stone-100 lg:hidden transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-stone-100 pt-4 lg:hidden">
            <div className="space-y-1">
              <Link
                href="/shop"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-stone-50 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Svi Proizvodi
              </Link>

              <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Kategorije
              </div>

              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-stone-50 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <category.icon className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
                  {category.title}
                </Link>
              ))}

              <Link
                href="/blog"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-stone-50 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <a
                href="tel:+38761577576"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-stone-50 hover:text-gray-900 transition-colors duration-200"
              >
                <Phone className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
                +387 61 577 576
              </a>

              {session && (
                <>
                  <div className="my-2 border-t border-stone-100" />
                  <Link
                    href={session.user.role === "ADMIN" ? "/admin" : "/account"}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-stone-50 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                    {session.user.name || 'Moj račun'}
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    Odjavi se
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        </div>
      </nav>
    </header>
  )
}
