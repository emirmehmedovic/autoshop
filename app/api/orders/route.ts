import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { sendOrderConfirmationToCustomer, sendNewOrderToAdmin } from "@/lib/notifications/email"
import { notifyNewOrder } from "@/lib/notifications/telegram"

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
})

const shippingInfoSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(5),
  city: z.string().min(2),
  zip: z.string().optional(),
  note: z.string().optional(),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingInfo: shippingInfoSchema,
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()

    // Validacija
    const validatedData = createOrderSchema.parse(body)
    const { items, shippingInfo } = validatedData

    // Provjera proizvoda i zaliha
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Neki proizvodi nisu pronađeni ili nisu dostupni" },
        { status: 400 }
      )
    }

    // Provjera zaliha
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Proizvod sa ID ${item.productId} nije pronađen` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Nedovoljno zaliha za proizvod: ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Kalkulacija totala
    let subtotal = 0
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!
      const total = item.unitPrice * item.quantity
      subtotal += total

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total,
      }
    })

    const shippingCost = 0 // Besplatna dostava
    const total = subtotal + shippingCost

    // Generisanje order numbera
    const orderCount = await prisma.order.count()
    const orderNumber = `AK-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, "0")}`

    // Kreiranje narudžbe sa transakcijom
    const order = await prisma.$transaction(async (tx) => {
      // Kreiraj narudžbu
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || null,
          guestName: !session ? shippingInfo.name : null,
          guestEmail: !session ? shippingInfo.email : null,
          guestPhone: !session ? shippingInfo.phone : null,
          status: "PENDING",
          paymentMethod: "COD",
          shippingName: shippingInfo.name,
          shippingPhone: shippingInfo.phone,
          shippingAddress: shippingInfo.address,
          shippingCity: shippingInfo.city,
          shippingZip: shippingInfo.zip || null,
          shippingNote: shippingInfo.note || null,
          subtotal,
          shippingCost,
          discount: 0,
          total,
          isB2B: session?.user?.customerType === "B2B",
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: "Narudžba kreirana",
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      })

      // Ažuriraj zalihe
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return newOrder
    })

    // Slanje notifikacija (ne čekamo ih, nek se šalju asinhrono)
    Promise.all([
      sendOrderConfirmationToCustomer(order).catch(console.error),
      sendNewOrderToAdmin(order).catch(console.error),
      notifyNewOrder(order).catch(console.error),
    ])

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Neispravni podaci", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Greška pri kreiranju narudžbe:", error)
    return NextResponse.json(
      { error: "Došlo je do greške pri procesiranju narudžbe" },
      { status: 500 }
    )
  }
}

// GET endpoint za dohvaćanje narudžbi (za korisnika ili admina)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 })
    }

    const isAdmin = session.user.role === "ADMIN"

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  take: 1,
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbi:", error)
    return NextResponse.json(
      { error: "Došlo je do greške pri dohvaćanju narudžbi" },
      { status: 500 }
    )
  }
}
