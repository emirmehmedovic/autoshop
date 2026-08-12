"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronDown, Filter, X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface FilterSidebarProps {
  categories: Category[]
  selectedCategory?: string
  minPrice?: string
  maxPrice?: string
}

export function FilterSidebar({
  categories,
  selectedCategory,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
}: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState(initialMinPrice || "")
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || "")
  const [showMobileCategories, setShowMobileCategories] = useState(false)

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (minPrice) {
      params.set("minPrice", minPrice)
    } else {
      params.delete("minPrice")
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice)
    } else {
      params.delete("maxPrice")
    }

    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    router.push("/shop")
  }

  const hasFilters = selectedCategory || minPrice || maxPrice

  return (
    <div className="space-y-6">
      {/* Kategorije */}
      <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/70 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Filter className="text-white" size={18} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Kategorije</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowMobileCategories((isOpen) => !isOpen)}
              aria-expanded={showMobileCategories}
              aria-controls="mobile-category-list"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-gray-700 shadow-sm transition hover:bg-white"
            >
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${showMobileCategories ? "rotate-180" : ""}`}
              />
              <span className="sr-only">
                {showMobileCategories ? "Sakrij kategorije" : "Prikaži kategorije"}
              </span>
            </button>
          </div>
          <ul
            id="mobile-category-list"
            className={`${showMobileCategories ? "block" : "hidden"} space-y-2 lg:block`}
          >
            <li>
              <Link
                href="/shop"
                className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                  !selectedCategory
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/30"
                    : "text-gray-700 hover:bg-white/60 backdrop-blur-sm"
                }`}
              >
                Sve kategorije
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.slug
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/30"
                      : "text-gray-700 hover:bg-white/60 backdrop-blur-sm"
                  }`}
                >
                  <span className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      selectedCategory === category.slug
                        ? "bg-white/25"
                        : "bg-gray-200/80"
                    }`}>
                      {category._count.products}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cijena */}
      <div className="hidden lg:block relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/70 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        <div className="relative">
          <h3 className="font-bold text-gray-900 text-lg mb-5">Cijena (KM)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-medium">Od</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-white/80 border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition backdrop-blur-sm shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-medium">Do</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-3 bg-white/80 border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition backdrop-blur-sm shadow-sm"
              />
            </div>
            <button
              onClick={handlePriceFilter}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition font-bold shadow-lg shadow-orange-500/30"
            >
              Primijeni filter
            </button>
          </div>
        </div>
      </div>

      {/* Očisti filtere */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-3 px-4 backdrop-blur-xl bg-red-50/80 border border-red-200/50 rounded-xl text-red-600 hover:bg-red-100/80 transition font-semibold flex items-center justify-center space-x-2 shadow-sm"
        >
          <X size={18} />
          <span>Očisti sve filtere</span>
        </button>
      )}
    </div>
  )
}
