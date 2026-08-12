"use client"

import { useCartStore } from "@/lib/store/cartStore"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield } from "lucide-react"
import { SHIPPING_COST } from "@/lib/shipping"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()

  const subtotal = getTotalPrice()
  const total = subtotal + SHIPPING_COST
  const itemCount = getTotalItems()

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-2xl p-16 text-center backdrop-blur-xl bg-gradient-to-br from-gray-100/80 via-white/70 to-gray-50/80 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 border border-white/50">
                <ShoppingBag className="h-16 w-16 text-orange-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Vaša korpa je prazna</h1>
              <p className="text-gray-600 mb-8 text-lg">
                Dodajte proizvode u korpu da biste nastavili sa kupovinom
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/30"
              >
                Pregledaj proizvode
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-6 mb-8 backdrop-blur-xl bg-gradient-to-br from-gray-100/80 via-white/70 to-gray-50/80 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative flex items-center space-x-3">
            <div className="w-1 h-10 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Korpa</h1>
              <p className="text-gray-600">{itemCount} {itemCount === 1 ? 'proizvod' : 'proizvoda'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista proizvoda */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              // Create unique key including selected options
              const optionsKey = item.selectedOptions
                ? item.selectedOptions.map(o => `${o.name}:${o.value}`).join("-")
                : ""
              const uniqueKey = `${item.productId}-${optionsKey}-${index}`

              return (
              <div
                key={uniqueKey}
                className="relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition"
              >
                <div className="flex gap-4">
                  {/* Slika */}
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Detalji */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-bold text-gray-900 hover:text-orange-500 transition line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-orange-500 mt-2">
                      {item.price.toFixed(2)} KM
                    </p>

                    {/* Kontrole količine - Desktop */}
                    <div className="hidden sm:flex items-center gap-4 mt-3">
                      <div className="flex items-center bg-white/80 border border-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-200 transition text-gray-600 hover:text-gray-900"
                          aria-label="Smanji količinu"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1
                            updateQuantity(item.productId, Math.min(Math.max(1, val), item.stock))
                          }}
                          className="w-12 text-center bg-transparent py-2 text-gray-900 focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2 hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
                          aria-label="Povećaj količinu"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-600 transition flex items-center gap-1 font-medium"
                      >
                        <Trash2 size={18} />
                        <span>Ukloni</span>
                      </button>
                    </div>
                  </div>

                  {/* Ukupna cijena za stavku */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} KM
                    </p>
                    {item.quantity >= item.stock && (
                      <p className="text-xs text-orange-500 mt-1 font-medium">Maksimalna zaliha</p>
                    )}
                  </div>
                </div>

                {/* Kontrole količine - Mobile */}
                <div className="sm:hidden flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                  <div className="flex items-center bg-white/80 border border-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-gray-200 transition text-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-gray-200 transition disabled:opacity-30 text-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )})}
          </div>

          {/* Sažetak narudžbe */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl p-6 sticky top-24 backdrop-blur-xl bg-gradient-to-br from-gray-100/80 via-white/70 to-gray-50/80 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
              <div className="relative">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-3 shadow-lg shadow-orange-500/30" />
                  Sažetak narudžbe
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Proizvodi ({itemCount}):</span>
                    <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} KM</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Dostava:</span>
                    <span className="font-bold text-gray-900">{SHIPPING_COST.toFixed(2)} KM</span>
                  </div>
                  <div className="border-t border-gray-200/50 pt-4 flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Ukupno:</span>
                    <span className="text-3xl font-bold text-gray-900">{total.toFixed(2)} <span className="text-orange-500">KM</span></span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/30 mb-4"
                >
                  Nastavi na plaćanje
                  <ArrowRight className="ml-2" size={20} />
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-orange-500 hover:text-orange-600 transition font-medium"
                >
                  Nastavi sa kupovinom
                </Link>

                {/* Info o plaćanju */}
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl border border-white/50 shadow-sm">
                      <Shield className="text-orange-500" size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Plaćanje pouzećem</p>
                      <p className="text-gray-600">Platite prilikom preuzimanja paketa. Brza dostava širom BiH za 1-3 radna dana.</p>
                    </div>
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
