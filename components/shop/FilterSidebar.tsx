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
    <div className="space-y-5">
      {/* Kategorije */}
      <div className="rounded-[1.5rem] p-1 bg-gradient-to-br from-violet-50/60 via-white/80 to-purple-50/40 ring-1 ring-violet-200/40 shadow-[0_4px_20px_rgba(139,92,246,0.06)]">
        <div className="rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                <Filter className="text-white" size={16} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-gray-900 tracking-tight">Kategorije</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowMobileCategories((isOpen) => !isOpen)}
              aria-expanded={showMobileCategories}
              aria-controls="mobile-category-list"
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition-all duration-300 hover:bg-stone-200 active:scale-95"
            >
              <ChevronDown
                size={18}
                className={`transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showMobileCategories ? "rotate-180" : ""}`}
              />
              <span className="sr-only">
                {showMobileCategories ? "Sakrij kategorije" : "Prikaži kategorije"}
              </span>
            </button>
          </div>
          <ul
            id="mobile-category-list"
            className={`${showMobileCategories ? "block" : "hidden"} space-y-1 lg:block`}
          >
            <li>
              <Link
                href="/shop"
                className={`block py-2.5 px-3 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] text-sm ${
                  !selectedCategory
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-md shadow-violet-500/25"
                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                Sve kategorije
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className={`block py-2.5 px-3 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] text-sm ${
                    selectedCategory === category.slug
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-md shadow-violet-500/25"
                      : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <span className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                      selectedCategory === category.slug
                        ? "bg-white/20 text-white"
                        : "bg-stone-100 text-stone-500"
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
      <div className="hidden lg:block rounded-[1.5rem] p-1 bg-gradient-to-br from-emerald-50/60 via-white/80 to-teal-50/40 ring-1 ring-emerald-200/40 shadow-[0_4px_20px_rgba(16,185,129,0.06)]">
        <div className="rounded-[calc(1.5rem-0.25rem)] bg-white/80 backdrop-blur-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 tracking-tight">Cijena (KM)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Od</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 bg-white border-0 ring-1 ring-emerald-200 rounded-lg text-gray-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Do</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2.5 bg-white border-0 ring-1 ring-emerald-200 rounded-lg text-gray-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              />
            </div>
            <button
              onClick={handlePriceFilter}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] font-medium text-sm shadow-md shadow-emerald-500/25 active:scale-[0.98]"
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
          className="w-full py-2.5 px-4 bg-rose-50 ring-1 ring-rose-200 rounded-xl text-rose-600 hover:bg-rose-100 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <X size={16} strokeWidth={1.5} />
          <span>Očisti sve filtere</span>
        </button>
      )}
    </div>
  )
}
