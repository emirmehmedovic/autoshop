"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Plus, Minus, Check, ArrowRight } from "lucide-react"
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
  const router = useRouter()
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

  const addSelectedProductToCart = () => {
    if (product.stock === 0) return false

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

    return true
  }

  const handleAddToCart = () => {
    if (!addSelectedProductToCart()) return

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!addSelectedProductToCart()) return

    router.push("/checkout")
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
              <label className="block font-medium text-amber-950/75 mb-2">
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
                          ? "border-amber-800 bg-amber-50 text-amber-900 shadow-sm shadow-amber-950/10"
                          : "border-amber-100 bg-white/80 text-amber-950/70 hover:border-amber-400"
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
        <label className="font-medium text-amber-950/75">Količina:</label>
        <div className="flex items-center border border-amber-100/80 bg-white/80 backdrop-blur-sm rounded-full overflow-hidden shadow-sm">
          <button
            onClick={decreaseQuantity}
            className="p-3 text-amber-950 hover:bg-amber-50/80 transition"
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
            className="p-3 text-amber-950 hover:bg-amber-50/80 transition"
            aria-label="Povećaj količinu"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Akcije */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 px-6 rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
            justAdded
              ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30"
              : "bg-gradient-to-r from-amber-900 to-neutral-950 text-amber-100 hover:from-amber-800 hover:to-amber-950 shadow-lg shadow-amber-950/30"
          }`}
        >
          {justAdded ? (
            <>
              <Check size={22} />
              Dodato u korpu
            </>
          ) : (
            <>
              <ShoppingCart size={22} />
              Dodaj u korpu
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          className="w-full py-4 px-6 rounded-full border border-amber-800/30 bg-amber-50/80 text-amber-950 font-bold transition-all duration-300 flex items-center justify-center gap-3 hover:bg-amber-100 hover:border-amber-800/50 shadow-sm shadow-amber-950/10"
        >
          Naruči odmah
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  )
}
