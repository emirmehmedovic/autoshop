import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    // Provjera admin prava
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 })
    }

    const { isApproved, priceGroupId } = await request.json()

    // Ažuriranje korisnika
    const user = await prisma.user.update({
      where: { id },
      data: {
        isApproved,
        ...(priceGroupId && {
          b2bProfile: {
            update: {
              priceGroupId,
            },
          },
        }),
      },
      include: {
        b2bProfile: {
          include: {
            priceGroup: true,
          },
        },
      },
    })

    // TODO: Poslati email notifikaciju korisniku da je nalog odobren

    return NextResponse.json({
      success: true,
      user,
      message: isApproved ? "B2B nalog odobren" : "B2B nalog blokiran",
    })
  } catch (error) {
    console.error("Greška pri odobravanju B2B naloga:", error)
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    )
  }
}
