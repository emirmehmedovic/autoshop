import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { ProductForm } from "@/components/admin/ProductForm"
import { Package } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
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

  if (!product) {
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

  // Transform product data for the form
  const initialData = {
    name: product.name,
    description: product.description,
    shortDesc: product.shortDesc || "",
    sku: product.sku,
    price: product.price,
    purchasePrice: product.purchasePrice,
    comparePrice: product.comparePrice,
    stock: product.stock,
    lowStockAlert: product.lowStockAlert,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    metaTitle: product.metaTitle || "",
    metaDesc: product.metaDesc || "",
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt || "",
      sortOrder: img.sortOrder,
    })),
    options: product.options.map((option) => ({
      id: option.id,
      name: option.name,
      isRequired: option.isRequired,
      sortOrder: option.sortOrder,
      values: option.values.map((value) => ({
        id: value.id,
        value: value.value,
        priceModifier: value.priceModifier,
        isDefault: value.isDefault,
        isAvailable: value.isAvailable,
        sortOrder: value.sortOrder,
      })),
    })),
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Proizvodi", href: "/admin/products" },
          { label: product.name },
        ]}
      />

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-orange-500 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Package size={40} />
              Uredi proizvod
            </h1>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
        </div>
      </div>

      <ProductForm
        categories={categories}
        initialData={initialData}
        productId={product.id}
      />
    </div>
  )
}
