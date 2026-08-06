import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const leadSchema = z.object({
  companyName: z.string().min(2, "Naziv firme je obavezan"),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  facebookUrl: z.string().url().optional().nullable().or(z.literal("")),
  googleMapsUrl: z.string().url().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
  source: z.enum(["MANUAL", "GOOGLE_PLACES", "FACEBOOK", "REFERRAL", "WEBSITE", "OTHER"]).default("MANUAL"),
  status: z.enum(["NEW", "CONTACTED", "INTERESTED", "NEGOTIATING", "WON", "LOST", "ON_HOLD"]).default("NEW"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  estimatedValue: z.number().optional().nullable(),
  nextFollowUpAt: z.string().optional().nullable(),
  googlePlaceId: z.string().optional().nullable(),
  googleRating: z.number().optional().nullable(),
  googleReviews: z.number().optional().nullable(),
})

// GET - Lista leadova
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")
    const city = searchParams.get("city")

    const where: Record<string, unknown> = {}

    if (status && status !== "all") {
      where.status = status
    }

    if (priority && priority !== "all") {
      where.priority = priority
    }

    if (city && city !== "all") {
      where.city = city
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { notes: true },
        },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    })

    // Get unique cities for filter
    const cities = await prisma.lead.findMany({
      where: { city: { not: null } },
      select: { city: true },
      distinct: ["city"],
    })

    return NextResponse.json({
      leads,
      cities: cities.map((c) => c.city).filter(Boolean),
    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Greška pri dohvaćanju leadova" }, { status: 500 })
  }
}

// POST - Kreiraj novog leada
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = leadSchema.parse(body)

    // Check if lead with same googlePlaceId already exists
    if (validatedData.googlePlaceId) {
      const existing = await prisma.lead.findUnique({
        where: { googlePlaceId: validatedData.googlePlaceId },
      })
      if (existing) {
        return NextResponse.json(
          { error: "Ovaj lead već postoji u sistemu" },
          { status: 409 }
        )
      }
    }

    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        email: validatedData.email || null,
        website: validatedData.website || null,
        facebookUrl: validatedData.facebookUrl || null,
        googleMapsUrl: validatedData.googleMapsUrl || null,
        nextFollowUpAt: validatedData.nextFollowUpAt ? new Date(validatedData.nextFollowUpAt) : null,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validacija nije uspjela", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Greška pri kreiranju leada" }, { status: 500 })
  }
}
