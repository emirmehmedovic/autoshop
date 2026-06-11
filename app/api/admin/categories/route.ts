import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categorySchema = z.object({
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
    const validatedData = categorySchema.parse(body)

    // Validate parent category if provided
    if (validatedData.parentId) {
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

    // Generate unique slug
    let slug = generateSlug(validatedData.name)
    let slugExists = await prisma.category.findUnique({
      where: { slug },
    })

    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(validatedData.name)}-${counter}`
      slugExists = await prisma.category.findUnique({
        where: { slug },
      })
      counter++
    }

    // Create category
    const category = await prisma.category.create({
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

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Greška pri kreiranju kategorije" },
      { status: 500 }
    )
  }
}
