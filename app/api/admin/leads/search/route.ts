import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

interface ScrapedLead {
  googlePlaceId: string
  companyName: string
  address: string | null
  city: string | null
  phone: string | null
  website: string | null
  googleMapsUrl: string | null
  googleRating: number | null
  googleReviews: number | null
  businessType: string
}

interface ScraperOutput {
  leads: ScrapedLead[]
  total: number
  error?: string
}

// POST - Pretraži Google Maps (besplatno putem scrapera)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const body = await req.json()
    const { query, limit = 20 } = body

    if (!query) {
      return NextResponse.json({ error: "Upit je obavezan" }, { status: 400 })
    }

    // Putanja do Python skripta
    const scriptPath = path.join(process.cwd(), "scripts", "google_maps_scraper.py")

    // Koristi venv Python ako postoji, inače sistem Python
    const venvPython = path.join(process.cwd(), "scripts", "venv", "bin", "python3")
    const pythonPath = process.env.SCRAPER_PYTHON_PATH || venvPython

    // Pokreni Python scraper
    let scraperOutput: ScraperOutput

    try {
      // Pokušaj prvo sa venv, pa sa system python3
      let command = `"${pythonPath}" "${scriptPath}" "${query.replace(/"/g, '\\"')}" ${limit}`

      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000, // 2 minute timeout
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
        },
      }).catch(async () => {
        // Fallback na system python3
        return execAsync(
          `python3 "${scriptPath}" "${query.replace(/"/g, '\\"')}" ${limit}`,
          {
            timeout: 120000,
            maxBuffer: 10 * 1024 * 1024,
            env: {
              ...process.env,
              PYTHONIOENCODING: "utf-8",
            },
          }
        )
      })

      if (stderr) {
        console.error("Scraper stderr:", stderr)
      }

      scraperOutput = JSON.parse(stdout)

      if (scraperOutput.error) {
        throw new Error(scraperOutput.error)
      }
    } catch (execError) {
      console.error("Scraper execution error:", execError)

      // Vrati grešku korisniku
      return NextResponse.json(
        {
          error: "Greška pri pretrazi. Provjerite da li je Python scraper instaliran.",
          details: execError instanceof Error ? execError.message : "Unknown error",
        },
        { status: 500 }
      )
    }

    const leads = scraperOutput.leads || []

    // Provjeri koji leadovi već postoje u bazi
    const googlePlaceIds = leads
      .map((l) => l.googlePlaceId)
      .filter((id): id is string => !!id)

    const existingLeads = await prisma.lead.findMany({
      where: {
        googlePlaceId: {
          in: googlePlaceIds,
        },
      },
      select: { googlePlaceId: true },
    })

    const existingIds = new Set(existingLeads.map((l) => l.googlePlaceId))

    // Dodaj info o postojećim leadovima
    const leadsWithExisting = leads.map((lead) => ({
      ...lead,
      isExisting: lead.googlePlaceId ? existingIds.has(lead.googlePlaceId) : false,
    }))

    return NextResponse.json({
      leads: leadsWithExisting,
      total: leadsWithExisting.length,
    })
  } catch (error) {
    console.error("Error searching places:", error)
    return NextResponse.json(
      { error: "Greška pri pretrazi" },
      { status: 500 }
    )
  }
}
