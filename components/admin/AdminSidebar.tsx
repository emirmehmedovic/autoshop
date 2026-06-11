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
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Narudžbe", href: "/admin/orders", icon: ShoppingCart },
  { name: "Proizvodi", href: "/admin/products", icon: Package },
  { name: "Kategorije", href: "/admin/categories", icon: FolderTree },
  { name: "Kupci", href: "/admin/customers", icon: Users },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Analitika", href: "/admin/analytics", icon: BarChart3 },
  { name: "Postavke", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-72 bg-slate-950 border-r border-white/10">
        {/* Logo - Glassmorphism */}
        <Link href="/admin" className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-600 rounded-xl flex items-center justify-center shadow-lg shadow-lime-400/20">
              <Sparkles className="text-slate-900" size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight">AUTOSHOP</h1>
            <p className="text-xs text-lime-400 font-semibold">Admin Panel</p>
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
                    ? "bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-slate-900 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer - Vrati se na shop */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-lime-400 transition backdrop-blur-sm border border-white/5"
          >
            <Store size={20} />
            <span>Vrati se na shop</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
