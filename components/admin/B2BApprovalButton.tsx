"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface B2BApprovalButtonProps {
  userId: string
  isApproved: boolean
  priceGroups: Array<{ id: string; name: string }>
  currentPriceGroupId?: string | null
}

export function B2BApprovalButton({
  userId,
  isApproved,
  priceGroups,
  currentPriceGroupId,
}: B2BApprovalButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedPriceGroup, setSelectedPriceGroup] = useState(currentPriceGroupId || "")

  const handleApprove = async (approve: boolean) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/customers/${userId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isApproved: approve,
          priceGroupId: approve ? selectedPriceGroup : null,
        }),
      })

      if (!response.ok) throw new Error("Greška")

      router.refresh()
      setShowModal(false)
    } catch (error) {
      alert("Došlo je do greške")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`p-2 rounded hover:bg-gray-100 ${
          isApproved ? "text-green-600" : "text-orange-600"
        }`}
        title={isApproved ? "Odobren" : "Na čekanju"}
      >
        {isApproved ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">B2B Odobrenje</h2>

            {!isApproved && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Cjenovna grupa
                </label>
                <select
                  value={selectedPriceGroup}
                  onChange={(e) => setSelectedPriceGroup(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Bez grupe</option>
                  {priceGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              {!isApproved ? (
                <button
                  onClick={() => handleApprove(true)}
                  disabled={loading}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Odobri"}
                </button>
              ) : (
                <button
                  onClick={() => handleApprove(false)}
                  disabled={loading}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Blokiraj"}
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
