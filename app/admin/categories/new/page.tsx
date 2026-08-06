import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { CategoryForm } from "@/components/admin/CategoryForm"
import { FolderTree } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  })

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Kategorije", href: "/admin/categories" },
          { label: "Nova kategorija" },
        ]}
      />

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-orange-500 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FolderTree size={40} />
              Dodaj novu kategoriju
            </h1>
            <p className="text-gray-600 mt-1">
              Kreirajte novu kategoriju proizvoda
            </p>
          </div>
        </div>
      </div>

      <CategoryForm categories={categories} />
    </div>
  )
}
