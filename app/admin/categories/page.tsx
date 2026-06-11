import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, FolderTree } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton"

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

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-lime-400 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-white">Kategorije</h1>
              <p className="text-gray-400 mt-1">
                {categories.length} kategorija • {totalProducts} proizvoda • {visibleCategories} vidljivih
              </p>
            </div>
          </div>
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
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
            className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-lime-400/30 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20">
                <FolderTree className="text-lime-400" size={24} />
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  category.isVisible
                    ? "bg-lime-500/10 text-lime-400 border-lime-500/20"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                }`}
              >
                {category.isVisible ? "Vidljiva" : "Skrivena"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
            <p className="text-sm text-gray-400 font-mono mb-4">{category.slug}</p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{category._count.products}</span>
                <span className="text-sm text-gray-400">proizvoda</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="p-2 text-lime-400 hover:bg-lime-400/10 rounded-lg transition border border-transparent hover:border-lime-400/20"
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
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
          <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderTree className="h-16 w-16 text-lime-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Nema kategorija</h2>
          <p className="text-gray-400 mb-8">Dodajte prvu kategoriju za organizaciju proizvoda</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
          >
            <Plus size={20} />
            Dodaj kategoriju
          </Link>
        </div>
      )}
    </div>
  )
}
