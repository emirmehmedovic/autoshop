import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Trash2, DollarSign, Users, Package } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"

export default async function PriceGroupsPage() {
  const priceGroups = await prisma.priceGroup.findMany({
    include: {
      _count: {
        select: {
          b2bProfiles: true,
          productPrices: true,
        },
      },
    },
  })

  const totalCustomers = priceGroups.reduce((sum, g) => sum + g._count.b2bProfiles, 0)
  const totalProducts = priceGroups.reduce((sum, g) => sum + g._count.productPrices, 0)

  return (
    <div>
      <Breadcrumbs items={[{ label: "Cjenovne grupe" }]} />

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-lime-400 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-white">Cjenovne grupe</h1>
              <p className="text-gray-400 mt-1">Upravljanje B2B cjenovnim grupama</p>
            </div>
          </div>
          <Link
            href="/admin/price-groups/new"
            className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
          >
            <Plus size={20} />
            Dodaj grupu
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Grupe</p>
              <p className="text-3xl font-bold text-white mt-1">{priceGroups.length}</p>
            </div>
            <div className="p-3 bg-lime-400/10 rounded-lg border border-lime-400/20">
              <DollarSign className="text-lime-400" size={24} />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">B2B Kupci</p>
              <p className="text-3xl font-bold text-white mt-1">{totalCustomers}</p>
            </div>
            <div className="p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
              <Users className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Proizvodi</p>
              <p className="text-3xl font-bold text-white mt-1">{totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
              <Package className="text-blue-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Naziv
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Popust
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Kupci
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Proizvodi
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {priceGroups.map((group) => (
                <tr key={group.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-bold text-white">{group.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                      {group.discount}% popust
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg font-bold text-sm">
                      {group._count.b2bProfiles}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg font-bold text-sm">
                      {group._count.productPrices}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/price-groups/${group.id}/edit`}
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

        {priceGroups.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-16 w-16 text-lime-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Nema cjenovnih grupa</h2>
            <p className="text-gray-400 mb-8">Dodajte prvu cjenovnu grupu za B2B kupce</p>
            <Link
              href="/admin/price-groups/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
            >
              <Plus size={20} />
              Dodaj grupu
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
