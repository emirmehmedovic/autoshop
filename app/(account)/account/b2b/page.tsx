import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Building2, Percent, Package } from "lucide-react"

export default async function B2BPanelPage() {
  const session = await auth()

  if (!session || session.user.customerType !== "B2B") {
    redirect("/account")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      b2bProfile: {
        include: {
          priceGroup: true,
        },
      },
    },
  })

  if (!user?.b2bProfile) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">B2B profil nije pronađen.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 size={28} />
          B2B Panel
        </h1>

        {!user.isApproved && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-900 font-medium">
              ⏳ Vaš B2B nalog čeka odobrenje administratora
            </p>
            <p className="text-sm text-orange-700 mt-1">
              Bićete obaviješteni putem emaila kada nalog bude odobren.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Podaci o firmi */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Podaci o firmi</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Naziv firme</label>
                <p className="text-gray-900 font-medium">{user.b2bProfile.companyName}</p>
              </div>
              {user.b2bProfile.pib && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">PIB</label>
                  <p className="text-gray-900">{user.b2bProfile.pib}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600">Adresa</label>
                <p className="text-gray-900">{user.b2bProfile.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Kontakt osoba</label>
                <p className="text-gray-900">{user.b2bProfile.contactPerson}</p>
              </div>
            </div>
          </div>

          {/* Cjenovna grupa */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vaša cjenovna grupa</h2>
            {user.b2bProfile.priceGroup ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="text-purple-600" size={24} />
                  <p className="text-lg font-bold text-purple-900">
                    {user.b2bProfile.priceGroup.name}
                  </p>
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  {user.b2bProfile.priceGroup.discount}% popust
                </p>
                <p className="text-sm text-purple-700">
                  Vaš popust na sve proizvode u shop-u
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600">Još nemate dodijeljenu cjenovnu grupu.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informacije */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Package size={20} />
          B2B Pogodnosti
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Specijalne cijene na sve proizvode</li>
          <li>✓ Mogućnost naručivanja većih količina</li>
          <li>✓ Prioritetna dostava</li>
          <li>✓ Izdavanje računa za svaku narudžbu</li>
          <li>✓ Posvećen podrška za B2B klijente</li>
        </ul>
      </div>
    </div>
  )
}
