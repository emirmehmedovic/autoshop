"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { useCartStore } from "@/lib/store/cartStore"
import { trackAddToCart } from "@/lib/analytics/meta-pixel"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    images: { url: string; alt: string | null }[]
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (product.stock === 0) return

    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        image: product.images[0]?.url || "/placeholder-product.svg",
      },
      quantity
    )

    // Meta Pixel tracking
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    })

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1))
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-4 px-6 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
      >
        Rasprodato
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Količina */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700">Količina:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decreaseQuantity}
            className="p-3 hover:bg-gray-100 transition"
            aria-label="Smanji količinu"
          >
            <Minus size={18} />
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1
              setQuantity(Math.min(Math.max(1, val), product.stock))
            }}
            className="w-16 text-center border-x border-gray-300 py-3 focus:outline-none"
          />
          <button
            onClick={increaseQuantity}
            className="p-3 hover:bg-gray-100 transition"
            aria-label="Povećaj količinu"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Dodaj u korpu dugme */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition flex items-center justify-center gap-3 ${
          justAdded
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {justAdded ? (
          <>
            <Check size={24} />
            Dodato u korpu
          </>
        ) : (
          <>
            <ShoppingCart size={24} />
            Dodaj u korpu
          </>
        )}
      </button>
    </div>
  )
}
