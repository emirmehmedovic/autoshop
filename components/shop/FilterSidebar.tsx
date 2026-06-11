"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Filter, X } from "lucide-react"

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
      {/* Kategorije - Glassmorphism */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-5">
          <Filter className="text-lime-400" size={20} />
          <h3 className="font-bold text-white text-lg">Kategorije</h3>
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              href="/shop"
              className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                !selectedCategory
                  ? "bg-lime-400 text-slate-900 font-bold shadow-lg shadow-lime-400/20"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
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
                    ? "bg-lime-400 text-slate-900 font-bold shadow-lg shadow-lime-400/20"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedCategory === category.slug
                      ? "bg-slate-900/20"
                      : "bg-white/10"
                  }`}>
                    {category._count.products}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Cijena - Glassmorphism */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-5">Cijena (KM)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">Od</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">Do</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
            />
          </div>
          <button
            onClick={handlePriceFilter}
            className="w-full py-3 px-4 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
          >
            Primijeni filter
          </button>
        </div>
      </div>

      {/* Očisti filtere */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-3 px-4 backdrop-blur-md bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition font-semibold flex items-center justify-center space-x-2"
        >
          <X size={18} />
          <span>Očisti sve filtere</span>
        </button>
      )}
    </div>
  )
}
