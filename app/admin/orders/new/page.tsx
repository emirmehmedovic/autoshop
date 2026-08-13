import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { OrderForm } from "@/components/admin/OrderForm"
import { ShoppingCart } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewOrderPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      options: {
        orderBy: { sortOrder: "asc" },
        include: {
          values: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: "Narudžbe", href: "/admin/orders" }, { label: "Nova narudžba" }]} />

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-orange-500 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingCart size={40} />
              Ručni unos narudžbe
            </h1>
            <p className="text-gray-600 mt-1">Kreirajte narudžbu iz admin panela</p>
          </div>
        </div>
      </div>

      <OrderForm products={products} />
    </div>
  )
}
