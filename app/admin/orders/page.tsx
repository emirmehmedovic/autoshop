import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const statusLabels: Record<string, string> = {
    PENDING: "Na čekanju",
    CONFIRMED: "Potvrđena",
    PROCESSING: "U pripremi",
    SHIPPED: "Poslana",
    DELIVERED: "Dostavljena",
    CANCELLED: "Otkazana",
    RETURNED: "Vraćena",
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    RETURNED: "bg-gray-50 text-gray-700 border-gray-200",
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Narudžbe" }]} />

      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Narudžbe</h1>
            <p className="text-gray-600 mt-1">{orders.length} aktivnih narudžbi</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Broj</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kupac</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ukupno</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">#{order.orderNumber}</td>
                  <td className="px-6 py-4 text-gray-700">{order.shippingName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("bs-BA")}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{order.total.toFixed(2)} <span className="text-orange-500">KM</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="inline-flex p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition border border-transparent hover:border-orange-200">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nema narudžbi za prikaz</p>
          </div>
        )}
      </div>
    </div>
  )
}
