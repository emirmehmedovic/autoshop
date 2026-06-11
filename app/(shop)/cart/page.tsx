"use client"

import { useCartStore } from "@/lib/store/cartStore"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()

  const total = getTotalPrice()
  const itemCount = getTotalItems()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-16 text-center">
            <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-16 w-16 text-lime-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Vaša korpa je prazna</h1>
            <p className="text-gray-400 mb-8 text-lg">
              Dodajte proizvode u korpu da biste nastavili sa kupovinom
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-lime-400 text-slate-900 rounded-xl font-bold hover:bg-lime-300 transition shadow-lg shadow-lime-400/20"
            >
              Pregledaj proizvode
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-10 bg-lime-400 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-white">Korpa</h1>
              <p className="text-gray-400">{itemCount} {itemCount === 1 ? 'proizvod' : 'proizvoda'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista proizvoda */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4 hover:border-lime-400/30 transition"
              >
                <div className="flex gap-4">
                  {/* Slika */}
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 bg-slate-700/30 rounded-xl overflow-hidden border border-white/10">
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
                      <h3 className="font-bold text-white hover:text-lime-400 transition line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-lime-400 mt-2">
                      {item.price.toFixed(2)} KM
                    </p>

                    {/* Kontrole količine - Desktop */}
                    <div className="hidden sm:flex items-center gap-4 mt-3">
                      <div className="flex items-center backdrop-blur-sm bg-slate-700/30 border border-white/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-lime-400/20 transition text-gray-300 hover:text-white"
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
                          className="w-12 text-center bg-transparent py-2 text-white focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2 hover:bg-lime-400/20 transition disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white"
                          aria-label="Povećaj količinu"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-400 hover:text-red-300 transition flex items-center gap-1 font-medium"
                      >
                        <Trash2 size={18} />
                        <span>Ukloni</span>
                      </button>
                    </div>
                  </div>

                  {/* Ukupna cijena za stavku */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-white">
                      {(item.price * item.quantity).toFixed(2)} KM
                    </p>
                    {item.quantity >= item.stock && (
                      <p className="text-xs text-orange-400 mt-1 font-medium">Maksimalna zaliha</p>
                    )}
                  </div>
                </div>

                {/* Kontrole količine - Mobile */}
                <div className="sm:hidden flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center backdrop-blur-sm bg-slate-700/30 border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-lime-400/20 transition text-gray-300"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-white font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-lime-400/20 transition disabled:opacity-30 text-gray-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sažetak narudžbe */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-1 h-6 bg-lime-400 rounded-full mr-3" />
                Sažetak narudžbe
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Proizvodi ({itemCount}):</span>
                  <span className="font-semibold">{total.toFixed(2)} KM</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Dostava:</span>
                  <span className="text-lime-400 font-bold">Besplatna</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Ukupno:</span>
                  <span className="text-3xl font-bold text-white">{total.toFixed(2)} <span className="text-lime-400">KM</span></span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center py-4 px-6 bg-lime-400 text-slate-900 rounded-xl font-bold hover:bg-lime-300 transition shadow-lg shadow-lime-400/20 mb-4"
              >
                Nastavi na plaćanje
                <ArrowRight className="ml-2" size={20} />
              </Link>

              <Link
                href="/shop"
                className="block text-center text-lime-400 hover:text-lime-300 transition font-medium"
              >
                Nastavi sa kupovinom
              </Link>

              {/* Info o plaćanju */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 bg-lime-400/10 rounded-lg border border-lime-400/20">
                    <Shield className="text-lime-400" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Plaćanje pouzećem</p>
                    <p className="text-gray-400">Platite prilikom preuzimanja paketa. Brza dostava širom BiH za 1-3 radna dana.</p>
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
