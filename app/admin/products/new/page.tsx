import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { ProductForm } from "@/components/admin/ProductForm"
import { Package } from "lucide-react"

export default async function NewProductPage() {
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
          { label: "Proizvodi", href: "/admin/products" },
          { label: "Novi proizvod" },
        ]}
      />

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Package size={40} />
              Dodaj novi proizvod
            </h1>
            <p className="text-gray-400 mt-1">
              Unesite informacije o novom proizvodu
            </p>
          </div>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
