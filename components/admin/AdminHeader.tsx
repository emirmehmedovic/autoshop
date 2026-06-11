"use client"

import { useSession, signOut } from "next-auth/react"
import { Bell, LogOut, User, Menu } from "lucide-react"
import { useState } from "react"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="backdrop-blur-md bg-slate-900/80 border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
        >
          <Menu size={24} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifikacije */}
          <button className="relative p-2.5 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-lime-400 rounded-full animate-pulse border-2 border-slate-900"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl hover:bg-white/5 transition backdrop-blur-sm border border-white/5"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg flex items-center justify-center shadow-lg shadow-lime-400/20">
                <User size={18} className="text-slate-900" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-white">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 backdrop-blur-md bg-slate-800/90 rounded-xl border border-white/10 py-2 z-20 shadow-2xl">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-red-400 transition"
                  >
                    <LogOut size={18} />
                    Odjavi se
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
