import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { unlink } from "fs/promises"
import { join } from "path"

const productUpdateSchema = z.object({
  name: z.string().min(2, "Naziv mora imati najmanje 2 karaktera"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  shortDesc: z.string().optional().nullable(),
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
    .replace(/[\u0300-\u036f]/g, "")
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

async function deleteImageFile(url: string) {
  try {
    // Extract filename from URL (e.g., /images/products/filename.jpg)
    const filename = url.split("/").pop()
    if (filename) {
      const filePath = join(process.cwd(), "public", "images", "products", filename)
      await unlink(filePath)
    }
  } catch (error) {
    console.error("Error deleting image file:", error)
    // Don't throw - continue even if file deletion fails
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen" },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = productUpdateSchema.parse(body)

    // Check if SKU is taken by another product
    if (validatedData.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findFirst({
        where: {
          sku: validatedData.sku,
          id: { not: id },
        },
      })

      if (skuExists) {
        return NextResponse.json(
          { error: "SKU već postoji u sistemu" },
          { status: 409 }
        )
      }
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

    // Generate slug if name changed
    let slug = existingProduct.slug
    if (validatedData.name !== existingProduct.name) {
      slug = generateSlug(validatedData.name)
      let slugExists = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })

      let counter = 1
      while (slugExists) {
        slug = `${generateSlug(validatedData.name)}-${counter}`
        slugExists = await prisma.product.findFirst({
          where: {
            slug,
            id: { not: id },
          },
        })
        counter++
      }
    }

    // Find images to delete (old images not in new list)
    const oldImageUrls = existingProduct.images.map((img) => img.url)
    const newImageUrls = validatedData.images.map((img) => img.url)
    const imagesToDelete = oldImageUrls.filter((url) => !newImageUrls.includes(url))

    // Delete old image files from filesystem
    await Promise.all(imagesToDelete.map((url) => deleteImageFile(url)))

    // Update product
    const product = await prisma.product.update({
      where: { id },
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
          deleteMany: {},
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

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Greška pri ažuriranju proizvoda" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 }
      )
    }

    // Get product with images
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen" },
        { status: 404 }
      )
    }

    // Delete image files from filesystem
    await Promise.all(
      product.images.map((img) => deleteImageFile(img.url))
    )

    // Delete product (cascade will delete images from DB)
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Greška pri brisanju proizvoda" },
      { status: 500 }
    )
  }
}
