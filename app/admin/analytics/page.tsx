import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts"
import { auth } from "@/lib/auth"
import { OrderStatus, Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { TrendingUp, DollarSign, ShoppingCart, Target, Percent, Package, Banknote, Filter, Save } from "lucide-react"

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

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

function dateFromInput(value?: string, endOfDay = false) {
  if (!value) return undefined
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function startOfDay(date: Date) {
  return new Date(`${dateKey(date)}T00:00:00.000`)
}

function endOfDay(date: Date) {
  return new Date(`${dateKey(date)}T23:59:59.999`)
}

function daysInclusive(from: Date, to: Date) {
  const start = startOfDay(from).getTime()
  const end = startOfDay(to).getTime()
  return Math.max(1, Math.round((end - start) / 86400000) + 1)
}

function addDays(date: Date, days: number) {
  const next = startOfDay(date)
  next.setDate(next.getDate() + days)
  return next
}

async function saveAdSpend(formData: FormData) {
  "use server"

  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Nemate pristup")
  }

  const platform = String(formData.get("platform") || "meta").trim().toLowerCase()
  const campaignName = String(formData.get("campaignName") || "").trim()
  const fromValue = String(formData.get("dateFrom") || "")
  const toValue = String(formData.get("dateTo") || "")
  const spend = Number(formData.get("spend") || 0)
  const dateFrom = dateFromInput(fromValue)
  const dateTo = dateFromInput(toValue, true)

  if (!dateFrom || !dateTo || dateTo < dateFrom || !Number.isFinite(spend) || spend < 0) {
    return
  }

  const existing = await prisma.adSpendRecord.findFirst({
    where: {
      platform,
      dateFrom,
      dateTo,
      campaignName: campaignName || null,
    },
    orderBy: { createdAt: "desc" },
  })

  if (existing) {
    await prisma.adSpendRecord.update({
      where: { id: existing.id },
      data: { date: dateFrom, dateFrom, dateTo, spend, campaignName: campaignName || null },
    })
  } else {
    await prisma.adSpendRecord.create({
      data: {
        platform,
        date: dateFrom,
        dateFrom,
        dateTo,
        spend,
        campaignName: campaignName || null,
      },
    })
  }

  revalidatePath("/admin/analytics")
}

async function getAnalyticsData(params: SearchParams) {
  const now = new Date()
  const fallbackFrom = new Date(now)
  fallbackFrom.setDate(fallbackFrom.getDate() - 30)

  const from = dateFromInput(params.from) || fallbackFrom
  const to = dateFromInput(params.to, true) || now
  const selectedStatus = Object.values(OrderStatus).includes(params.status as OrderStatus)
    ? params.status as OrderStatus
    : undefined

  const orderWhere: Prisma.OrderWhereInput = {
    createdAt: { gte: from, lte: to },
    ...(selectedStatus ? { status: selectedStatus } : { status: { notIn: ["CANCELLED", "RETURNED"] } }),
  }

  const [orders, adSpendRecords] = await Promise.all([
    prisma.order.findMany({
      where: orderWhere,
      select: {
        createdAt: true,
        subtotal: true,
        shippingCost: true,
        discount: true,
        total: true,
        items: {
          select: {
            quantity: true,
            purchasePrice: true,
            product: {
              select: { purchasePrice: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.adSpendRecord.findMany({
      where: {
        OR: [
          {
            dateFrom: { lte: to },
            dateTo: { gte: from },
          },
          {
            dateFrom: null,
            date: { gte: from, lte: to },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ])

  const revenueByDate = orders.reduce((acc: Record<string, number>, order) => {
    const key = dateKey(order.createdAt)
    const netRevenue = Math.max(0, order.subtotal - order.discount)
    acc[key] = (acc[key] || 0) + netRevenue
    return acc
  }, {})

  const adSpendByDate = adSpendRecords.reduce((acc: Record<string, number>, record) => {
    const spendFrom = record.dateFrom || record.date
    const spendTo = record.dateTo || record.date
    const periodStart = startOfDay(spendFrom)
    const periodEnd = startOfDay(spendTo)
    const overlapStart = startOfDay(periodStart < from ? from : periodStart)
    const overlapEnd = startOfDay(periodEnd > to ? to : periodEnd)

    if (overlapEnd < overlapStart) return acc

    const dailySpend = record.spend / daysInclusive(periodStart, periodEnd)
    const overlapDays = daysInclusive(overlapStart, overlapEnd)

    for (let index = 0; index < overlapDays; index++) {
      const key = dateKey(addDays(overlapStart, index))
      acc[key] = (acc[key] || 0) + dailySpend
    }

    return acc
  }, {})

  const totalRevenue = orders.reduce((sum, order) => sum + Math.max(0, order.subtotal - order.discount), 0)
  const totalGrossWithShipping = orders.reduce((sum, order) => sum + order.total, 0)
  const totalShipping = orders.reduce((sum, order) => sum + order.shippingCost, 0)
  const purchaseCost = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => {
      const unitCost = item.purchasePrice || item.product.purchasePrice || 0
      return itemSum + unitCost * item.quantity
    }, 0)
  }, 0)
  const totalSpend = adSpendRecords.reduce((sum, record) => {
    const spendFrom = record.dateFrom || record.date
    const spendTo = record.dateTo || record.date
    const periodStart = startOfDay(spendFrom)
    const periodEnd = startOfDay(spendTo)
    const overlapStart = startOfDay(periodStart < from ? from : periodStart)
    const overlapEnd = startOfDay(periodEnd > to ? to : periodEnd)

    if (overlapEnd < overlapStart) return sum

    return sum + (record.spend / daysInclusive(periodStart, periodEnd)) * daysInclusive(overlapStart, overlapEnd)
  }, 0)
  const totalOrders = orders.length
  const grossProfit = totalRevenue - purchaseCost
  const profitAfterAds = grossProfit - totalSpend
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0
  const cpa = totalOrders > 0 ? totalSpend / totalOrders : 0
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

  return {
    from: dateInputValue(from),
    to: dateInputValue(to),
    selectedStatus,
    revenueByDate,
    adSpendByDate,
    totalRevenue,
    totalGrossWithShipping,
    totalShipping,
    totalSpend,
    totalOrders,
    purchaseCost,
    grossProfit,
    profitAfterAds,
    roas,
    cpa,
    aov,
    margin,
    adSpendRecords,
  }
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const data = await getAnalyticsData(params)

  return (
    <div>
      <Breadcrumbs items={[{ label: "Analitika" }]} />

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-orange-500 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Prodajna Analitika</h1>
            <p className="text-gray-600 mt-1">Promet je prikazan bez poštarine, jer poštarinu plaća kupac.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <form action="/admin/analytics" className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">Filter izvještaja</h2>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
            <label>
              <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Od datuma</span>
              <input type="date" name="from" defaultValue={data.from} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </label>
            <label>
              <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Do datuma</span>
              <input type="date" name="to" defaultValue={data.to} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </label>
            <label>
              <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Status</span>
              <select name="status" defaultValue={data.selectedStatus || ""} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Svi osim otkazanih/vraćenih</option>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600">
              <Filter size={18} />
              Prikaži
            </button>
          </div>
        </form>

        <form action={saveAdSpend} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">Unos reklama</h2>
          <div className="space-y-3">
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Od datuma</span>
              <input type="date" name="dateFrom" defaultValue={data.from} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Do datuma</span>
              <input type="date" name="dateTo" defaultValue={data.to} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Platforma</span>
                <select name="platform" defaultValue="meta" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="meta">Meta</option>
                  <option value="google">Google</option>
                  <option value="tiktok">TikTok</option>
                  <option value="other">Ostalo</option>
                </select>
              </label>
              <label>
                <span className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Ukupno KM</span>
                <input type="number" name="spend" min="0" step="0.01" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </label>
            </div>
            <input name="campaignName" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Kampanja (opcionalno)" />
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800">
              <Save size={18} />
              Sačuvaj trošak
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <KpiCard label="Promet bez poštarine" value={data.totalRevenue} icon={<DollarSign className="text-orange-500" size={20} />} color="orange" />
        <KpiCard label="Nabavna vrijednost" value={data.purchaseCost} icon={<Package className="text-emerald-600" size={20} />} color="emerald" />
        <KpiCard label="Bruto profit" value={data.grossProfit} icon={<Banknote className="text-green-600" size={20} />} color="green" />
        <KpiCard label="Profit poslije reklama" value={data.profitAfterAds} icon={<TrendingUp className="text-blue-500" size={20} />} color="blue" />
        <KpiCard label="Ad Spend" value={data.totalSpend} icon={<TrendingUp className="text-blue-500" size={20} />} color="blue" />
        <KpiCard label="ROAS" value={data.roas} suffix="x" icon={<Target className="text-purple-500" size={20} />} color="purple" />
        <KpiCard label="CPA" value={data.cpa} icon={<ShoppingCart className="text-orange-500" size={20} />} color="orange" />
        <KpiCard label="Marža" value={data.margin} suffix="%" icon={<Percent className="text-indigo-500" size={20} />} color="indigo" />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Narudžbi</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{data.totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Prosječna narudžba bez poštarine</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{data.aov.toFixed(2)} <span className="text-orange-500">KM</span></p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Poštarina izbijena iz prometa</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{data.totalShipping.toFixed(2)} <span className="text-orange-500">KM</span></p>
          <p className="mt-1 text-xs text-gray-500">Ukupno sa poštarinom: {data.totalGrossWithShipping.toFixed(2)} KM</p>
        </div>
      </div>

      <AnalyticsCharts
        revenueByDate={data.revenueByDate}
        adSpendByDate={data.adSpendByDate}
      />

      {data.adSpendRecords.length > 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Zadnji uneseni troškovi reklama</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3">Period</th>
                  <th className="py-3">Platforma</th>
                  <th className="py-3">Kampanja</th>
                  <th className="py-3 text-right">Iznos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.adSpendRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="py-3">
                      {new Date(record.dateFrom || record.date).toLocaleDateString("bs-BA")}
                      {" - "}
                      {new Date(record.dateTo || record.date).toLocaleDateString("bs-BA")}
                    </td>
                    <td className="py-3 capitalize">{record.platform}</td>
                    <td className="py-3">{record.campaignName || "-"}</td>
                    <td className="py-3 text-right font-bold">{record.spend.toFixed(2)} KM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function KpiCard({
  label,
  value,
  suffix = " KM",
  icon,
  color,
}: {
  label: string
  value: number
  suffix?: string
  icon: React.ReactNode
  color: "orange" | "blue" | "purple" | "indigo" | "emerald" | "green"
}) {
  const classes = {
    orange: "bg-orange-50 border-orange-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    indigo: "bg-indigo-50 border-indigo-200",
    emerald: "bg-emerald-50 border-emerald-200",
    green: "bg-green-50 border-green-200",
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        <div className={`p-2 rounded-lg border ${classes[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value.toFixed(2)}
        <span className="text-orange-500">{suffix}</span>
      </p>
    </div>
  )
}
