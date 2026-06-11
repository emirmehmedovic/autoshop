import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { renderToStream } from "@react-pdf/renderer"
import { InvoiceDocument } from "@/lib/pdf/invoice"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 })
    }

    // Dohvati narudžbu
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            b2bProfile: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Narudžba nije pronađena" }, { status: 404 })
    }

    // Provjera pristupa (samo admin ili vlasnik narudžbe)
    const isAdmin = session.user.role === "ADMIN"
    const isOwner = order.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    // Generiši invoice number ako ne postoji
    if (!order.invoiceNumber) {
      const year = new Date(order.createdAt).getFullYear()
      const count = await prisma.order.count({
        where: {
          invoiceNumber: { not: null },
          createdAt: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1),
          },
        },
      })

      const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, "0")}`

      await prisma.order.update({
        where: { id },
        data: { invoiceNumber },
      })

      order.invoiceNumber = invoiceNumber
    }

    // Pripremi podatke za PDF
    const invoiceData = {
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      companyInfo: {
        name: "AutoShop d.o.o.",
        address: "Ulica Primjer bb, Sarajevo",
        pib: "123456789",
        phone: "+387 XX XXX XXX",
        email: "info@autoshop.ba",
      },
      customer: {
        name: order.shippingName,
        address: order.shippingAddress,
        city: order.shippingCity,
        zip: order.shippingZip || undefined,
        companyName: order.user?.b2bProfile?.companyName,
        pib: order.user?.b2bProfile?.pib || undefined,
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal: order.subtotal,
      shipping: order.shippingCost,
      discount: order.discount,
      total: order.total,
    }

    // Generiši PDF
    const stream = await renderToStream(<InvoiceDocument data={invoiceData} />)

    // Stream PDF kao response
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="faktura-${order.orderNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Greška pri generisanju fakture:", error)
    return NextResponse.json(
      { error: "Došlo je do greške pri generisanju fakture" },
      { status: 500 }
    )
  }
}
