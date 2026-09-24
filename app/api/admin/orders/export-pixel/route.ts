import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

// Helper to normalize phone number for Meta matching
function normalizePhone(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "")
  // Ensure country code (Bosnia +387)
  if (cleaned.startsWith("0")) {
    cleaned = "387" + cleaned.substring(1)
  } else if (!cleaned.startsWith("387")) {
    cleaned = "387" + cleaned
  }
  return cleaned
}

// Helper to hash data (Meta requires SHA256 for some fields)
// For CSV upload, Meta handles hashing, so we send plain text
function formatForMeta(value: string): string {
  return value.toLowerCase().trim()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const status = searchParams.get("status") as OrderStatus | null

  // Build where clause
  const where: any = {}

  if (from) {
    where.createdAt = { ...where.createdAt, gte: new Date(`${from}T00:00:00.000Z`) }
  }
  if (to) {
    where.createdAt = { ...where.createdAt, lte: new Date(`${to}T23:59:59.999Z`) }
  }
  if (status && Object.values(OrderStatus).includes(status)) {
    where.status = status
  }

  // Fetch orders
  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Meta Pixel CSV format
  // Required columns: event_name, event_time, value, currency
  // Match keys: phone, email, fn (first name), ln (last name), ct (city), st (state), country, zip
  const csvHeaders = [
    "event_name",
    "event_time",
    "value",
    "currency",
    "order_id",
    "content_ids",
    "content_type",
    "num_items",
    "phone",
    "fn",
    "ln",
    "ct",
    "zip",
    "country",
  ]

  const csvRows = orders.map((order) => {
    // Parse name into first/last
    const nameParts = (order.shippingName || "").trim().split(/\s+/)
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    // Content IDs (product IDs)
    const contentIds = order.items.map((item) => item.product?.slug || item.productId).join(",")
    const numItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

    // Unix timestamp
    const eventTime = Math.floor(new Date(order.createdAt).getTime() / 1000)

    return [
      "Purchase", // event_name
      eventTime, // event_time (Unix timestamp)
      order.total.toFixed(2), // value
      "BAM", // currency
      order.orderNumber, // order_id
      `"${contentIds}"`, // content_ids (quoted for CSV)
      "product", // content_type
      numItems, // num_items
      normalizePhone(order.shippingPhone || ""), // phone
      formatForMeta(firstName), // fn
      formatForMeta(lastName), // ln
      formatForMeta(order.shippingCity || ""), // ct
      order.shippingZip || "", // zip
      "ba", // country (Bosnia)
    ]
  })

  // Build CSV content
  const csvContent = [
    csvHeaders.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n")

  // Return as downloadable file
  const filename = `meta-pixel-orders-${new Date().toISOString().split("T")[0]}.csv`

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
