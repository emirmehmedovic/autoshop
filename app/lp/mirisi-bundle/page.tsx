"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Loader2, Wind, Sparkles, Clock, ChevronDown, Phone, ArrowRight } from "lucide-react"
import { trackPurchase, trackInitiateCheckout } from "@/lib/analytics/meta-pixel"

// Bundle pricing
const BUNDLE_PRICES = {
  1: 25,
  2: 45,
  3: 65,
} as const

const SHIPPING_COST = 10

const COLLECTIONS = ["Signature", "Luxury"] as const
const SCENTS = ["Million Miles", "Citrus", "Joyful Bloom"] as const

type PackSize = 1 | 2 | 3

interface ItemSelection {
  collection: typeof COLLECTIONS[number]
  scent: typeof SCENTS[number]
}

export default function MirisiBundleLandingPage() {
  const router = useRouter()

  // Order state
  const [packSize, setPackSize] = useState<PackSize>(2)
  const [selections, setSelections] = useState<ItemSelection[]>([
    { collection: "Signature", scent: "Million Miles" },
    { collection: "Luxury", scent: "Citrus" },
    { collection: "Signature", scent: "Joyful Bloom" },
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

  const updateSelection = (index: number, key: keyof ItemSelection, value: string) => {
    setSelections(prev => {
      const newSelections = [...prev]
      newSelections[index] = { ...newSelections[index], [key]: value }
      return newSelections
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
      // Build order items
      const items = selections.slice(0, packSize).map((sel, index) => ({
        collection: sel.collection,
        scent: sel.scent,
        price: subtotal / packSize, // Price per item in bundle
      }))

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
          source: "mirisi-bundle-landing",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Greška pri kreiranju narudžbe")
      }

      // Track purchase event for Meta Pixel
      trackPurchase({
        orderNumber: data.orderNumber || data.orderId,
        total: total,
        items: selections.slice(0, packSize).map((sel, index) => ({
          productId: `${sel.collection.toLowerCase()}-${sel.scent.toLowerCase().replace(/\s+/g, "-")}`,
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
    <div className="min-h-screen bg-[#141714] text-[#f4f1e9]">
      {/* Top bar */}
      <div className="bg-[#d9ed99] text-[#20251b] text-center py-2.5 text-xs tracking-wider font-medium">
        DOSTAVA SIROM BiH · PLACANJE POUZECEM
      </div>

      <main>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <p className="text-[#d9ed99] text-[11px] uppercase tracking-[0.25em] font-bold mb-6">
                Mali detalj. Tvoj potpis.
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.04] tracking-tight mb-6">
                Dobar stil se<br />vidi. <em className="font-serif text-[#d9ed99]">I osjeti.</em>
              </h1>
              <p className="text-[#aeb5aa] text-lg mb-8 max-w-md mx-auto lg:mx-0">
                Miris za auto koji zasluzuje mjesto u tvom enterijeru. Otkrij Signature i Luxury kolekcije s drvenim detaljima i diskretnim postavljanjem na ventilaciju.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <a
                  href="#naruci"
                  className="inline-flex items-center justify-center gap-8 px-6 py-4 bg-[#d9ed99] text-[#20251b] rounded-lg font-bold text-sm hover:bg-[#e8f5b0] transition-colors"
                >
                  Odaberi svoj miris
                  <ArrowRight size={16} />
                </a>
              </div>
              <p className="text-[#aeb5aa] text-sm">Od 25 KM · Dostava 10 KM po narudzbi</p>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="aspect-[1/1.08] rounded-[1.5rem] overflow-hidden bg-[#e5e1d7] relative">
                <img
                  src="/products/luxury.png"
                  alt="Luxury Collection miris za automobil"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-5 left-5 bg-[#f4f1e9]/90 text-[#22281f] px-4 py-2 rounded-full text-xs font-medium">
                  LUXURY COLLECTION
                </span>
                <div className="absolute bottom-5 left-5 right-5 bg-[#151914]/90 backdrop-blur-sm p-5 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">Detalj koji zaokruzuje enterijer.</p>
                    <p className="text-sm text-[#c7ccbf]">Dvije kolekcije. Tvoj izbor.</p>
                  </div>
                  <p className="text-2xl font-bold">25 <span className="text-sm font-normal">KM</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Bar */}
        <div className="max-w-6xl mx-auto px-4 py-6 border-y border-[#373d34]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center justify-center gap-3">
              <Wind className="h-5 w-5 text-[#d9ed99]" />
              <span>Postavljanje na ventilaciju</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-5 w-5 text-[#d9ed99]" />
              <span>Drveni detalji i elegantan izgled</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Check className="h-5 w-5 text-[#d9ed99]" />
              <span>Plati prilikom preuzimanja</span>
            </div>
          </div>
        </div>

        {/* Collections Section */}
        <section id="kolekcije" className="max-w-6xl mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
            <div>
              <p className="text-[#d9ed99] text-[11px] uppercase tracking-[0.25em] font-bold mb-3">Odaberi svoj stil</p>
              <h2 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight">
                Dvije kolekcije.<br />Isti osjecaj za detalje.
              </h2>
            </div>
            <p className="text-[#aeb5aa] text-sm max-w-sm">
              Toplina drveta ili upecatljiva zavrsna obrada? Izaberi izgled koji pristaje tvom automobilu.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Signature Collection */}
            <article className="rounded-[1.25rem] border border-[#373d34] overflow-hidden group">
              <div className="aspect-[1.35/1] overflow-hidden bg-[#ece9e0]">
                <img
                  src="/products/signature.png"
                  alt="Signature Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-medium">Signature Collection</h3>
                  <span className="text-[#d9ed99]">25 KM</span>
                </div>
                <p className="text-[#aeb5aa] text-sm mb-4">Drveni izgled i jednostavne linije za topao, skladan enterijer.</p>
                <button
                  onClick={() => {
                    setSelections(prev => [{ ...prev[0], collection: "Signature" }, ...prev.slice(1)])
                    document.getElementById("naruci")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="text-[#d9ed99] text-sm font-medium hover:text-[#e8f5b0] transition-colors"
                >
                  Odaberi Signature
                </button>
              </div>
            </article>

            {/* Luxury Collection */}
            <article className="rounded-[1.25rem] border border-[#373d34] overflow-hidden group">
              <div className="aspect-[1.35/1] overflow-hidden bg-[#ece9e0]">
                <img
                  src="/products/luxury.png"
                  alt="Luxury Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-medium">Luxury Collection</h3>
                  <span className="text-[#d9ed99]">25 KM</span>
                </div>
                <p className="text-[#aeb5aa] text-sm mb-4">Drveni detalji i elegantna zavrsna obrada za izrazen zavrsni dodir.</p>
                <button
                  onClick={() => {
                    setSelections(prev => [{ ...prev[0], collection: "Luxury" }, ...prev.slice(1)])
                    document.getElementById("naruci")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="text-[#d9ed99] text-sm font-medium hover:text-[#e8f5b0] transition-colors"
                >
                  Odaberi Luxury
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* How it works - Light section */}
        <section className="bg-[#f4f1e9] text-[#242a21] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-[#63733e] text-[11px] uppercase tracking-[0.25em] font-bold mb-3">Za tvoju svakodnevnu voznju</p>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight mb-12">
              Od izbora do enterijera.<br />Jednostavno.
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              <article>
                <p className="text-4xl font-serif text-[#7b885f] border-b border-[#d8dbcd] pb-4 mb-4">01</p>
                <h3 className="text-xl font-medium mb-2">Pronadi svoj izgled</h3>
                <p className="text-[#62685d] text-sm">Izaberi Signature ili Luxury. U paketu mozes kombinovati obje kolekcije.</p>
              </article>
              <article>
                <p className="text-4xl font-serif text-[#7b885f] border-b border-[#d8dbcd] pb-4 mb-4">02</p>
                <h3 className="text-xl font-medium mb-2">Odaberi miris</h3>
                <p className="text-[#62685d] text-sm">Million Miles, Citrus ili Joyful Bloom — izbor za svaki komad je tvoj.</p>
              </article>
              <article>
                <p className="text-4xl font-serif text-[#7b885f] border-b border-[#d8dbcd] pb-4 mb-4">03</p>
                <h3 className="text-xl font-medium mb-2">Postavi na ventilaciju</h3>
                <p className="text-[#62685d] text-sm">Diskretan detalj ostaje na svom mjestu u enterijeru, spreman za tvoju sljedecu voznju.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Order Section */}
        <section id="naruci" className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Info */}
            <div className="lg:sticky lg:top-8">
              <p className="text-[#d9ed99] text-[11px] uppercase tracking-[0.25em] font-bold mb-3">Za sebe. Ili za nekoga svog.</p>
              <h2 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight mb-6">
                Dva automobila?<br />Jedna dobra odluka.
              </h2>
              <p className="text-[#aeb5aa] mb-4">
                Uzmi dva mirisa za <strong className="text-[#f4f1e9]">45 KM</strong> i ustedi 5 KM u odnosu na pojedinacnu kupovinu. Za drugi automobil u porodici ili mali poklon osobi koja voli svoj auto.
              </p>
              <p className="text-[#aeb5aa] text-sm mb-8">Kombinuj kolekcije i mirise. Dostavu placas jednom.</p>

              {/* Bundle preview images */}
              <div className="relative grid grid-cols-2 gap-3 max-w-sm">
                <img src="/products/signature.png" alt="Signature miris" className="w-full aspect-square object-cover rounded-lg" />
                <img src="/products/luxury.png" alt="Luxury miris" className="w-full aspect-square object-cover rounded-lg" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#d9ed99] text-[#20251b] border-4 border-[#141714] rounded-full flex items-center justify-center text-2xl font-bold">
                  +
                </span>
              </div>
            </div>

            {/* Right - Order Form */}
            <div className="bg-[#20241f] border border-[#373d34] rounded-[1rem] p-6 md:p-8">
              {/* Step 1: Pack Selection */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-6 rounded-full border border-[#69745b] text-[#d9ed99] text-xs flex items-center justify-center font-bold">1</span>
                <span className="text-sm font-bold">Odaberi svoj paket</span>
              </div>

              <div className="space-y-3 mb-8">
                {/* Pack 1 */}
                <label className={`relative flex items-center gap-4 p-5 rounded-lg border cursor-pointer transition-all ${packSize === 1 ? "border-[#d9ed99] bg-[#293020] border-2" : "border-[#4b5147] hover:border-[#69745b]"}`}>
                  <input
                    type="radio"
                    name="pack"
                    value={1}
                    checked={packSize === 1}
                    onChange={() => setPackSize(1)}
                    className="accent-[#d9ed99] w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Jedan miris</span>
                    <span className="block text-xs text-[#aeb5aa]">Mali detalj za tvoj auto</span>
                  </div>
                  <span className="text-xl font-bold">25 KM</span>
                </label>

                {/* Pack 2 - Recommended */}
                <label className={`relative flex items-center gap-4 p-5 rounded-lg border cursor-pointer transition-all ${packSize === 2 ? "border-[#d9ed99] bg-[#293020] border-2" : "border-[#4b5147] hover:border-[#69745b]"}`}>
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-[#d9ed99] text-[#20251b] text-[9px] tracking-wider font-bold rounded">
                    PREPORUCENI PAKET
                  </span>
                  <input
                    type="radio"
                    name="pack"
                    value={2}
                    checked={packSize === 2}
                    onChange={() => setPackSize(2)}
                    className="accent-[#d9ed99] w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Dva mirisa</span>
                    <span className="block text-xs text-[#aeb5aa]">22,50 KM po komadu · usteda 5 KM</span>
                  </div>
                  <span className="text-xl font-bold">45 KM</span>
                </label>

                {/* Pack 3 */}
                <label className={`relative flex items-center gap-4 p-5 rounded-lg border cursor-pointer transition-all ${packSize === 3 ? "border-[#d9ed99] bg-[#293020] border-2" : "border-[#4b5147] hover:border-[#69745b]"}`}>
                  <input
                    type="radio"
                    name="pack"
                    value={3}
                    checked={packSize === 3}
                    onChange={() => setPackSize(3)}
                    className="accent-[#d9ed99] w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Tri mirisa</span>
                    <span className="block text-xs text-[#aeb5aa]">Usteda 10 KM na proizvodima</span>
                  </div>
                  <span className="text-xl font-bold">65 KM</span>
                </label>
              </div>

              {/* Step 2: Item Selection */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-6 rounded-full border border-[#69745b] text-[#d9ed99] text-xs flex items-center justify-center font-bold">2</span>
                <span className="text-sm font-bold">Slozi svoju kombinaciju</span>
              </div>

              <div className="space-y-5 mb-8">
                {Array.from({ length: packSize }).map((_, index) => (
                  <div key={index} className="border-b border-[#373d34] pb-5">
                    <p className="text-xs text-[#aeb5aa] mb-3">MIRIS {index + 1}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#aeb5aa] block mb-1.5">Kolekcija</label>
                        <div className="relative">
                          <select
                            value={selections[index].collection}
                            onChange={(e) => updateSelection(index, "collection", e.target.value)}
                            className="w-full appearance-none bg-[#181c17] border border-[#505749] rounded-md px-3 py-2.5 text-sm text-[#f4f1e9] focus:outline-none focus:border-[#d9ed99]"
                          >
                            {COLLECTIONS.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeb5aa] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-[#aeb5aa] block mb-1.5">Miris</label>
                        <div className="relative">
                          <select
                            value={selections[index].scent}
                            onChange={(e) => updateSelection(index, "scent", e.target.value)}
                            className="w-full appearance-none bg-[#181c17] border border-[#505749] rounded-md px-3 py-2.5 text-sm text-[#f4f1e9] focus:outline-none focus:border-[#d9ed99]"
                          >
                            {SCENTS.map(scent => (
                              <option key={scent} value={scent}>{scent}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeb5aa] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span>{packSize === 1 ? "Jedan miris" : `Paket od ${packSize} mirisa`}</span>
                  <span>{subtotal} KM</span>
                </div>
                <div className="flex justify-between">
                  <span>Dostava sirom BiH</span>
                  <span>{SHIPPING_COST} KM</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-[#495040] pt-4">
                  <span>Ukupno za placanje</span>
                  <span>{total} KM</span>
                </div>
                {savings > 0 && (
                  <p className="text-[#d9ed99] text-xs">Usteda na proizvodima: {savings} KM</p>
                )}
              </div>

              {/* Checkout Button / Form */}
              {!showCheckout ? (
                <button
                  onClick={() => {
                    // Track InitiateCheckout for Meta Pixel
                    trackInitiateCheckout({
                      items: selections.slice(0, packSize).map((sel) => ({
                        id: `${sel.collection.toLowerCase()}-${sel.scent.toLowerCase().replace(/\s+/g, "-")}`,
                        name: `${sel.collection} - ${sel.scent}`,
                        price: subtotal / packSize,
                        quantity: 1,
                      })),
                      total: total,
                    })
                    setShowCheckout(true)
                  }}
                  className="w-full py-4 bg-[#d9ed99] text-[#20251b] rounded-lg font-bold text-sm hover:bg-[#e8f5b0] transition-colors flex items-center justify-center gap-6"
                >
                  Nastavi na podatke za dostavu
                  <ArrowRight size={16} />
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-[#303827] p-4 rounded-lg text-xs mb-4">
                    <p className="font-medium mb-1">Tvoj odabir:</p>
                    <p className="text-[#aeb5aa]">
                      {selections.slice(0, packSize).map(s => `${s.collection} / ${s.scent}`).join(" • ")}
                    </p>
                  </div>

                  {serverError && (
                    <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg text-sm">
                      {serverError}
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-[#aeb5aa] block mb-1.5">Ime i prezime *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-[#181c17] border rounded-md px-3 py-2.5 text-sm text-[#f4f1e9] focus:outline-none focus:border-[#d9ed99] ${errors.name ? "border-red-500" : "border-[#505749]"}`}
                      disabled={loading}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[#aeb5aa] block mb-1.5">Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+387 XX XXX XXX"
                      className={`w-full bg-[#181c17] border rounded-md px-3 py-2.5 text-sm text-[#f4f1e9] focus:outline-none focus:border-[#d9ed99] ${errors.phone ? "border-red-500" : "border-[#505749]"}`}
                      disabled={loading}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[#aeb5aa] block mb-1.5">Ulica i broj *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full bg-[#181c17] border rounded-md px-3 py-2.5 text-sm text-[#f4f1e9] focus:outline-none focus:border-[#d9ed99] ${errors.address ? "border-red-500" : "border-[#505749]"}`}
                      disabled={loading}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#aeb5aa] block mb-1.5">Grad *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full bg-[#181c17] border rounded-md px-3 py-2.5 text-sm text-[#f4f1e9] focus:outline-none focus:border-[#d9ed99] ${errors.city ? "border-red-500" : "border-[#505749]"}`}
                        disabled={loading}
                      />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-[#aeb5aa] block mb-1.5">Postanski broj</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-[#181c17] border border-[#505749] rounded-md px-3 py-2.5 text-sm text-[#f4f1e9] focus:outline-none focus:border-[#d9ed99]"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#d9ed99] text-[#20251b] rounded-lg font-bold text-sm hover:bg-[#e8f5b0] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Procesiranje...
                      </>
                    ) : (
                      <>
                        Potvrdite narudzbu — {total} KM
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[#aeb5aa]">
                    Placanje pouzecem · Isporuka 1-3 radna dana
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="pitanja" className="max-w-4xl mx-auto px-4 py-20">
          <p className="text-[#d9ed99] text-[11px] uppercase tracking-[0.25em] font-bold mb-3">Prije nego odaberes</p>
          <h2 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight mb-10">
            Jos nekoliko detalja.
          </h2>

          <div className="space-y-0">
            {[
              {
                q: "Mogu li kombinovati razlicite kolekcije i mirise?",
                a: "Da. Za svaki komad u paketu odaberi Signature ili Luxury kolekciju, a zatim Million Miles, Citrus ili Joyful Bloom."
              },
              {
                q: "Koliko placam s dostavom?",
                a: "Jedan miris s dostavom iznosi 35 KM, dva 55 KM, a tri 75 KM. Dostava je 10 KM po narudzbi i vec je ukljucena u prikaz ukupnog iznosa."
              },
              {
                q: "Kako placam i kada paket stize?",
                a: "Placas pouzecem, prilikom preuzimanja. Dostava sirom Bosne i Hercegovine traje 1-3 radna dana."
              },
              {
                q: "Odgovara li mojoj ventilaciji?",
                a: "Mirisi se postavljaju na ventilacioni otvor. Ako nisi siguran odgovara li oblik tvoje ventilacije, javi nam model automobila prije narucivanja na +387 61 577 576."
              },
              {
                q: "Mogu li narudzbu preuzeti u Tuzli?",
                a: "Licno preuzimanje u Tuzli moguce je uz prethodni dogovor. Za tu opciju kontaktiraj nas prije narucivanja na +387 61 577 576."
              },
            ].map((faq, i) => (
              <details key={i} className="border-b border-[#373d34] py-5 group">
                <summary className="flex justify-between items-center cursor-pointer list-none text-base font-medium">
                  {faq.q}
                  <span className="text-[#d9ed99] text-xl group-open:hidden">+</span>
                  <span className="text-[#d9ed99] text-xl hidden group-open:inline">−</span>
                </summary>
                <p className="mt-4 text-sm text-[#aeb5aa] max-w-2xl">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#373d34] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#aeb5aa]">
          <div>
            <span className="text-xl font-bold text-[#f4f1e9]">GlossDrive<span className="text-[#d9ed99]">.</span></span>
            <span className="ml-4">autokozmetika.ba · Tuzla, BiH</span>
          </div>
          <div className="flex gap-4">
            <a href="tel:+38761577576" className="hover:text-[#f4f1e9] transition-colors">+387 61 577 576</a>
            <span>·</span>
            <Link href="/dostava" className="hover:text-[#f4f1e9] transition-colors">Dostava i placanje</Link>
            <span>·</span>
            <Link href="/" className="hover:text-[#f4f1e9] transition-colors">Posjeti webshop</Link>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#161a16]/95 border-t border-[#414735] backdrop-blur-md z-50 py-3">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">{packSize} {packSize === 1 ? "miris" : "mirisa"} · {subtotal} KM</p>
            <p className="text-xs text-[#aeb5aa]">Ukupno s dostavom: {total} KM</p>
          </div>
          <a
            href="#naruci"
            className="px-6 py-3 bg-[#d9ed99] text-[#20251b] rounded-lg font-bold text-sm hover:bg-[#e8f5b0] transition-colors"
          >
            Odaberi paket
          </a>
        </div>
      </div>
    </div>
  )
}
