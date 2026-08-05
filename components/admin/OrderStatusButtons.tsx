"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Truck, Package, Banknote, Loader2, XCircle, RotateCcw } from "lucide-react"

interface OrderStatusButtonsProps {
  orderId: string
  currentStatus: string
  isPaid: boolean
}

export function OrderStatusButtons({ orderId, currentStatus, isPaid }: OrderStatusButtonsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (status: string) => {
    setLoading(status)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Greška pri ažuriranju statusa")
      }
    } catch {
      alert("Greška pri ažuriranju statusa")
    } finally {
      setLoading(null)
    }
  }

  const markAsPaid = async () => {
    setLoading("paid")
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: true }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Greška pri označavanju plaćanja")
      }
    } catch {
      alert("Greška pri označavanju plaćanja")
    } finally {
      setLoading(null)
    }
  }

  const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]
  const currentIndex = statusOrder.indexOf(currentStatus)

  const isCompleted = (status: string) => {
    const statusIndex = statusOrder.indexOf(status)
    return statusIndex < currentIndex
  }

  const isCurrent = (status: string) => status === currentStatus

  // Check if order is cancelled or returned
  const isCancelledOrReturned = currentStatus === "CANCELLED" || currentStatus === "RETURNED"

  const buttons = [
    {
      status: "CONFIRMED",
      label: "Potvrdi",
      icon: CheckCircle,
      color: "blue",
    },
    {
      status: "SHIPPED",
      label: "Poslano",
      icon: Truck,
      color: "indigo",
    },
    {
      status: "DELIVERED",
      label: "Dostavljeno",
      icon: Package,
      color: "green",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Promjena statusa</h3>

      <div className="flex flex-wrap gap-3">
        {buttons.map((btn) => {
          const Icon = btn.icon
          const completed = isCompleted(btn.status)
          const current = isCurrent(btn.status)
          const disabled = completed || current || loading !== null || isCancelledOrReturned

          return (
            <button
              key={btn.status}
              onClick={() => updateStatus(btn.status)}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition border disabled:opacity-50"
              style={{
                backgroundColor: completed || isCancelledOrReturned ? "#f3f4f6" : current ? getStatusColor(btn.color) : "white",
                borderColor: completed || isCancelledOrReturned ? "#e5e7eb" : current ? getStatusColor(btn.color) : getStatusBorderColor(btn.color),
                color: completed || isCancelledOrReturned ? "#9ca3af" : current ? "white" : getStatusColor(btn.color),
                cursor: disabled ? (current ? "default" : "not-allowed") : "pointer",
              }}
            >
              {loading === btn.status ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Icon size={18} />
              )}
              {btn.label}
              {completed && " ✓"}
            </button>
          )
        })}
      </div>

      {/* Cancelled and Returned buttons */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Otkazivanje / Povrat</h3>

        <div className="flex flex-wrap gap-3">
          {currentStatus === "CANCELLED" ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-full font-bold text-sm border border-red-500">
              <XCircle size={18} />
              Otkazano
            </div>
          ) : (
            <button
              onClick={() => updateStatus("CANCELLED")}
              disabled={loading !== null || currentStatus === "RETURNED"}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-full font-bold text-sm hover:bg-red-50 hover:border-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "CANCELLED" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <XCircle size={18} />
              )}
              Otkaži narudžbu
            </button>
          )}

          {currentStatus === "RETURNED" ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-500 text-white rounded-full font-bold text-sm border border-gray-500">
              <RotateCcw size={18} />
              Vraćeno
            </div>
          ) : (
            <button
              onClick={() => updateStatus("RETURNED")}
              disabled={loading !== null || currentStatus === "CANCELLED"}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-600 border border-gray-300 rounded-full font-bold text-sm hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "RETURNED" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RotateCcw size={18} />
              )}
              Označi kao vraćeno
            </button>
          )}
        </div>
      </div>

      {/* Payment section */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Plaćanje (Pouzeće)</h3>

        {isPaid ? (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-full font-bold text-sm border border-green-200 w-fit">
            <Banknote size={18} />
            Naplaćeno ✓
          </div>
        ) : (
          <button
            onClick={markAsPaid}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 border border-orange-200 rounded-full font-bold text-sm hover:bg-orange-50 hover:border-orange-300 transition disabled:opacity-50"
          >
            {loading === "paid" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Banknote size={18} />
            )}
            Označi kao naplaćeno
          </button>
        )}
      </div>
    </div>
  )
}

function getStatusColor(color: string): string {
  const colors: Record<string, string> = {
    blue: "#3b82f6",
    indigo: "#6366f1",
    green: "#22c55e",
    red: "#ef4444",
    gray: "#6b7280",
  }
  return colors[color] || "#3b82f6"
}

function getStatusBorderColor(color: string): string {
  const colors: Record<string, string> = {
    blue: "#bfdbfe",
    indigo: "#c7d2fe",
    green: "#bbf7d0",
    red: "#fecaca",
    gray: "#d1d5db",
  }
  return colors[color] || "#bfdbfe"
}
