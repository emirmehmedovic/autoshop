import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Eye, Filter, Pencil, Plus, X } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { OrderStatus, Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

interface SearchParams {
  from?: string
  to?: string
  status?: string
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Na čekanju",
  CONFIRMED: "Potvrđena",
  PROCESSING: "U pripremi",
  SHIPPED: "Poslana",
  DELIVERED: "Dostavljena",
  CANCELLED: "Otkazana",
  RETURNED: "Vraćena",
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNED: "bg-gray-50 text-gray-700 border-gray-200",
}

function dateFromInput(value?: string, endOfDay = false) {
  if (!value) return undefined
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const from = dateFromInput(params.from)
  const to = dateFromInput(params.to, true)
  const selectedStatus = Object.values(OrderStatus).includes(params.status as OrderStatus)
    ? params.status as OrderStatus
    : undefined

  const where: Prisma.OrderWhereInput = {
    ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    ...(selectedStatus ? { status: selectedStatus } : {}),
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const netRevenue = orders.reduce((sum, order) => sum + Math.max(0, order.subtotal - order.discount), 0)
  const shippingTotal = orders.reduce((sum, order) => sum + order.shippingCost, 0)
  const grossTotal = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div>
      <Breadcrumbs items={[{ label: "Narudžbe" }]} />

      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Narudžbe</h1>
              <p className="text-gray-600 mt-1">{orders.length} aktivnih narudžbi</p>
            </div>
          </div>
          <Link href="/admin/orders/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600">
            <Plus size={18} />
            Nova narudžba
          </Link>
        </div>
      </div>

      <form action="/admin/orders" className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-end">
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Od datuma</span>
            <input
              type="date"
              name="from"
              defaultValue={params.from || ""}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Do datuma</span>
            <input
              type="date"
              name="to"
              defaultValue={params.to || ""}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Status</span>
            <select
              name="status"
              defaultValue={selectedStatus || ""}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Svi statusi</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>{statusLabels[status]}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
            <Filter size={18} />
            Filtriraj
          </button>
          <Link href="/admin/orders" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50">
            <X size={18} />
            Reset
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Promet bez poštarine</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{netRevenue.toFixed(2)} <span className="text-orange-500">KM</span></p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Poštarina izbijena</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{shippingTotal.toFixed(2)} <span className="text-orange-500">KM</span></p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ukupno sa poštarinom</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{grossTotal.toFixed(2)} <span className="text-orange-500">KM</span></p>
          </div>
        </div>
      </form>

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
                  <td className="px-6 py-4 text-right space-x-1">
                    <Link href={`/admin/orders/${order.id}`} className="inline-flex p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition border border-transparent hover:border-orange-200">
                      <Eye size={18} />
                    </Link>
                    <Link href={`/admin/orders/${order.id}/edit`} className="inline-flex p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition border border-transparent hover:border-gray-200">
                      <Pencil size={18} />
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
