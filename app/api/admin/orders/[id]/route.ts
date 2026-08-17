import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { OrderStatus } from "@prisma/client"
import { notifyOrderStatusChange } from "@/lib/notifications/telegram"
import { SHIPPING_COST } from "@/lib/shipping"

const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] as const

const updateStatusSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  isPaid: z.boolean().optional(),
  note: z.string().optional(),
})

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Narudžba nije pronađena" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbe:", error)
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ error: "Narudžba nije pronađena" }, { status: 404 })
    }

    const updateData: {
      status?: OrderStatus
      isPaid?: boolean
      paidAt?: Date | null
    } = {}

    if (validatedData.status) {
      updateData.status = validatedData.status as OrderStatus
    }

    if (validatedData.isPaid !== undefined) {
      updateData.isPaid = validatedData.isPaid
      updateData.paidAt = validatedData.isPaid ? new Date() : null
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: updateData,
      })

      // Dodaj u historiju statusa ako se status mijenja
      if (validatedData.status) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: validatedData.status,
            note: validatedData.note || getStatusNote(validatedData.status),
          },
        })
      }

      // Dodaj u historiju ako se plaćanje bilježi
      if (validatedData.isPaid === true) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: order.status,
            note: "Narudžba označena kao plaćena (pouzećem)",
          },
        })
      }

      return updated
    })

    // Pošalji Telegram notifikaciju za promjenu statusa
    if (validatedData.status && validatedData.status !== order.status) {
      notifyOrderStatusChange(
        order.orderNumber,
        order.status,
        validatedData.status,
        order.shippingName
      ).catch(console.error)
    }

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Neispravni podaci", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Greška pri ažuriranju narudžbe:", error)
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const data = adminOrderSchema.parse(body)

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!existingOrder) {
      return NextResponse.json({ error: "Narudžba nije pronađena" }, { status: 404 })
    }

    const oldTotals = getProductTotals(existingOrder.items)
    const newTotals = getProductTotals(data.items)
    const productIds = Array.from(new Set([...Object.keys(oldTotals), ...Object.keys(newTotals)]))
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    for (const productId of productIds) {
      const product = products.find((entry) => entry.id === productId)
      if (!product) {
        return NextResponse.json({ error: "Proizvod nije pronađen" }, { status: 400 })
      }

      const availableStock = product.stock + (oldTotals[productId] || 0)
      if (availableStock < (newTotals[productId] || 0)) {
        return NextResponse.json({ error: `Nedovoljno zaliha za proizvod: ${product.name}` }, { status: 400 })
      }
    }

    const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const total = Math.max(0, subtotal + data.shippingCost - data.discount)
    const productMap = new Map(products.map((product) => [product.id, product]))

    const order = await prisma.$transaction(async (tx) => {
      for (const productId of productIds) {
        const delta = (newTotals[productId] || 0) - (oldTotals[productId] || 0)
        if (delta > 0) {
          await tx.product.update({
            where: { id: productId },
            data: { stock: { decrement: delta } },
          })
        } else if (delta < 0) {
          await tx.product.update({
            where: { id: productId },
            data: { stock: { increment: Math.abs(delta) } },
          })
        }
      }

      await tx.orderItem.deleteMany({ where: { orderId: id } })

      const updated = await tx.order.update({
        where: { id },
        data: {
          guestName: data.shippingName,
          guestEmail: data.guestEmail,
          guestPhone: data.shippingPhone,
          status: data.status,
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
          paidAt: data.isPaid ? existingOrder.paidAt || new Date() : null,
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
        },
      })

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: data.status,
          note: "Narudžba uređena u admin panelu",
        },
      })

      return updated
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Neispravni podaci", details: error.issues }, { status: 400 })
    }

    console.error("Greška pri uređivanju narudžbe:", error)
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 })
  }
}

function getStatusNote(status: string): string {
  const notes: Record<string, string> = {
    CONFIRMED: "Narudžba potvrđena",
    PROCESSING: "Narudžba u pripremi",
    SHIPPED: "Narudžba poslana",
    DELIVERED: "Narudžba dostavljena",
    CANCELLED: "Narudžba otkazana",
    RETURNED: "Narudžba vraćena",
  }
  return notes[status] || "Status ažuriran"
}
