import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Trash2, DollarSign, Users, Package } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"

export const dynamic = "force-dynamic"

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

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-orange-500 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Cjenovne grupe</h1>
              <p className="text-gray-600 mt-1">Upravljanje B2B cjenovnim grupama</p>
            </div>
          </div>
          <Link
            href="/admin/price-groups/new"
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-sm"
          >
            <Plus size={20} />
            Dodaj grupu
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Grupe</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{priceGroups.length}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <DollarSign className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">B2B Kupci</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Proizvodi</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Naziv
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Popust
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Kupci
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Proizvodi
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {priceGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{group.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
                      {group.discount}% popust
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg font-bold text-sm">
                      {group._count.b2bProfiles}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg font-bold text-sm">
                      {group._count.productPrices}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/price-groups/${group.id}/edit`}
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

        {priceGroups.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-16 w-16 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nema cjenovnih grupa</h2>
            <p className="text-gray-600 mb-8">Dodajte prvu cjenovnu grupu za B2B kupce</p>
            <Link
              href="/admin/price-groups/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-sm"
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
