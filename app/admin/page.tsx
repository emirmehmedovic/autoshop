import { prisma } from "@/lib/prisma"
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin/AdminGuard"

async function getDashboardStats() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const last7Days = new Date(today)
  last7Days.setDate(last7Days.getDate() - 7)
  const last30Days = new Date(today)
  last30Days.setDate(last30Days.getDate() - 30)

  // Prihod statistika
  const [todayRevenue, last7DaysRevenue, last30DaysRevenue, totalRevenue] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: today },
        status: { notIn: ["CANCELLED", "RETURNED"] },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: last7Days },
        status: { notIn: ["CANCELLED", "RETURNED"] },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: last30Days },
        status: { notIn: ["CANCELLED", "RETURNED"] },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: { notIn: ["CANCELLED", "RETURNED"] } },
      _sum: { total: true },
    }),
  ])

  // Broj narudžbi
  const [totalOrders, pendingOrders, todayOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
  ])

  // Proizvodi
  const [totalProducts, lowStockProducts] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: prisma.product.fields.lowStockAlert },
      },
      include: {
        category: true,
      },
      orderBy: { stock: "asc" },
      take: 10,
    }),
  ])

  // Kupci
  const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } })

  // Top proizvodi (po prihodima)
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      total: true,
      quantity: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: 5,
  })

  const topProductsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      })
      return {
        ...item,
        product,
      }
    })
  )

  // Nedavne narudžbe
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  return {
    revenue: {
      today: todayRevenue._sum.total || 0,
      last7Days: last7DaysRevenue._sum.total || 0,
      last30Days: last30DaysRevenue._sum.total || 0,
      total: totalRevenue._sum.total || 0,
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      today: todayOrders,
    },
    products: {
      total: totalProducts,
      lowStock: lowStockProducts,
    },
    customers: {
      total: totalCustomers,
    },
    topProducts: topProductsWithDetails,
    recentOrders,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <>
      <AdminGuard />
      <div>
      <div className="mb-8 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        <div className="relative flex items-center space-x-3">
          <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Pregled poslovnih statistika u realnom vremenu</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Prihod - Danas */}
        <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(249,115,22,0.15)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Prihod danas</p>
              <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="text-white" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {stats.revenue.today.toFixed(2)} <span className="text-orange-500">KM</span>
            </p>
            <p className="text-xs text-gray-500">
              7 dana: <span className="text-gray-700 font-semibold">{stats.revenue.last7Days.toFixed(2)} KM</span>
            </p>
          </div>
        </div>

        {/* Narudžbe */}
        <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(59,130,246,0.15)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Narudžbe</p>
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="text-white" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.orders.pending}</p>
            <p className="text-xs text-gray-500">
              Na čekanju • <span className="text-gray-700 font-semibold">{stats.orders.today} danas</span>
            </p>
          </div>
        </div>

        {/* Proizvodi */}
        <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/5 via-white/80 to-pink-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(168,85,247,0.15)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Proizvodi</p>
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <Package className="text-white" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.products.total}</p>
            <p className="text-xs text-gray-500">
              <span className="text-orange-500 font-semibold">{stats.products.lowStock.length}</span> niska zaliha
            </p>
          </div>
        </div>

        {/* Kupci */}
        <div className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/5 via-white/80 to-green-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.15)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Kupci</p>
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.customers.total}</p>
            <p className="text-xs text-gray-500">Ukupno registrovanih</p>
          </div>
        </div>
      </div>

      {/* Niske zalihe upozorenje */}
      {stats.products.lowStock.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-6 mb-8 backdrop-blur-xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-amber-500/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(239,68,68,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg shadow-red-500/30">
              <AlertTriangle className="text-white flex-shrink-0" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Upozorenje: Niske zalihe ({stats.products.lowStock.length})
              </h3>
              <div className="space-y-2">
                {stats.products.lowStock.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-sm bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50"
                  >
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-semibold text-gray-900 hover:text-orange-500 transition"
                    >
                      {product.name}
                    </Link>
                    <span className="text-red-600 font-bold px-3 py-1 bg-red-50/80 rounded-lg border border-red-200/50">
                      {product.stock} kom
                    </span>
                  </div>
                ))}
              </div>
              {stats.products.lowStock.length > 5 && (
                <Link
                  href="/admin/products?filter=lowStock"
                  className="text-sm text-orange-500 hover:text-orange-600 font-bold mt-3 inline-block"
                >
                  Prikaži sve ({stats.products.lowStock.length}) →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top proizvodi */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/30">
                  <TrendingUp className="text-white" size={20} />
                </div>
                Top proizvodi
              </h2>
            </div>

            <div className="space-y-3">
              {stats.topProducts.map((item, index) => (
                <div key={item.productId} className="flex items-center gap-3 pb-3 border-b border-gray-200/50 last:border-b-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/products/${item.productId}`}
                      className="font-semibold text-gray-900 hover:text-orange-500 line-clamp-1 transition"
                    >
                      {item.product?.name || "N/A"}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {item._sum.quantity} prodato
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">
                      {item._sum.total?.toFixed(2)} <span className="text-orange-500 text-sm">KM</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nedavne narudžbe */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nedavne narudžbe</h2>
              <Link
                href="/admin/orders"
                className="text-sm text-orange-500 hover:text-orange-600 font-bold transition"
              >
                Prikaži sve →
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 hover:border-orange-300 hover:bg-orange-50/50 transition shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">
                      #{order.orderNumber}
                    </span>
                    <span className="text-lg font-bold text-orange-500">
                      {order.total.toFixed(2)} KM
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{order.shippingName}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString("bs-BA")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
