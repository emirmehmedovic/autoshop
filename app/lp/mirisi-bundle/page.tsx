"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Loader2, Wind, Sparkles, ChevronDown, ArrowRight, Leaf, Package } from "lucide-react"
import { trackPurchase, trackInitiateCheckout } from "@/lib/analytics/meta-pixel"

// Bundle pricing
const BUNDLE_PRICES = {
  1: 25,
  2: 45,
  3: 65,
} as const

const SHIPPING_COST = 10

const SCENTS = [
  { id: "million-miles", name: "Million Miles", description: "Svjež i energičan", image: "/products/scent-million-miles.png" },
  { id: "citrus", name: "Citrus", description: "Osvježavajući citrus", image: "/products/scent-citrus.png" },
  { id: "joyful-bloom", name: "Joyful Bloom", description: "Cvjetni i topao", image: "/products/scent-joyful-bloom.png" },
] as const

type PackSize = 1 | 2 | 3

export default function SignatureLandingPage() {
  const router = useRouter()

  // Order state
  const [packSize, setPackSize] = useState<PackSize>(2)
  const [selectedScents, setSelectedScents] = useState<string[]>([
    "million-miles",
    "citrus",
    "joyful-bloom",
  ])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [serverError, setServerError] = useState("")

  // Calculations
  const subtotal = BUNDLE_PRICES[packSize]
  const total = subtotal + SHIPPING_COST
  const savings = packSize * 25 - subtotal

  const updateScent = (index: number, scentId: string) => {
    setSelectedScents(prev => {
      const newScents = [...prev]
      newScents[index] = scentId
      return newScents
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Ime je obavezno"
    if (!formData.phone.trim()) newErrors.phone = "Telefon je obavezan"
    if (!formData.address.trim()) newErrors.address = "Adresa je obavezna"
    if (!formData.city.trim()) newErrors.city = "Grad je obavezan"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setServerError("")

    try {
      const items = selectedScents.slice(0, packSize).map((scentId) => {
        const scent = SCENTS.find(s => s.id === scentId)
        return {
          collection: "Signature",
          scent: scent?.name || scentId,
          price: subtotal / packSize,
        }
      })

      const response = await fetch("/api/landing-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packSize,
          items,
          subtotal,
          shippingCost: SHIPPING_COST,
          total,
          savings,
          customer: formData,
          source: "signature-landing",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Greška pri kreiranju narudžbe")
      }

      trackPurchase({
        orderNumber: data.orderNumber || data.orderId,
        total: total,
        items: selectedScents.slice(0, packSize).map(() => ({
          productId: "signature-collection-miris-za-auto",
          quantity: 1,
        })),
      })

      router.push(`/order/${data.orderId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Došlo je do greške"
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1816] text-[#f5f0e8]">
      {/* Top bar */}
      <div className="bg-[#c9a87c] text-[#1a1816] text-center py-2.5 text-xs tracking-wider font-medium">
        DOSTAVA ŠIROM BiH · PLAĆANJE POUZEĆEM
      </div>

      <main>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <p className="text-[#c9a87c] text-[11px] uppercase tracking-[0.3em] font-semibold mb-6">
                Signature Collection
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-6">
                Prirodno.<br />
                <span className="font-medium text-[#c9a87c]">Autentično.</span>
              </h1>
              <p className="text-[#a8a097] text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Premium miris za auto izrađen od pravog drveta. Diskretan, dugotrajan i savršen za svaki enterijer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <a
                  href="#naruci"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#c9a87c] text-[#1a1816] rounded-full font-semibold text-sm hover:bg-[#d4b78f] transition-all hover:scale-105"
                >
                  Naruči odmah
                  <ArrowRight size={16} />
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-[#a8a097]">
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#c9a87c]" />
                  Pravo drvo
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#c9a87c]" />
                  Pouzeće
                </span>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#d4c4a8] to-[#c9b896] relative shadow-2xl shadow-black/30">
                <img
                  src="/products/signature.png"
                  alt="Signature Collection miris za automobil"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating price badge */}
              <div className="absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-8 bg-[#1a1816] border border-[#3d3632] px-6 py-4 rounded-2xl shadow-xl">
                <p className="text-xs text-[#a8a097] mb-1">Od samo</p>
                <p className="text-3xl font-semibold text-[#c9a87c]">25 <span className="text-lg font-normal">KM</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <div className="border-y border-[#2d2825]">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#c9a87c]/10 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-[#c9a87c]" />
                </div>
                <div>
                  <p className="font-medium text-sm">Prirodni materijali</p>
                  <p className="text-xs text-[#a8a097]">Pravo drvo, premium miris</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#c9a87c]/10 flex items-center justify-center">
                  <Wind className="h-5 w-5 text-[#c9a87c]" />
                </div>
                <div>
                  <p className="font-medium text-sm">Jednostavna montaža</p>
                  <p className="text-xs text-[#a8a097]">Postavi na ventilaciju</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#c9a87c]/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#c9a87c]" />
                </div>
                <div>
                  <p className="font-medium text-sm">Brza dostava</p>
                  <p className="text-xs text-[#a8a097]">1-3 radna dana</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Showcase */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <p className="text-[#c9a87c] text-[11px] uppercase tracking-[0.3em] font-semibold mb-4">Tri jedinstvena mirisa</p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Izaberi svoj <span className="text-[#c9a87c]">potpis</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SCENTS.map((scent) => (
              <article key={scent.id} className="group rounded-2xl border border-[#2d2825] bg-[#211e1b] p-6 hover:border-[#c9a87c]/30 transition-all">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-[#d4c4a8] to-[#c9b896] mb-5">
                  <img
                    src={scent.image}
                    alt={scent.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-medium mb-1">{scent.name}</h3>
                <p className="text-sm text-[#a8a097] mb-4">{scent.description}</p>
                <button
                  onClick={() => {
                    setSelectedScents([scent.id, selectedScents[1], selectedScents[2]])
                    document.getElementById("naruci")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="text-[#c9a87c] text-sm font-medium hover:text-[#d4b78f] transition-colors"
                >
                  Odaberi →
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Order Section */}
        <section id="naruci" className="bg-[#211e1b] py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-[#c9a87c] text-[11px] uppercase tracking-[0.3em] font-semibold mb-4">Naruči sada</p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                Odaberi svoj paket
              </h2>
              <p className="text-[#a8a097]">Više komada = veća ušteda</p>
            </div>

            {/* Pack Selection */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {/* Pack 1 */}
              <button
                onClick={() => setPackSize(1)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                  packSize === 1
                    ? "border-[#c9a87c] bg-[#c9a87c]/5"
                    : "border-[#2d2825] hover:border-[#3d3632]"
                }`}
              >
                <p className="text-2xl font-semibold mb-1">1 miris</p>
                <p className="text-sm text-[#a8a097] mb-4">Za tvoj auto</p>
                <p className="text-3xl font-semibold text-[#c9a87c]">25 <span className="text-base font-normal">KM</span></p>
              </button>

              {/* Pack 2 - Recommended */}
              <button
                onClick={() => setPackSize(2)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                  packSize === 2
                    ? "border-[#c9a87c] bg-[#c9a87c]/5"
                    : "border-[#2d2825] hover:border-[#3d3632]"
                }`}
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#c9a87c] text-[#1a1816] text-[10px] tracking-wider font-bold rounded-full">
                  NAJPOPULARNIJE
                </span>
                <p className="text-2xl font-semibold mb-1">2 mirisa</p>
                <p className="text-sm text-[#a8a097] mb-4">Uštedi 5 KM</p>
                <p className="text-3xl font-semibold text-[#c9a87c]">45 <span className="text-base font-normal">KM</span></p>
              </button>

              {/* Pack 3 */}
              <button
                onClick={() => setPackSize(3)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                  packSize === 3
                    ? "border-[#c9a87c] bg-[#c9a87c]/5"
                    : "border-[#2d2825] hover:border-[#3d3632]"
                }`}
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#2d2825] text-[#c9a87c] text-[10px] tracking-wider font-bold rounded-full border border-[#c9a87c]/30">
                  NAJVEĆA UŠTEDA
                </span>
                <p className="text-2xl font-semibold mb-1">3 mirisa</p>
                <p className="text-sm text-[#a8a097] mb-4">Uštedi 10 KM</p>
                <p className="text-3xl font-semibold text-[#c9a87c]">65 <span className="text-base font-normal">KM</span></p>
              </button>
            </div>

            {/* Scent Selection */}
            <div className="bg-[#1a1816] rounded-2xl border border-[#2d2825] p-6 md:p-8 mb-8">
              <p className="text-sm font-medium mb-6 flex items-center gap-2">
                <Sparkles size={16} className="text-[#c9a87c]" />
                Odaberi {packSize === 1 ? "miris" : "mirise"}
              </p>

              <div className="space-y-4">
                {Array.from({ length: packSize }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#c9a87c]/10 text-[#c9a87c] text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 relative">
                      <select
                        value={selectedScents[index]}
                        onChange={(e) => updateScent(index, e.target.value)}
                        className="w-full appearance-none bg-[#211e1b] border border-[#3d3632] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#c9a87c] transition-colors"
                      >
                        {SCENTS.map(scent => (
                          <option key={scent.id} value={scent.id}>{scent.name} — {scent.description}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a097] pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary & Checkout */}
            <div className="bg-[#1a1816] rounded-2xl border border-[#2d2825] p-6 md:p-8">
              {/* Summary */}
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-[#2d2825]">
                <div className="flex justify-between">
                  <span className="text-[#a8a097]">{packSize}x Signature miris</span>
                  <span>{subtotal} KM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a8a097]">Dostava</span>
                  <span>{SHIPPING_COST} KM</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#c9a87c]">
                    <span>Ušteda</span>
                    <span>-{savings} KM</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-semibold pt-3">
                  <span>Ukupno</span>
                  <span className="text-[#c9a87c]">{total} KM</span>
                </div>
              </div>

              {/* Checkout Button / Form */}
              {!showCheckout ? (
                <button
                  onClick={() => {
                    trackInitiateCheckout({
                      items: selectedScents.slice(0, packSize).map((scentId) => {
                        const scent = SCENTS.find(s => s.id === scentId)
                        return {
                          id: "signature-collection-miris-za-auto",
                          name: `Signature - ${scent?.name}`,
                          price: subtotal / packSize,
                          quantity: 1,
                        }
                      }),
                      total: total,
                    })
                    setShowCheckout(true)
                  }}
                  className="w-full py-4 bg-[#c9a87c] text-[#1a1816] rounded-xl font-semibold text-sm hover:bg-[#d4b78f] transition-all flex items-center justify-center gap-3"
                >
                  Nastavi na dostavu
                  <ArrowRight size={16} />
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-[#211e1b] p-4 rounded-xl text-xs mb-4 border border-[#2d2825]">
                    <p className="font-medium mb-1 text-[#c9a87c]">Tvoj odabir:</p>
                    <p className="text-[#a8a097]">
                      {selectedScents.slice(0, packSize).map(id => SCENTS.find(s => s.id === id)?.name).join(" • ")}
                    </p>
                  </div>

                  {serverError && (
                    <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-300 rounded-xl text-sm">
                      {serverError}
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-[#a8a097] block mb-2">Ime i prezime *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-[#211e1b] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a87c] transition-colors ${errors.name ? "border-red-500" : "border-[#3d3632]"}`}
                      disabled={loading}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[#a8a097] block mb-2">Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+387 XX XXX XXX"
                      className={`w-full bg-[#211e1b] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a87c] transition-colors ${errors.phone ? "border-red-500" : "border-[#3d3632]"}`}
                      disabled={loading}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[#a8a097] block mb-2">Adresa *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ulica i broj"
                      className={`w-full bg-[#211e1b] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a87c] transition-colors ${errors.address ? "border-red-500" : "border-[#3d3632]"}`}
                      disabled={loading}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#a8a097] block mb-2">Grad *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full bg-[#211e1b] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a87c] transition-colors ${errors.city ? "border-red-500" : "border-[#3d3632]"}`}
                        disabled={loading}
                      />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[#a8a097] block mb-2">Poštanski broj</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-[#211e1b] border border-[#3d3632] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a87c] transition-colors"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#c9a87c] text-[#1a1816] rounded-xl font-semibold text-sm hover:bg-[#d4b78f] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Procesiranje...
                      </>
                    ) : (
                      <>
                        Potvrdi narudžbu — {total} KM
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[#a8a097] mt-4">
                    Plaćanje pouzećem · Isporuka 1-3 radna dana
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight">
              Česta pitanja
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                q: "Koliko traje miris?",
                a: "Miris traje 4-6 sedmica ovisno o intenzitetu korištenja klime/ventilacije u automobilu."
              },
              {
                q: "Kako se postavlja?",
                a: "Jednostavno ga zakačite na lamele ventilacije. Dolazi s klipsom koji odgovara većini automobila."
              },
              {
                q: "Koliko košta dostava?",
                a: "Dostava iznosi 10 KM za sve narudžbe širom Bosne i Hercegovine."
              },
              {
                q: "Kada stiže narudžba?",
                a: "Narudžbe se šalju istog ili sljedećeg radnog dana. Dostava traje 1-3 radna dana."
              },
              {
                q: "Kako plaćam?",
                a: "Plaćanje je pouzećem - platite kuriru prilikom preuzimanja paketa."
              },
            ].map((faq, i) => (
              <details key={i} className="border-b border-[#2d2825] py-5 group">
                <summary className="flex justify-between items-center cursor-pointer list-none text-base font-medium">
                  {faq.q}
                  <span className="text-[#c9a87c] text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm text-[#a8a097] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d2825] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#a8a097]">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-[#f5f0e8]">GlossDrive<span className="text-[#c9a87c]">.</span></span>
            <span className="text-xs">Tuzla, BiH</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <a href="tel:+38761577576" className="hover:text-[#f5f0e8] transition-colors">+387 61 577 576</a>
            <Link href="/" className="hover:text-[#f5f0e8] transition-colors">Webshop</Link>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1816]/95 border-t border-[#2d2825] backdrop-blur-md z-50 py-3 md:hidden">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{packSize}x Signature</p>
            <p className="text-xs text-[#a8a097]">{total} KM s dostavom</p>
          </div>
          <a
            href="#naruci"
            className="px-6 py-3 bg-[#c9a87c] text-[#1a1816] rounded-full font-semibold text-sm"
          >
            Naruči
          </a>
        </div>
      </div>
    </div>
  )
}
