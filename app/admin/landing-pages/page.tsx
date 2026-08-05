import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye, EyeOff, Zap } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"

export default async function LandingPagesPage() {
  const pages = await prisma.landingPage.findMany({
    orderBy: { createdAt: "desc" },
  })

  const activeCount = pages.filter(p => p.isActive).length
  const inactiveCount = pages.filter(p => !p.isActive).length

  return (
    <div>
      <Breadcrumbs items={[{ label: "Landing Pages" }]} />

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-orange-500 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Landing Pages</h1>
              <p className="text-gray-600 mt-1">
                {pages.length} stranica • {activeCount} aktivnih • {inactiveCount} neaktivnih
              </p>
            </div>
          </div>
          <Link
            href="/admin/landing-pages/new"
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-sm"
          >
            <Plus size={20} />
            Nova stranica
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Naslov
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Pixel Event
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{page.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 font-mono border border-gray-200">
                      /landing/{page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${
                        page.isActive
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {page.isActive ? (
                        <>
                          <Eye size={14} /> Aktivna
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} /> Neaktivna
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {page.pixelEventName ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">
                        <Zap size={14} />
                        {page.pixelEventName}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/landing/${page.slug}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition border border-transparent hover:border-gray-200"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/landing-pages/${page.id}/edit`}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition border border-transparent hover:border-orange-200"
                      >
                        <Edit size={18} />
                      </Link>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-16 w-16 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nema landing pages</h2>
            <p className="text-gray-600 mb-8">Kreirajte prvu landing stranicu</p>
            <Link
              href="/admin/landing-pages/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-sm"
            >
              <Plus size={20} />
              Nova stranica
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
