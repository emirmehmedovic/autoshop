import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// PUT - Ažuriraj kategoriju
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const validatedData = categoryUpdateSchema.parse(body)

    // Check if name is being changed and if it already exists
    if (validatedData.name) {
      const existing = await prisma.leadCategory.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: "Kategorija sa ovim nazivom već postoji" },
          { status: 409 }
        )
      }
    }

    const category = await prisma.leadCategory.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating lead category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Greška pri ažuriranju kategorije" }, { status: 500 })
  }
}

// DELETE - Obriši kategoriju
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { id } = await params

    // Check if category has leads
    const category = await prisma.leadCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Kategorija nije pronađena" }, { status: 404 })
    }

    if (category._count.leads > 0) {
      return NextResponse.json(
        { error: `Ne možete obrisati kategoriju koja ima ${category._count.leads} leadova` },
        { status: 400 }
      )
    }

    await prisma.leadCategory.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lead category:", error)
    return NextResponse.json({ error: "Greška pri brisanju kategorije" }, { status: 500 })
  }
}
