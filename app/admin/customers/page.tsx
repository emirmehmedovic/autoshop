import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { CheckCircle, XCircle, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      b2bProfile: { include: { priceGroup: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const b2bCount = customers.filter(c => c.customerType === "B2B").length
  const b2cCount = customers.filter(c => c.customerType === "B2C").length
  const pendingApproval = customers.filter(c => !c.isApproved).length

  return (
    <div>
      <Breadcrumbs items={[{ label: "Kupci" }]} />

      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/5 via-white/80 to-green-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Kupci</h1>
            <p className="text-gray-600 mt-1">
              {customers.length} kupaca • {b2bCount} B2B • {b2cCount} B2C
              {pendingApproval > 0 && <span className="text-orange-500"> • {pendingApproval} na čekanju</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Ukupno</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{customers.length}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Users className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">B2B Kupci</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{b2bCount}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Users className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Na čekanju</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pendingApproval}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Users className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ime</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tip</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cjenovnik</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Narudžbe</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registracija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">{customer.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{customer.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      customer.customerType === "B2B"
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                    }`}>
                      {customer.customerType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.b2bProfile?.priceGroup?.name || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {customer.isApproved ? (
                        <>
                          <CheckCircle size={18} className="text-green-500" />
                          <span className="text-sm text-green-600 font-semibold">Odobren</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={18} className="text-orange-500" />
                          <span className="text-sm text-orange-600 font-semibold">Na čekanju</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 font-bold text-sm">
                      {customer._count.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString("bs-BA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nema kupaca za prikaz</p>
          </div>
        )}
      </div>
    </div>
  )
}
