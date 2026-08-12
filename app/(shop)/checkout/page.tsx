"use client"

import { useCartStore } from "@/lib/store/cartStore"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingBag, Loader2 } from "lucide-react"
import { z } from "zod"
import { trackInitiateCheckout, trackPurchase } from "@/lib/analytics/meta-pixel"
import { SHIPPING_COST } from "@/lib/shipping"

const checkoutSchema = z.object({
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Neispravna email adresa"),
  phone: z.string().min(6, "Telefon mora imati najmanje 6 karaktera"),
  address: z.string().min(5, "Adresa mora imati najmanje 5 karaktera"),
  city: z.string().min(2, "Grad mora biti naveden"),
  zip: z.string().optional(),
  note: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotalPrice, clearCart } = useCartStore()

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    note: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  useEffect(() => {
    if (session?.user) {
      const frame = requestAnimationFrame(() => {
        setFormData((prev) => ({
          ...prev,
          name: session.user.name || prev.name,
          email: session.user.email || prev.email,
        }))
      })

      return () => cancelAnimationFrame(frame)
    }
  }, [session])

  // Redirect ako je korpa prazna
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items.length, router])

  // Meta Pixel - InitiateCheckout tracking
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout({
        items: items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getTotalPrice() + SHIPPING_COST,
      })
    }
  }, []) // Samo prvi put kada se stranica učita

  const subtotal = getTotalPrice()
  const total = subtotal + SHIPPING_COST

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Očisti grešku za ovo polje
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setServerError("")

    // Validacija
    const result = checkoutSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          shippingInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Greška pri kreiranju narudžbe")
      }

      // Meta Pixel - Purchase tracking
      trackPurchase({
        orderNumber: data.orderNumber,
        total: total,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })

      // Očisti korpu
      clearCart()

      // Redirect na potvrdu
      router.push(`/order/${data.orderId}`)
    } catch (error: unknown) {
      setServerError(error instanceof Error ? error.message : "Greška pri kreiranju narudžbe")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Ili loading spinner dok čeka redirect
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-gray-100/80 via-white/70 to-gray-50/80 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Završite narudžbu</h1>
              <p className="text-gray-600 mt-1">Unesite podatke za dostavu i potvrdite narudžbu</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forma */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
              <div className="relative">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
                  Podaci za dostavu
                </h2>

                {serverError && (
                  <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 rounded-xl">
                    {serverError}
                  </div>
                )}

            <div className="space-y-5">
              {/* Ime i prezime */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Ime i prezime *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm ${
                    errors.name ? "border-red-500" : "border-white/60"
                  }`}
                  disabled={loading}
                />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email adresa *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm ${
                    errors.email ? "border-red-500" : "border-white/60"
                  }`}
                  disabled={loading}
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Telefon */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+387 XX XXX XXX"
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm ${
                    errors.phone ? "border-red-500" : "border-white/60"
                  }`}
                  disabled={loading}
                />
                {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Adresa */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresa *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ulica i broj"
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm ${
                    errors.address ? "border-red-500" : "border-white/60"
                  }`}
                  disabled={loading}
                />
                {errors.address && <p className="mt-2 text-sm text-red-500">{errors.address}</p>}
              </div>

              {/* Grad i Poštanski broj */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    Grad *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm ${
                      errors.city ? "border-red-500" : "border-white/60"
                    }`}
                    disabled={loading}
                  />
                  {errors.city && <p className="mt-2 text-sm text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-2">
                    Poštanski broj
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Napomena */}
              <div>
                <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-2">
                  Napomena (opciono)
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Dodatne napomene za dostavu..."
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none shadow-sm"
                  disabled={loading}
                />
              </div>
            </div>

                {/* Submit dugme */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-orange-500/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Procesiranje...
                    </>
                  ) : (
                    "Potvrdi narudžbu"
                  )}
                </button>
              </div>
            </form>
          </div>

        {/* Sažetak */}
        <div className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-2xl p-6 sticky top-24 backdrop-blur-xl bg-gradient-to-br from-gray-100/80 via-white/70 to-gray-50/80 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
                Vaša narudžba
              </h2>

              {/* Lista proizvoda */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {item.price.toFixed(2)} KM
                      </p>
                    </div>
                    <p className="text-sm font-bold text-orange-500 flex-shrink-0">
                      {(item.quantity * item.price).toFixed(2)} KM
                    </p>
                  </div>
                ))}
              </div>

              {/* Totali */}
              <div className="space-y-3 pt-6 border-t border-gray-200/50">
                <div className="flex justify-between text-gray-600">
                  <span>Proizvodi:</span>
                  <span className="text-gray-900 font-semibold">{subtotal.toFixed(2)} KM</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Dostava:</span>
                  <span className="text-gray-900 font-semibold">{SHIPPING_COST.toFixed(2)} KM</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200/50">
                  <span>Ukupno:</span>
                  <span className="text-orange-500">{total.toFixed(2)} KM</span>
                </div>
              </div>

              {/* Način plaćanja */}
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <div className="bg-gradient-to-br from-orange-100/80 to-amber-50/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                  <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <ShoppingBag className="text-orange-500" size={18} />
                    Plaćanje pouzećem (COD)
                  </p>
                  <p className="text-sm text-gray-600">
                    Platite gotovinom prilikom preuzimanja paketa. Siguran i praktičan način plaćanja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
