import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts"
import { TrendingUp, DollarSign, ShoppingCart, Target, Percent } from "lucide-react"

export const dynamic = "force-dynamic"

async function getAnalyticsData() {
  const now = new Date()
  const last30Days = new Date(now)
  last30Days.setDate(last30Days.getDate() - 30)

  // Prihodi po danima (zadnjih 30 dana)
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: last30Days },
      status: { notIn: ["CANCELLED", "RETURNED"] },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: { createdAt: "asc" },
  })

  // Grupisanje po datumima
  const revenueByDate = orders.reduce((acc: Record<string, number>, order) => {
    const date = order.createdAt.toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + order.total
    return acc
  }, {})

  // Ad spend podaci
  const adSpendRecords = await prisma.adSpendRecord.findMany({
    where: {
      date: { gte: last30Days },
    },
    orderBy: { date: "asc" },
  })

  // Grupisanje ad spend po datumima
  const adSpendByDate = adSpendRecords.reduce((acc: Record<string, number>, record) => {
    const date = record.date.toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + record.spend
    return acc
  }, {})

  // Ukupni totali
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalSpend = adSpendRecords.reduce((sum, record) => sum + record.spend, 0)
  const totalOrders = orders.length

  // ROAS (Return on Ad Spend)
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0

  // CPA (Cost Per Acquisition)
  const cpa = totalOrders > 0 ? totalSpend / totalOrders : 0

  // Prosječna vrijednost narudžbe
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return {
    revenueByDate,
    adSpendByDate,
    totalRevenue,
    totalSpend,
    totalOrders,
    roas,
    cpa,
    aov,
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  return (
    <div>
      <Breadcrumbs items={[{ label: "Analitika" }]} />

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-orange-500 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Prodajna Analitika</h1>
            <p className="text-gray-600 mt-1">Pregled performansi za zadnjih 30 dana</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Ukupan prihod */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-orange-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ukupan prihod</p>
            <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 group-hover:bg-orange-100 transition">
              <DollarSign className="text-orange-500" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.totalRevenue.toFixed(2)} <span className="text-orange-500">KM</span></p>
        </div>

        {/* Ad Spend */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ad Spend</p>
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 group-hover:bg-blue-100 transition">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.totalSpend.toFixed(2)} <span className="text-blue-500">KM</span></p>
        </div>

        {/* ROAS */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">ROAS</p>
            <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 group-hover:bg-purple-100 transition">
              <Target className="text-purple-500" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.roas.toFixed(2)}<span className="text-purple-500">x</span></p>
          <p className="text-xs text-gray-500 mt-1">Return on Ad Spend</p>
        </div>

        {/* CPA */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-orange-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">CPA</p>
            <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 group-hover:bg-orange-100 transition">
              <ShoppingCart className="text-orange-500" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.cpa.toFixed(2)} <span className="text-orange-500">KM</span></p>
          <p className="text-xs text-gray-500 mt-1">Cost per Acquisition</p>
        </div>

        {/* AOV */}
        <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">AOV</p>
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 group-hover:bg-indigo-100 transition">
              <Percent className="text-indigo-500" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.aov.toFixed(2)} <span className="text-indigo-500">KM</span></p>
          <p className="text-xs text-gray-500 mt-1">Average Order Value</p>
        </div>
      </div>

      {/* Grafovi */}
      <AnalyticsCharts
        revenueByDate={data.revenueByDate}
        adSpendByDate={data.adSpendByDate}
      />
    </div>
  )
}
