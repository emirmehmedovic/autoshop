import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const noteSchema = z.object({
  content: z.string().min(1, "Bilješka ne može biti prazna"),
})

// POST - Dodaj bilješku leadu
export async function POST(
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
    const validatedData = noteSchema.parse(body)

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead nije pronađen" }, { status: 404 })
    }

    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        content: validatedData.content,
        authorId: session.user.id,
      },
    })

    // Update lastContactedAt
    await prisma.lead.update({
      where: { id },
      data: { lastContactedAt: new Date() },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Error creating note:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Greška pri dodavanju bilješke" }, { status: 500 })
  }
}
