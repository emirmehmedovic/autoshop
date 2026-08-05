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
    <header className="backdrop-blur-xl bg-gradient-to-r from-white/90 via-white/80 to-white/90 border-b-[5px] border-white/80 sticky top-0 z-40 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
        >
          <Menu size={24} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifikacije */}
          <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse border-2 border-white"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl hover:bg-gray-100 transition border border-gray-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <User size={18} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-900">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 py-2 z-20 shadow-xl">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-red-500 transition"
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
