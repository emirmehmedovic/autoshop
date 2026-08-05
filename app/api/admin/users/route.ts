import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const createUserSchema = z.object({
  email: z.string().email("Nevalidan email"),
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
})

// GET - Lista admin korisnika
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 })
    }

    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(admins)
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json({ error: "Greška pri dohvatanju korisnika" }, { status: 500 })
  }
}

// POST - Kreiraj novog admin korisnika
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 })
    }

    const body = await request.json()
    const result = createUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Nevalidni podaci", details: result.error.issues },
        { status: 400 }
      )
    }

    const { email, name, password } = result.data

    // Provjeri da li email već postoji
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Korisnik sa ovim emailom već postoji" },
        { status: 400 }
      )
    }

    // Hash lozinke
    const passwordHash = await bcrypt.hash(password, 12)

    // Kreiraj korisnika
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "ADMIN",
        customerType: "B2C",
        isApproved: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ error: "Greška pri kreiranju korisnika" }, { status: 500 })
  }
}

// DELETE - Obriši admin korisnika
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "ID korisnika je obavezan" }, { status: 400 })
    }

    // Ne dozvoli brisanje samog sebe
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Ne možete obrisati vlastiti nalog" },
        { status: 400 }
      )
    }

    // Provjeri da li korisnik postoji i da li je admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Korisnik nije pronađen" }, { status: 404 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Ovaj korisnik nije administrator" },
        { status: 400 }
      )
    }

    // Obriši korisnika
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json({ error: "Greška pri brisanju korisnika" }, { status: 500 })
  }
}
