import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().min(6),
  customerType: z.enum(["B2C", "B2B"]),
  // B2B polja (opciona osim ako je B2B)
  companyName: z.string().optional(),
  pib: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Provjera da li korisnik već postoji
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Korisnik sa ovim emailom već postoji" },
        { status: 400 }
      )
    }

    // Validacija B2B polja
    if (validatedData.customerType === "B2B") {
      if (
        !validatedData.companyName ||
        !validatedData.address ||
        !validatedData.contactPerson
      ) {
        return NextResponse.json(
          { error: "Sva B2B polja su obavezna" },
          { status: 400 }
        )
      }
    }

    // Hash lozinke
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Kreiranje korisnika i B2B profila (ako je potrebno)
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        passwordHash,
        role: "CUSTOMER",
        customerType: validatedData.customerType,
        isApproved: validatedData.customerType === "B2C", // B2C odmah odobren, B2B čeka
        ...(validatedData.customerType === "B2B" && {
          b2bProfile: {
            create: {
              companyName: validatedData.companyName!,
              pib: validatedData.pib || null,
              address: validatedData.address!,
              contactPerson: validatedData.contactPerson!,
            },
          },
        }),
      },
      include: {
        b2bProfile: true,
      },
    })

    // TODO: Poslati email notifikaciju adminu za B2B registraciju
    // TODO: Poslati Telegram notifikaciju za B2B registraciju

    return NextResponse.json(
      {
        success: true,
        message:
          validatedData.customerType === "B2B"
            ? "B2B nalog kreiran. Čeka odobrenje administratora."
            : "Nalog uspješno kreiran. Možete se prijaviti.",
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Neispravni podaci", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Greška pri registraciji:", error)
    return NextResponse.json(
      { error: "Došlo je do greške pri registraciji" },
      { status: 500 }
    )
  }
}
