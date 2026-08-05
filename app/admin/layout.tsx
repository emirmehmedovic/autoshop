"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Zatvori meni kada se promijeni ruta
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Spriječi scroll kada je meni otvoren
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <div className="flex h-screen relative">
      {/* Background pattern */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "white",
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        className="fixed inset-0 -z-9 pointer-events-none"
        style={{
          background: `radial-gradient(circle 600px at 100% 150px, rgba(254, 215, 170, 0.3), transparent),
                       radial-gradient(circle 400px at 0% 50%, rgba(191, 219, 254, 0.3), transparent),
                       radial-gradient(circle 500px at 50% 100%, rgba(233, 213, 255, 0.2), transparent)`,
        }}
      />

      {/* Sidebar - Desktop */}
      <AdminSidebar />

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar isMobile onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
