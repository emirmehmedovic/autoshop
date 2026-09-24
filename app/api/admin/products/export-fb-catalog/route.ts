import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const SITE_URL = "https://autokozmetika.ba"
const BRAND_NAME = "GlossDrive"

export async function GET() {
  // Fetch all active products with images
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      category: true,
    },
    orderBy: { name: "asc" },
  })

  // CSV header row (Facebook catalog format)
  const headers = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "google_product_category",
    "fb_product_category",
    "quantity_to_sell_on_facebook",
    "sale_price",
  ]

  // Build CSV rows
  const rows = products.map((product) => {
    // Use slug as ID (matches Pixel tracking)
    const id = product.slug

    // Clean description - remove HTML and limit length
    const description = (product.shortDesc || product.description || "")
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .slice(0, 5000) // FB limit

    // Availability based on stock
    const availability = product.stock > 0 ? "in stock" : "out of stock"

    // Price format: "25.00 BAM"
    const price = `${product.price.toFixed(2)} BAM`

    // Sale price if comparePrice exists and is higher
    const salePrice = product.comparePrice && product.comparePrice > product.price
      ? `${product.price.toFixed(2)} BAM`
      : ""

    // Regular price (use comparePrice if on sale, otherwise regular price)
    const regularPrice = product.comparePrice && product.comparePrice > product.price
      ? `${product.comparePrice.toFixed(2)} BAM`
      : price

    // Product URL
    const link = `${SITE_URL}/product/${product.slug}`

    // Image URL - use first image or placeholder
    const imageUrl = product.images[0]?.url || "/placeholder-product.svg"
    const imageLink = imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`

    // Quantity
    const quantity = product.stock > 0 ? product.stock : 0

    return [
      escapeCSV(id),
      escapeCSV(product.name),
      escapeCSV(description),
      availability,
      "new",
      salePrice ? regularPrice : price, // If on sale, show original as price
      link,
      imageLink,
      BRAND_NAME,
      "Vehicles & Parts > Vehicle Parts & Accessories", // Google category for auto products
      "Vehicles & Parts", // FB category
      quantity.toString(),
      salePrice, // Sale price if applicable
    ]
  })

  // Build CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n")

  // Add BOM for Excel UTF-8 compatibility
  const bom = "\uFEFF"
  const csvWithBom = bom + csvContent

  // Return as downloadable file
  const filename = `fb-catalog-${new Date().toISOString().split("T")[0]}.csv`

  return new NextResponse(csvWithBom, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

// Helper to escape CSV values
function escapeCSV(value: string): string {
  if (!value) return ""
  // If value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
