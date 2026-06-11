import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(2, "Naziv mora imati najmanje 2 karaktera"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  shortDesc: z.string().optional(),
  sku: z.string().min(1, "SKU je obavezan"),
  price: z.number().positive("Cijena mora biti pozitivan broj"),
  comparePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, "Zaliha ne može biti negativna"),
  lowStockAlert: z.number().int().min(0, "Upozorenje ne može biti negativno").default(5),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().min(1, "Kategorija je obavezna"),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional().nullable(),
    sortOrder: z.number().int(),
  })).optional().default([]),
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = productSchema.parse(body)

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku: validatedData.sku },
    })

    if (existingSku) {
      return NextResponse.json(
        { error: "SKU već postoji u sistemu" },
        { status: 409 }
      )
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Kategorija ne postoji" },
        { status: 400 }
      )
    }

    // Generate unique slug
    let slug = generateSlug(validatedData.name)
    let slugExists = await prisma.product.findUnique({
      where: { slug },
    })

    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(validatedData.name)}-${counter}`
      slugExists = await prisma.product.findUnique({
        where: { slug },
      })
      counter++
    }

    // Create product with images
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        shortDesc: validatedData.shortDesc || null,
        sku: validatedData.sku,
        price: validatedData.price,
        comparePrice: validatedData.comparePrice || null,
        stock: validatedData.stock,
        lowStockAlert: validatedData.lowStockAlert,
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
        categoryId: validatedData.categoryId,
        metaTitle: validatedData.metaTitle || null,
        metaDesc: validatedData.metaDesc || null,
        images: {
          create: validatedData.images.map((img) => ({
            url: img.url,
            alt: img.alt || null,
            sortOrder: img.sortOrder,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Greška pri kreiranju proizvoda" },
      { status: 500 }
    )
  }
}
