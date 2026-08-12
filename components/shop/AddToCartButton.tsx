"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { useCartStore } from "@/lib/store/cartStore"
import { trackAddToCart } from "@/lib/analytics/meta-pixel"

interface ProductOptionValue {
  id: string
  value: string
  priceModifier: number
  isDefault: boolean
  isAvailable: boolean
}

interface ProductOption {
  id: string
  name: string
  isRequired: boolean
  values: ProductOptionValue[]
}

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    images: { url: string; alt: string | null }[]
    options?: ProductOption[]
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  // Initialize selected options with defaults
  const getDefaultOptions = () => {
    const defaults: Record<string, string> = {}
    product.options?.forEach((option) => {
      const defaultValue = option.values.find((v) => v.isDefault && v.isAvailable)
      const firstAvailable = option.values.find((v) => v.isAvailable)
      if (defaultValue) {
        defaults[option.id] = defaultValue.id
      } else if (firstAvailable) {
        defaults[option.id] = firstAvailable.id
      }
    })
    return defaults
  }

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(getDefaultOptions())

  // Calculate total price including option modifiers
  const calculateTotalPrice = () => {
    let total = product.price
    product.options?.forEach((option) => {
      const selectedValueId = selectedOptions[option.id]
      const selectedValue = option.values.find((v) => v.id === selectedValueId)
      if (selectedValue) {
        total += selectedValue.priceModifier
      }
    })
    return total
  }

  const totalPrice = calculateTotalPrice()

  const handleAddToCart = () => {
    if (product.stock === 0) return

    // Build selected options array for the cart
    const selectedOptionsArray = product.options?.map((option) => {
      const selectedValueId = selectedOptions[option.id]
      const selectedValue = option.values.find((v) => v.id === selectedValueId)
      return {
        name: option.name,
        value: selectedValue?.value || "",
        price: selectedValue?.priceModifier || 0,
      }
    }) || []

    // Build product name with options
    const optionsSuffix = selectedOptionsArray.map((o) => o.value).filter(Boolean).join(", ")
    const fullProductName = optionsSuffix ? `${product.name} - ${optionsSuffix}` : product.name

    addItem(
      {
        productId: product.id,
        name: fullProductName,
        slug: product.slug,
        price: totalPrice,
        stock: product.stock,
        image: product.images[0]?.url || "/placeholder-product.svg",
        selectedOptions: selectedOptionsArray.length > 0 ? selectedOptionsArray : undefined,
      },
      quantity
    )

    // Meta Pixel tracking
    trackAddToCart({
      id: product.id,
      name: fullProductName,
      price: totalPrice,
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
        className="w-full py-4 px-6 bg-gray-200/80 text-gray-500 rounded-full font-semibold cursor-not-allowed backdrop-blur-sm"
      >
        Rasprodato
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Opcije proizvoda */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-4">
          {product.options.map((option) => (
            <div key={option.id}>
              <label className="block font-medium text-gray-700 mb-2">
                {option.name} {option.isRequired && <span className="text-red-500">*</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {option.values
                  .filter((v) => v.isAvailable)
                  .map((value) => (
                    <button
                      key={value.id}
                      type="button"
                      onClick={() =>
                        setSelectedOptions((prev) => ({ ...prev, [option.id]: value.id }))
                      }
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                        selectedOptions[option.id] === value.id
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-200 bg-white/80 text-gray-700 hover:border-orange-300"
                      }`}
                    >
                      {value.value}
                      {value.priceModifier !== 0 && (
                        <span className="ml-1 text-xs text-gray-500">
                          ({value.priceModifier > 0 ? "+" : ""}{value.priceModifier.toFixed(2)} KM)
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Količina */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700">Količina:</label>
        <div className="flex items-center border border-white/60 bg-white/80 backdrop-blur-sm rounded-full overflow-hidden shadow-sm">
          <button
            onClick={decreaseQuantity}
            className="p-3 hover:bg-gray-100/80 transition"
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
            className="w-16 text-center py-3 focus:outline-none bg-transparent"
          />
          <button
            onClick={increaseQuantity}
            className="p-3 hover:bg-gray-100/80 transition"
            aria-label="Povećaj količinu"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Dodaj u korpu dugme */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-4 px-6 rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
          justAdded
            ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30"
            : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30"
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
