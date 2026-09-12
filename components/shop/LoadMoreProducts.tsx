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
        <div className="mt-10 text-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-900 to-neutral-950 text-amber-100 rounded-full font-bold hover:from-amber-800 hover:to-amber-950 transition shadow-lg shadow-amber-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Učitavanje...
              </>
            ) : (
              "Učitaj više"
            )}
          </button>
        </div>
      )}
    </div>
  )
}
