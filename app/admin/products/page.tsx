import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Search, Edit, AlertCircle } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { DeleteProductButton } from "@/components/admin/DeleteProductButton"
import { CopyNameButton } from "@/components/admin/CopyNameButton"
import { ImageHoverPreview } from "@/components/admin/ImageHoverPreview"

export const dynamic = "force-dynamic"

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

  // Build stock filter conditions
  const stockFilter = (() => {
    switch (filter) {
      case "inStock":
        return { stock: { gt: 0 } }
      case "outOfStock":
        return { stock: { equals: 0 } }
      case "lowStock":
        return { stock: { gt: 0, lte: 10 } } // Niske zalihe (1-10)
      case "featured":
        return { isFeatured: true }
      default:
        return {}
    }
  })()

  const products = await prisma.product.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { categoryId: category }),
      ...stockFilter,
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

      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/5 via-white/80 to-pink-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Proizvodi</h1>
              <p className="text-gray-600 mt-1">{products.length} proizvoda u katalogu</p>
            </div>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-md"
          >
            <Plus size={20} />
            Dodaj proizvod
          </Link>
        </div>
      </div>

      {/* Filteri */}
      <form method="GET" className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Pretraga
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="search"
                placeholder="Naziv ili SKU..."
                defaultValue={search}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Kategorija */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Kategorija
            </label>
            <select
              name="category"
              defaultValue={category}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            >
              <option value="">Sve kategorije</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stanje zaliha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Stanje zaliha
            </label>
            <select
              name="filter"
              defaultValue={filter}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            >
              <option value="">Svi proizvodi</option>
              <option value="inStock">✓ Na stanju</option>
              <option value="outOfStock">✗ Nije na stanju</option>
              <option value="lowStock">⚠ Niske zalihe</option>
              <option value="featured">★ Istaknuti</option>
            </select>
          </div>

          {/* Dugme za filter */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-bold shadow-md"
            >
              Filtriraj
            </button>
          </div>
        </div>
      </form>

      {/* Tabela proizvoda */}
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Proizvod
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Kategorija
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Cijena
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Zaliha
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <ImageHoverPreview
                        src={product.images[0]?.url || "/placeholder-product.svg"}
                        alt={product.name}
                      />
                      <div className="min-w-0 max-w-[200px]">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                            {product.name}
                          </p>
                          <CopyNameButton name={product.name} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {product.price.toFixed(2)} <span className="text-orange-500">KM</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${
                          product.stock === 0
                            ? "bg-red-50 text-red-600 border-red-200"
                            : product.stock <= product.lowStockAlert
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : "bg-green-50 text-green-600 border-green-200"
                        }`}
                      >
                        {product.stock}
                      </span>
                      {product.stock <= product.lowStockAlert && product.stock > 0 && (
                        <AlertCircle size={16} className="text-orange-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${
                        product.isActive
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {product.isActive ? "Aktivan" : "Neaktivan"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition border border-transparent hover:border-orange-200"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nema proizvoda za prikaz</p>
          </div>
        )}
      </div>
    </div>
  )
}
