import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, FolderTree } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  })

  const totalProducts = categories.reduce((sum, cat) => sum + cat._count.products, 0)
  const visibleCategories = categories.filter(c => c.isVisible).length

  return (
    <div>
      <Breadcrumbs items={[{ label: "Kategorije" }]} />

      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/5 via-white/80 to-green-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Kategorije</h1>
              <p className="text-gray-600 mt-1">
                {categories.length} kategorija • {totalProducts} proizvoda • {visibleCategories} vidljivih
              </p>
            </div>
          </div>
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-md"
          >
            <Plus size={20} />
            Dodaj kategoriju
          </Link>
        </div>
      </div>

      {/* Grid view for categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(249,115,22,0.15)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <FolderTree className="text-orange-500" size={24} />
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  category.isVisible
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                {category.isVisible ? "Vidljiva" : "Skrivena"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-500 font-mono mb-4">{category.slug}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{category._count.products}</span>
                <span className="text-sm text-gray-500">proizvoda</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition border border-transparent hover:border-orange-200"
                >
                  <Edit size={18} />
                </Link>
                <DeleteCategoryButton
                  categoryId={category.id}
                  categoryName={category.name}
                  productCount={category._count.products}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl p-16 text-center backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderTree className="h-16 w-16 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nema kategorija</h2>
          <p className="text-gray-500 mb-8">Dodajte prvu kategoriju za organizaciju proizvoda</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-md"
          >
            <Plus size={20} />
            Dodaj kategoriju
          </Link>
        </div>
      )}
    </div>
  )
}
