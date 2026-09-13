import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Product slugs for the two collections
const PRODUCT_SLUGS: Record<string, string> = {
  Signature: "signature-collection-miris-za-auto",
  Luxury: "luxury-collection-miris-za-auto",
}

const orderSchema = z.object({
  packSize: z.number().min(1).max(3),
  items: z.array(z.object({
    collection: z.enum(["Signature", "Luxury"]),
    scent: z.enum(["Million Miles", "Citrus", "Joyful Bloom"]),
    price: z.number(),
  })),
  subtotal: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  savings: z.number().optional(),
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    address: z.string().min(5),
    city: z.string().min(2),
    zip: z.string().optional(),
  }),
  source: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = orderSchema.parse(body)

    // Find products by their exact slugs
    const productIds: string[] = []

    for (const item of data.items) {
      const slug = PRODUCT_SLUGS[item.collection]

      const product = await prisma.product.findFirst({
        where: {
          slug,
          isActive: true,
        },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Proizvod "${item.collection} Collection" nije pronađen` },
          { status: 400 }
        )
      }

      productIds.push(product.id)
    }

    // Generate order number
    const orderCount = await prisma.order.count()
    const orderNumber = `GD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(5, "0")}`

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        guestName: data.customer.name,
        guestPhone: data.customer.phone,
        shippingName: data.customer.name,
        shippingPhone: data.customer.phone,
        shippingAddress: data.customer.address,
        shippingCity: data.customer.city,
        shippingZip: data.customer.zip || "",
        shippingNote: data.source ? `Landing page: ${data.source}` : undefined,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        discount: data.savings || 0,
        total: data.total,
        paymentMethod: "COD",
        items: {
          create: data.items.map((item, index) => ({
            productId: productIds[index],
            quantity: 1,
            unitPrice: item.price,
            total: item.price,
            selectedOptions: [
              { name: "Kolekcija", value: item.collection, price: 0 },
              { name: "Miris", value: item.scent, price: 0 },
            ],
          })),
        },
        statusHistory: {
          create: {
            status: "PENDING",
            note: `Narudžba kreirana sa landing stranice (${data.source || "mirisi-bundle"})`,
          },
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error("Landing order error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Nevažeći podaci", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Greška pri kreiranju narudžbe" },
      { status: 500 }
    )
  }
}
