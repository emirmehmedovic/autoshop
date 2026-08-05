import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { OrderStatus } from "@prisma/client"
import { notifyOrderStatusChange } from "@/lib/notifications/telegram"

const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] as const

const updateStatusSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  isPaid: z.boolean().optional(),
  note: z.string().optional(),
})

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
