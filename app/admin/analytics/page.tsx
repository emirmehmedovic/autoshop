import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts"
import { TrendingUp, DollarSign, ShoppingCart, Target, Percent } from "lucide-react"

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

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white">Prodajna Analitika</h1>
            <p className="text-gray-400 mt-1">Pregled performansi za zadnjih 30 dana</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Ukupan prihod */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-lime-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Ukupan prihod</p>
            <div className="p-2 bg-lime-400/10 rounded-lg border border-lime-400/20 group-hover:bg-lime-400/20 transition">
              <DollarSign className="text-lime-400" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalRevenue.toFixed(2)} <span className="text-lime-400">KM</span></p>
        </div>

        {/* Ad Spend */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-blue-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Ad Spend</p>
            <div className="p-2 bg-blue-400/10 rounded-lg border border-blue-400/20 group-hover:bg-blue-400/20 transition">
              <TrendingUp className="text-blue-400" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalSpend.toFixed(2)} <span className="text-blue-400">KM</span></p>
        </div>

        {/* ROAS */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">ROAS</p>
            <div className="p-2 bg-purple-400/10 rounded-lg border border-purple-400/20 group-hover:bg-purple-400/20 transition">
              <Target className="text-purple-400" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{data.roas.toFixed(2)}<span className="text-purple-400">x</span></p>
          <p className="text-xs text-gray-400 mt-1">Return on Ad Spend</p>
        </div>

        {/* CPA */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-orange-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">CPA</p>
            <div className="p-2 bg-orange-400/10 rounded-lg border border-orange-400/20 group-hover:bg-orange-400/20 transition">
              <ShoppingCart className="text-orange-400" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{data.cpa.toFixed(2)} <span className="text-orange-400">KM</span></p>
          <p className="text-xs text-gray-400 mt-1">Cost per Acquisition</p>
        </div>

        {/* AOV */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-indigo-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">AOV</p>
            <div className="p-2 bg-indigo-400/10 rounded-lg border border-indigo-400/20 group-hover:bg-indigo-400/20 transition">
              <Percent className="text-indigo-400" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{data.aov.toFixed(2)} <span className="text-indigo-400">KM</span></p>
          <p className="text-xs text-gray-400 mt-1">Average Order Value</p>
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
