import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { CheckCircle, XCircle, Users } from "lucide-react"

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

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white">Kupci</h1>
            <p className="text-gray-400 mt-1">
              {customers.length} kupaca • {b2bCount} B2B • {b2cCount} B2C
              {pendingApproval > 0 && <span className="text-orange-400"> • {pendingApproval} na čekanju</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Ukupno</p>
              <p className="text-3xl font-bold text-white mt-1">{customers.length}</p>
            </div>
            <div className="p-3 bg-lime-400/10 rounded-lg border border-lime-400/20">
              <Users className="text-lime-400" size={24} />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">B2B Kupci</p>
              <p className="text-3xl font-bold text-white mt-1">{b2bCount}</p>
            </div>
            <div className="p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
              <Users className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Na čekanju</p>
              <p className="text-3xl font-bold text-white mt-1">{pendingApproval}</p>
            </div>
            <div className="p-3 bg-orange-400/10 rounded-lg border border-orange-400/20">
              <Users className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">Ime</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">Tip</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">Cjenovnik</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">Narudžbe</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">Registracija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-bold text-white">{customer.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{customer.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      customer.customerType === "B2B"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {customer.customerType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {customer.b2bProfile?.priceGroup?.name || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {customer.isApproved ? (
                        <>
                          <CheckCircle size={18} className="text-lime-400" />
                          <span className="text-sm text-lime-400 font-semibold">Odobren</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={18} className="text-orange-400" />
                          <span className="text-sm text-orange-400 font-semibold">Na čekanju</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-700/30 border border-white/10 rounded-lg text-white font-bold text-sm">
                      {customer._count.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(customer.createdAt).toLocaleDateString("bs-BA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nema kupaca za prikaz</p>
          </div>
        )}
      </div>
    </div>
  )
}
