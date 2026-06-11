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

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-lime-400 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-white">Landing Pages</h1>
              <p className="text-gray-400 mt-1">
                {pages.length} stranica • {activeCount} aktivnih • {inactiveCount} neaktivnih
              </p>
            </div>
          </div>
          <Link
            href="/admin/landing-pages/new"
            className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
          >
            <Plus size={20} />
            Nova stranica
          </Link>
        </div>
      </div>

      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Naslov
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Pixel Event
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-bold text-white">{page.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <code className="bg-slate-700/30 px-3 py-1.5 rounded-lg text-gray-300 font-mono border border-white/10">
                      /landing/{page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${
                        page.isActive
                          ? "bg-lime-500/10 text-lime-400 border-lime-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
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
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Zap size={14} />
                        {page.pixelEventName}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/landing/${page.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition border border-transparent hover:border-white/10"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/landing-pages/${page.id}/edit`}
                        className="p-2 text-lime-400 hover:bg-lime-400/10 rounded-lg transition border border-transparent hover:border-lime-400/20"
                      >
                        <Edit size={18} />
                      </Link>
                      <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition border border-transparent hover:border-red-400/20">
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
            <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-16 w-16 text-lime-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Nema landing pages</h2>
            <p className="text-gray-400 mb-8">Kreirajte prvu landing stranicu</p>
            <Link
              href="/admin/landing-pages/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
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
