"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/lib/store/cartStore"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <header className="bg-slate-900 sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-white tracking-tight">AUTOSHOP</span>
          </Link>

          {/* Desktop navigacija */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Proizvodi
            </Link>
            <Link href="/shop?category=auto-kozmetika" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Auto Kozmetika
            </Link>
            <Link href="/shop?category=repromatrijali" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Repromatrijali
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Blog
            </Link>
          </nav>

          {/* Desna strana - Akcije */}
          <div className="flex items-center space-x-3">
            {/* Korpa */}
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime-400 text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/account"}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                >
                  <User size={20} />
                  <span className="hidden md:inline text-sm">{session.user.name || session.user.email}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-400 hover:text-red-400 transition"
                  title="Odjavi se"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center space-x-1 text-gray-300 hover:text-white transition"
              >
                <User size={20} />
                <span className="text-sm">Prijava</span>
              </Link>
            )}

            {/* CTA Button */}
            <Link
              href="/register"
              className="hidden md:inline-flex px-5 py-2 bg-lime-400 text-slate-900 rounded-md font-semibold hover:bg-lime-300 transition text-sm"
            >
              Kontaktirajte nas
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-3">
              <Link href="/shop" className="text-gray-300 hover:text-white transition py-2">
                Proizvodi
              </Link>
              <Link href="/shop?category=auto-kozmetika" className="text-gray-300 hover:text-white transition py-2">
                Auto Kozmetika
              </Link>
              <Link href="/shop?category=repromatrijali" className="text-gray-300 hover:text-white transition py-2">
                Repromatrijali
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition py-2">
                Blog
              </Link>
              <Link href="/register" className="px-5 py-2 bg-lime-400 text-slate-900 rounded-md font-semibold text-center">
                Kontaktirajte nas
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
