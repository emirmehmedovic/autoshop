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
      <div className="mb-8 backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Pregled poslovnih statistika u realnom vremenu</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Prihod - Danas */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-lime-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Prihod danas</p>
            <div className="p-2 bg-lime-400/10 rounded-lg border border-lime-400/20 group-hover:bg-lime-400/20 transition">
              <DollarSign className="text-lime-400" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {stats.revenue.today.toFixed(2)} <span className="text-lime-400">KM</span>
          </p>
          <p className="text-xs text-gray-400">
            7 dana: <span className="text-gray-300 font-semibold">{stats.revenue.last7Days.toFixed(2)} KM</span>
          </p>
        </div>

        {/* Narudžbe */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-blue-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Narudžbe</p>
            <div className="p-2 bg-blue-400/10 rounded-lg border border-blue-400/20 group-hover:bg-blue-400/20 transition">
              <ShoppingCart className="text-blue-400" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{stats.orders.pending}</p>
          <p className="text-xs text-gray-400">
            Na čekanju • <span className="text-gray-300 font-semibold">{stats.orders.today} danas</span>
          </p>
        </div>

        {/* Proizvodi */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Proizvodi</p>
            <div className="p-2 bg-purple-400/10 rounded-lg border border-purple-400/20 group-hover:bg-purple-400/20 transition">
              <Package className="text-purple-400" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{stats.products.total}</p>
          <p className="text-xs text-gray-400">
            <span className="text-orange-400 font-semibold">{stats.products.lowStock.length}</span> niska zaliha
          </p>
        </div>

        {/* Kupci */}
        <div className="group backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-orange-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Kupci</p>
            <div className="p-2 bg-orange-400/10 rounded-lg border border-orange-400/20 group-hover:bg-orange-400/20 transition">
              <Users className="text-orange-400" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{stats.customers.total}</p>
          <p className="text-xs text-gray-400">Ukupno registrovanih</p>
        </div>
      </div>

      {/* Niske zalihe upozorenje */}
      {stats.products.lowStock.length > 0 && (
        <div className="backdrop-blur-md bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-400/20 rounded-xl border border-orange-400/30">
              <AlertTriangle className="text-orange-400 flex-shrink-0" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-3 text-lg">
                Upozorenje: Niske zalihe ({stats.products.lowStock.length})
              </h3>
              <div className="space-y-2">
                {stats.products.lowStock.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-sm backdrop-blur-sm bg-slate-800/40 rounded-xl p-3 border border-white/10"
                  >
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-semibold text-white hover:text-lime-400 transition"
                    >
                      {product.name}
                    </Link>
                    <span className="text-orange-400 font-bold px-3 py-1 bg-orange-400/10 rounded-lg border border-orange-400/20">
                      {product.stock} kom
                    </span>
                  </div>
                ))}
              </div>
              {stats.products.lowStock.length > 5 && (
                <Link
                  href="/admin/products?filter=lowStock"
                  className="text-sm text-orange-400 hover:text-orange-300 font-bold mt-3 inline-block"
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
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-lime-400/10 rounded-lg border border-lime-400/20">
                <TrendingUp className="text-lime-400" size={20} />
              </div>
              Top proizvodi
            </h2>
          </div>

          <div className="space-y-3">
            {stats.topProducts.map((item, index) => (
              <div key={item.productId} className="flex items-center gap-3 pb-3 border-b border-white/10 last:border-b-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-lime-400">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/products/${item.productId}`}
                    className="font-semibold text-white hover:text-lime-400 line-clamp-1 transition"
                  >
                    {item.product?.name || "N/A"}
                  </Link>
                  <p className="text-sm text-gray-400">
                    {item._sum.quantity} prodato
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white">
                    {item._sum.total?.toFixed(2)} <span className="text-lime-400 text-sm">KM</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nedavne narudžbe */}
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Nedavne narudžbe</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-lime-400 hover:text-lime-300 font-bold transition"
            >
              Prikaži sve →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-4 rounded-xl border border-white/10 hover:border-lime-400/30 hover:bg-white/5 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">
                    #{order.orderNumber}
                  </span>
                  <span className="text-lg font-bold text-lime-400">
                    {order.total.toFixed(2)} KM
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{order.shippingName}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString("bs-BA")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
