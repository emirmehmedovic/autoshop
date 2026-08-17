import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { SHIPPING_COST } from "@/lib/shipping"

const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] as const

const selectedOptionSchema = z.object({
  name: z.string(),
  value: z.string(),
  price: z.number(),
})

const adminOrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().min(0),
  selectedOptions: z.array(selectedOptionSchema).optional().default([]),
})

const adminOrderSchema = z.object({
  shippingName: z.string().min(2),
  guestEmail: z.string().email(),
  shippingPhone: z.string().min(6),
  shippingAddress: z.string().min(3),
  shippingCity: z.string().min(2),
  shippingZip: z.string().optional(),
  shippingNote: z.string().optional(),
  status: z.enum(orderStatuses).default("PENDING"),
  isPaid: z.boolean().default(false),
  shippingCost: z.number().min(0).default(SHIPPING_COST),
  discount: z.number().min(0).default(0),
  items: z.array(adminOrderItemSchema).min(1),
})

function getProductTotals(items: { productId: string; quantity: number }[]) {
  return items.reduce<Record<string, number>>((totals, item) => {
    totals[item.productId] = (totals[item.productId] || 0) + item.quantity
    return totals
  }, {})
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const body = await request.json()
    const data = adminOrderSchema.parse(body)
    const productTotals = getProductTotals(data.items)
    const products = await prisma.product.findMany({
      where: { id: { in: Object.keys(productTotals) } },
    })

    for (const [productId, quantity] of Object.entries(productTotals)) {
      const product = products.find((entry) => entry.id === productId)
      if (!product) {
        return NextResponse.json({ error: "Proizvod nije pronađen" }, { status: 400 })
      }
      if (product.stock < quantity) {
        return NextResponse.json({ error: `Nedovoljno zaliha za proizvod: ${product.name}` }, { status: 400 })
      }
    }

    const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const total = Math.max(0, subtotal + data.shippingCost - data.discount)
    const productMap = new Map(products.map((product) => [product.id, product]))
    const orderCount = await prisma.order.count()
    const orderNumber = `AK-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, "0")}`

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: null,
          guestName: data.shippingName,
          guestEmail: data.guestEmail,
          guestPhone: data.shippingPhone,
          status: data.status,
          paymentMethod: "COD",
          shippingName: data.shippingName,
          shippingPhone: data.shippingPhone,
          shippingAddress: data.shippingAddress,
          shippingCity: data.shippingCity,
          shippingZip: data.shippingZip || null,
          shippingNote: data.shippingNote || null,
          subtotal,
          shippingCost: data.shippingCost,
          discount: data.discount,
          total,
          isPaid: data.isPaid,
          paidAt: data.isPaid ? new Date() : null,
          isB2B: false,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              purchasePrice: productMap.get(item.productId)?.purchasePrice || 0,
              total: item.unitPrice * item.quantity,
              selectedOptions: item.selectedOptions.length ? item.selectedOptions : undefined,
            })),
          },
          statusHistory: {
            create: {
              status: data.status,
              note: "Narudžba ručno kreirana u admin panelu",
            },
          },
        },
      })

      for (const [productId, quantity] of Object.entries(productTotals)) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        })
      }

      return created
    })

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Neispravni podaci", details: error.issues }, { status: 400 })
    }

    console.error("Greška pri ručnom kreiranju narudžbe:", error)
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 })
  }
}
