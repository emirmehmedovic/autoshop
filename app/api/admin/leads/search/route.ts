import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface GooglePlace {
  place_id: string
  name: string
  formatted_address?: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  types?: string[]
  business_status?: string
  url?: string // Google Maps URL
}

// POST - Pretraži Google Places
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google Places API ključ nije konfigurisan" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { query, location, radius = 50000 } = body // radius in meters, default 50km

    if (!query) {
      return NextResponse.json({ error: "Upit je obavezan" }, { status: 400 })
    }

    // Default location: Tuzla, BiH
    const lat = location?.lat || 44.5384
    const lng = location?.lng || 18.6763

    // Search using Google Places Text Search API
    const searchUrl = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json")
    searchUrl.searchParams.set("query", query)
    searchUrl.searchParams.set("location", `${lat},${lng}`)
    searchUrl.searchParams.set("radius", radius.toString())
    searchUrl.searchParams.set("key", GOOGLE_API_KEY)
    searchUrl.searchParams.set("language", "bs") // Bosnian language

    const searchResponse = await fetch(searchUrl.toString())
    const searchData = await searchResponse.json()

    if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", searchData)
      return NextResponse.json(
        { error: `Google API greška: ${searchData.status}` },
        { status: 500 }
      )
    }

    const places: GooglePlace[] = searchData.results || []

    // Get existing leads to check for duplicates
    const existingPlaceIds = await prisma.lead.findMany({
      where: {
        googlePlaceId: {
          in: places.map((p) => p.place_id),
        },
      },
      select: { googlePlaceId: true },
    })

    const existingIds = new Set(existingPlaceIds.map((l) => l.googlePlaceId))

    // Get place details for each result
    const detailedPlaces = await Promise.all(
      places.slice(0, 20).map(async (place) => {
        try {
          const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json")
          detailsUrl.searchParams.set("place_id", place.place_id)
          detailsUrl.searchParams.set("fields", "name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,url,types,business_status")
          detailsUrl.searchParams.set("key", GOOGLE_API_KEY)
          detailsUrl.searchParams.set("language", "bs")

          const detailsResponse = await fetch(detailsUrl.toString())
          const detailsData = await detailsResponse.json()

          if (detailsData.status === "OK") {
            return {
              ...place,
              ...detailsData.result,
              isExisting: existingIds.has(place.place_id),
            }
          }

          return {
            ...place,
            isExisting: existingIds.has(place.place_id),
          }
        } catch (error) {
          console.error("Error fetching place details:", error)
          return {
            ...place,
            isExisting: existingIds.has(place.place_id),
          }
        }
      })
    )

    // Transform to lead format
    const leads = detailedPlaces.map((place) => ({
      googlePlaceId: place.place_id,
      companyName: place.name,
      address: place.formatted_address || null,
      city: extractCity(place.formatted_address),
      phone: place.formatted_phone_number || null,
      website: place.website || null,
      googleMapsUrl: place.url || null,
      googleRating: place.rating || null,
      googleReviews: place.user_ratings_total || null,
      businessType: determineBusinessType(place.types),
      isExisting: place.isExisting,
    }))

    return NextResponse.json({
      leads,
      total: leads.length,
      nextPageToken: searchData.next_page_token || null,
    })
  } catch (error) {
    console.error("Error searching places:", error)
    return NextResponse.json({ error: "Greška pri pretrazi" }, { status: 500 })
  }
}

function extractCity(address: string | undefined): string | null {
  if (!address) return null

  // Try to extract city from address
  // Typical format: "Ulica broj, Grad, Država"
  const parts = address.split(",").map((p) => p.trim())

  // For BiH addresses, city is usually the second-to-last part
  if (parts.length >= 2) {
    // Remove postal code if present
    const potentialCity = parts[parts.length - 2].replace(/\d{5}/, "").trim()
    return potentialCity || null
  }

  return null
}

function determineBusinessType(types: string[] | undefined): string {
  if (!types) return "Ostalo"

  if (types.includes("car_wash")) return "Autopraonica"
  if (types.includes("car_repair")) return "Autoservis"
  if (types.includes("car_dealer")) return "Auto salon"
  if (types.includes("gas_station")) return "Benzinska pumpa"

  return "Detailing / Pranje"
}
