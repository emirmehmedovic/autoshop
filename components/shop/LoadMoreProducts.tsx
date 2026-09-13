"use client"

import { useState, useTransition } from "react"
import { ProductCard } from "./ProductCard"
import { Loader2 } from "lucide-react"
import { getMoreProducts } from "@/app/actions/products"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  stock: number
  shortDesc: string | null
  category: {
    name: string
    slug: string
  }
  images: {
    url: string
    alt: string | null
  }[]
}

interface LoadMoreProductsProps {
  initialProducts: Product[]
  initialOffset: number
}

export function LoadMoreProducts({ initialProducts, initialOffset }: LoadMoreProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [offset, setOffset] = useState(initialOffset)
  const [hasMore, setHasMore] = useState(true)
  const [isPending, startTransition] = useTransition()

  const loadMore = () => {
    startTransition(async () => {
      const newProducts = await getMoreProducts(offset, 10)
      if (newProducts.length < 10) {
        setHasMore(false)
      }
      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts])
        setOffset((prev) => prev + newProducts.length)
      }
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="group inline-flex items-center gap-3 pl-7 pr-3 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-xl shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Učitavanje...</span>
              </>
            ) : (
              <>
                <span>Učitaj više</span>
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 group-hover:bg-amber-500 transition-colors duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
