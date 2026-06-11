import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"

interface SearchParams {
  search?: string
  category?: string
  filter?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { search, category, filter } = params

  const products = await prisma.product.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { categoryId: category }),
      ...(filter === "lowStock" && {
        stock: { lte: prisma.product.fields.lowStockAlert },
      }),
    },
    include: {
      category: true,
      images: {
        take: 1,
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: "Proizvodi" }]} />

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-lime-400 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-white">Proizvodi</h1>
              <p className="text-gray-400 mt-1">{products.length} proizvoda u katalogu</p>
            </div>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
          >
            <Plus size={20} />
            Dodaj proizvod
          </Link>
        </div>
      </div>

      {/* Filteri */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Pretraga
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Naziv ili SKU..."
                defaultValue={search}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Kategorija */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Kategorija
            </label>
            <select
              defaultValue={category}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
            >
              <option value="">Sve kategorije</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Filter
            </label>
            <select
              defaultValue={filter}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
            >
              <option value="">Svi proizvodi</option>
              <option value="lowStock">Niske zalihe</option>
              <option value="outOfStock">Rasprodato</option>
              <option value="featured">Istaknuti</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela proizvoda */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Proizvod
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Kategorija
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Cijena
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Zaliha
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-slate-700/30 rounded-xl border border-white/10 flex-shrink-0 overflow-hidden">
                        <Image
                          src={product.images[0]?.url || "/placeholder-product.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white line-clamp-1">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                    {product.price.toFixed(2)} <span className="text-lime-400">KM</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                          product.stock === 0
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : product.stock <= product.lowStockAlert
                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            : "bg-lime-500/10 text-lime-400 border border-lime-500/20"
                        }`}
                      >
                        {product.stock}
                      </span>
                      {product.stock <= product.lowStockAlert && product.stock > 0 && (
                        <AlertCircle size={16} className="text-orange-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                        product.isActive
                          ? "bg-lime-500/10 text-lime-400 border border-lime-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}
                    >
                      {product.isActive ? "Aktivan" : "Neaktivan"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
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

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nema proizvoda za prikaz</p>
          </div>
        )}
      </div>
    </div>
  )
}
