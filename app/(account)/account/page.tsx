import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Moj profil</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
          <p className="text-gray-900">{session.user.name || "Nije postavljeno"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-900">{session.user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tip naloga</label>
          <p className="text-gray-900">{session.user.customerType}</p>
        </div>
      </div>
    </div>
  )
}
