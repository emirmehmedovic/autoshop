import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(2, "Naziv mora imati najmanje 2 karaktera"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Nevalidan format boje").default("#6366f1"),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET - Lista kategorija
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const categories = await prisma.leadCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching lead categories:", error)
    return NextResponse.json({ error: "Greška pri dohvaćanju kategorija" }, { status: 500 })
  }
}

// POST - Kreiraj kategoriju
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = categorySchema.parse(body)

    // Check if name already exists
    const existing = await prisma.leadCategory.findUnique({
      where: { name: validatedData.name },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Kategorija sa ovim nazivom već postoji" },
        { status: 409 }
      )
    }

    const category = await prisma.leadCategory.create({
      data: validatedData,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating lead category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Greška pri kreiranju kategorije" }, { status: 500 })
  }
}
