"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  FileText,
  BarChart3,
  Settings,
  Store,
  Sparkles,
  Shield,
  Globe,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Narudžbe", href: "/admin/orders", icon: ShoppingCart },
  { name: "Proizvodi", href: "/admin/products", icon: Package },
  { name: "Kategorije", href: "/admin/categories", icon: FolderTree },
  { name: "Kupci", href: "/admin/customers", icon: Users },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "SEO & Landing", href: "/admin/seo-landing", icon: Globe },
  { name: "Analitika", href: "/admin/analytics", icon: BarChart3 },
  { name: "Administratori", href: "/admin/users", icon: Shield },
  { name: "Postavke", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-72 backdrop-blur-xl bg-gradient-to-b from-white/90 via-white/80 to-gray-50/90 border-r-[5px] border-white/80 shadow-[8px_0_32px_rgba(0,0,0,0.05)]">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900 tracking-tight">AUTOSHOP</h1>
            <p className="text-xs text-orange-500 font-semibold">Admin Panel</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer - Vrati se na shop */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-orange-500 transition border border-gray-200"
          >
            <Store size={20} />
            <span>Vrati se na shop</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
