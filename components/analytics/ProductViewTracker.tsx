"use client"

import { useEffect } from "react"
import { trackViewContent } from "@/lib/analytics/meta-pixel"

interface ProductViewTrackerProps {
  product: {
    id: string
    name: string
    price: number
    category: {
      name: string
    }
  }
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category.name,
    })
  }, [product.id, product.name, product.price, product.category.name])

  return null
}
