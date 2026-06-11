import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { CategoryForm } from "@/components/admin/CategoryForm"
import { FolderTree } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  })

  // Transform data for form
  const initialData = {
    name: category.name,
    description: category.description || "",
    imageUrl: category.imageUrl || "",
    parentId: category.parentId || "",
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Kategorije", href: "/admin/categories" },
          { label: category.name },
        ]}
      />

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <FolderTree size={40} />
              Uredi kategoriju
            </h1>
            <p className="text-gray-400 mt-1">{category.name}</p>
          </div>
        </div>
      </div>

      <CategoryForm
        categories={categories}
        initialData={initialData}
        categoryId={category.id}
      />
    </div>
  )
}
