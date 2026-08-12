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
      <nav className="relative mx-auto max-w-7xl rounded-2xl border border-amber-100/50 bg-gradient-to-r from-amber-950/10 via-white/70 to-amber-700/10 px-4 py-3 shadow-lg shadow-amber-950/10 backdrop-blur-xl supports-[backdrop-filter]:bg-white/55">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/45 via-amber-50/20 to-amber-900/10 pointer-events-none" />
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
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/shop"
              className="px-4 py-2 text-sm font-medium text-amber-950/75 hover:text-amber-900 hover:bg-amber-50/75 rounded-lg transition"
            >
              Svi Proizvodi
            </Link>

            {/* Kategorije Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-amber-950/75 hover:text-amber-900 hover:bg-amber-50/75 rounded-lg transition"
              >
                Kategorije
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-amber-100/60 bg-gradient-to-br from-white/85 via-amber-50/75 to-amber-100/65 p-2 shadow-xl shadow-amber-950/15 backdrop-blur-xl">
                  <div className="grid gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="flex items-start gap-3 rounded-lg p-3 hover:bg-white/70 transition group"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-amber-900 to-neutral-950 text-amber-200 shadow-sm shadow-amber-950/20 group-hover:from-amber-800 group-hover:to-amber-950 transition">
                          <category.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-amber-800 transition">
                            {category.title}
                          </div>
                          <div className="text-sm text-amber-950/55">
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
              className="px-4 py-2 text-sm font-medium text-amber-950/75 hover:text-amber-900 hover:bg-amber-50/75 rounded-lg transition"
            >
              Blog
            </Link>
          </div>

          {/* Desna strana - Akcije */}
          <div className="flex items-center space-x-2">
            {/* Telefon */}
            <a
              href="tel:+38761577576"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-950/75 hover:text-amber-900 transition"
            >
              <Phone className="h-4 w-4 text-amber-800" />
              <span>+387 61 577 576</span>
            </a>

            {/* Korpa */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-amber-950/75 hover:bg-amber-50/75 hover:text-amber-900 transition"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-900 to-neutral-950 text-xs font-bold text-amber-100 shadow-sm shadow-amber-950/30">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User - samo ako je ulogovan */}
            {session && (
              <div className="hidden sm:flex items-center space-x-1">
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/account"}
                  className="flex h-10 items-center gap-2 rounded-lg px-3 text-amber-950/75 hover:bg-amber-50/75 hover:text-amber-900 transition"
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
              className="flex h-10 w-10 items-center justify-center rounded-lg text-amber-950/75 hover:bg-amber-50/75 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-amber-100/70 pt-4 lg:hidden">
            <div className="space-y-1">
              <Link
                href="/shop"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-amber-950/75 hover:bg-amber-50/75 hover:text-amber-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Svi Proizvodi
              </Link>

              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-950/50">
                Kategorije
              </div>

              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-amber-950/75 hover:bg-amber-50/75 hover:text-amber-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <category.icon className="h-5 w-5 text-amber-800" />
                  {category.title}
                </Link>
              ))}

              <Link
                href="/blog"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-amber-950/75 hover:bg-amber-50/75 hover:text-amber-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <a
                href="tel:+38761577576"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-amber-950/75 hover:bg-amber-50/75 hover:text-amber-900"
              >
                <Phone className="h-5 w-5 text-amber-800" />
                +387 61 577 576
              </a>

              {session && (
                <>
                  <div className="my-2 border-t border-amber-100/70" />
                  <Link
                    href={session.user.role === "ADMIN" ? "/admin" : "/account"}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-amber-950/75 hover:bg-amber-50/75 hover:text-amber-900"
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
        </div>
      </nav>
    </header>
  )
}
