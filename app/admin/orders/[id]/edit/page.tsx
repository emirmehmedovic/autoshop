import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { OrderForm } from "@/components/admin/OrderForm"
import { notFound } from "next/navigation"
import { ShoppingCart } from "lucide-react"

export const dynamic = "force-dynamic"

type SelectedOption = { name: string; value: string; price: number }

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [order, products] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: {
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
            },
          },
        },
      },
    }),
    prisma.product.findMany({
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
    }),
  ])

  if (!order) {
    notFound()
  }

  const initialData = {
    id: order.id,
    orderNumber: order.orderNumber,
    shippingName: order.shippingName,
    guestEmail: order.guestEmail || order.user?.email || "",
    shippingPhone: order.shippingPhone,
    shippingAddress: order.shippingAddress,
    shippingCity: order.shippingCity,
    shippingZip: order.shippingZip || "",
    shippingNote: order.shippingNote || "",
    status: order.status,
    isPaid: order.isPaid,
    shippingCost: order.shippingCost,
    discount: order.discount,
    items: order.items.map((item) => {
      const selectedOptions = Array.isArray(item.selectedOptions)
        ? item.selectedOptions as SelectedOption[]
        : []
      const optionValueIds: Record<string, string> = {}
      const normalizedSelectedOptions: SelectedOption[] = []

      item.product.options.forEach((option) => {
        const selected = selectedOptions.find((entry) => entry.name === option.name)
        const matchingValue = option.values.find((value) => value.value === selected?.value)
        const fallbackValue = option.values.find((value) => value.isAvailable)
        const value = matchingValue || fallbackValue
        if (value) {
          optionValueIds[option.id] = value.id
          normalizedSelectedOptions.push({
            name: option.name,
            value: value.value,
            price: value.priceModifier,
          })
        }
      })

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        selectedOptions: normalizedSelectedOptions,
        optionValueIds,
      }
    }),
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Narudžbe", href: "/admin/orders" },
          { label: `#${order.orderNumber}`, href: `/admin/orders/${order.id}` },
          { label: "Uredi" },
        ]}
      />

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-orange-500 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingCart size={40} />
              Uredi narudžbu
            </h1>
            <p className="text-gray-600 mt-1">#{order.orderNumber}</p>
          </div>
        </div>
      </div>

      <OrderForm products={products} initialData={initialData} />
    </div>
  )
}
