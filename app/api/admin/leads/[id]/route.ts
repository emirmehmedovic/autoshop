import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const leadUpdateSchema = z.object({
  companyName: z.string().min(2).optional(),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  facebookUrl: z.string().url().optional().nullable().or(z.literal("")),
  googleMapsUrl: z.string().url().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
  status: z.enum(["NEW", "CONTACTED", "INTERESTED", "NEGOTIATING", "WON", "LOST", "ON_HOLD"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  estimatedValue: z.number().optional().nullable(),
  lastContactedAt: z.string().optional().nullable(),
  nextFollowUpAt: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
})

// GET - Dohvati pojedinačnog leada
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { id } = await params

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        category: true,
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead nije pronađen" }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json({ error: "Greška pri dohvaćanju leada" }, { status: 500 })
  }
}

// PUT - Ažuriraj leada
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
    const validatedData = leadUpdateSchema.parse(body)

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...validatedData,
        email: validatedData.email || null,
        website: validatedData.website || null,
        facebookUrl: validatedData.facebookUrl || null,
        googleMapsUrl: validatedData.googleMapsUrl || null,
        categoryId: validatedData.categoryId === "" ? null : validatedData.categoryId,
        lastContactedAt: validatedData.lastContactedAt ? new Date(validatedData.lastContactedAt) : undefined,
        nextFollowUpAt: validatedData.nextFollowUpAt ? new Date(validatedData.nextFollowUpAt) : null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error updating lead:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Greška pri ažuriranju leada" }, { status: 500 })
  }
}

// DELETE - Obriši leada
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

    await prisma.lead.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json({ error: "Greška pri brisanju leada" }, { status: 500 })
  }
}
