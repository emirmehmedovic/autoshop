import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { unlink } from "fs/promises"
import { join } from "path"

const categoryUpdateSchema = z.object({
  name: z.string().min(2, "Naziv mora imati najmanje 2 karaktera"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
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
    if (url.startsWith("/images/categories/")) {
      const filename = url.split("/").pop()
      if (filename) {
        const filePath = join(process.cwd(), "public", "images", "categories", filename)
        await unlink(filePath)
      }
    }
  } catch (error) {
    console.error("Error deleting image file:", error)
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = categoryUpdateSchema.parse(body)

    // Validate parent category if provided
    if (validatedData.parentId) {
      // Cannot be parent of itself
      if (validatedData.parentId === id) {
        return NextResponse.json(
          { error: "Kategorija ne može biti roditelj sama sebi" },
          { status: 400 }
        )
      }

      const parentExists = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      })

      if (!parentExists) {
        return NextResponse.json(
          { error: "Roditelj kategorija ne postoji" },
          { status: 400 }
        )
      }
    }

    // Generate slug if name changed
    let slug = existingCategory.slug
    if (validatedData.name !== existingCategory.name) {
      slug = generateSlug(validatedData.name)
      let slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })

      let counter = 1
      while (slugExists) {
        slug = `${generateSlug(validatedData.name)}-${counter}`
        slugExists = await prisma.category.findFirst({
          where: {
            slug,
            id: { not: id },
          },
        })
        counter++
      }
    }

    // Delete old image if changed
    if (existingCategory.imageUrl && validatedData.imageUrl !== existingCategory.imageUrl) {
      await deleteImageFile(existingCategory.imageUrl)
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description || null,
        imageUrl: validatedData.imageUrl || null,
        parentId: validatedData.parentId || null,
        sortOrder: validatedData.sortOrder,
        isVisible: validatedData.isVisible,
      },
      include: {
        parent: true,
        _count: { select: { products: true } },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Greška pri ažuriranju kategorije" },
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

    // Get category
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 }
      )
    }

    // Check if category has products
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Kategorija ima ${category._count.products} proizvoda. Prvo ih premjestite u drugu kategoriju.` },
        { status: 400 }
      )
    }

    // Check if category has children
    if (category._count.children > 0) {
      return NextResponse.json(
        { error: `Kategorija ima ${category._count.children} podkategorija. Prvo ih obrišite ili premjestite.` },
        { status: 400 }
      )
    }

    // Delete image file if exists
    if (category.imageUrl) {
      await deleteImageFile(category.imageUrl)
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Greška pri brisanju kategorije" },
      { status: 500 }
    )
  }
}
