import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, ShoppingBag, Building2 } from "lucide-react"

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect("/login?redirect=/account")
  }

  const isB2B = session.user.customerType === "B2B"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-600">Prijavljen kao</p>
                <p className="font-semibold text-gray-900">{session.user.name}</p>
                <p className="text-sm text-gray-500">{session.user.email}</p>
                {isB2B && (
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                    B2B Nalog
                  </span>
                )}
              </div>

              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  <User size={18} />
                  Profil
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  <ShoppingBag size={18} />
                  Moje narudžbe
                </Link>
                {isB2B && (
                  <Link
                    href="/account/b2b"
                    className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-gray-100"
                  >
                    <Building2 size={18} />
                    B2B Panel
                  </Link>
                )}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
