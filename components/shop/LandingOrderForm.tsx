"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Minus, Plus, Check, ShoppingBag } from "lucide-react"
import { z } from "zod"

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

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: { url: string }[]
  options: ProductOption[]
}

interface LandingOrderFormProps {
  product: Product
}

const orderSchema = z.object({
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Neispravna email adresa"),
  phone: z.string().min(6, "Telefon mora imati najmanje 6 karaktera"),
  address: z.string().min(5, "Adresa mora imati najmanje 5 karaktera"),
  city: z.string().min(2, "Grad mora biti naveden"),
  zip: z.string().optional(),
  note: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

export function LandingOrderForm({ product }: LandingOrderFormProps) {
  const router = useRouter()

  // Initialize selected options with defaults
  const getDefaultOptions = () => {
    const defaults: Record<string, string> = {}
    product.options.forEach((option) => {
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
  const [quantity, setQuantity] = useState(1)

  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    note: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  // Calculate total price including option modifiers
  const calculateTotal = () => {
    let total = product.price
    product.options.forEach((option) => {
      const selectedValueId = selectedOptions[option.id]
      const selectedValue = option.values.find((v) => v.id === selectedValueId)
      if (selectedValue) {
        total += selectedValue.priceModifier
      }
    })
    return total * quantity
  }

  const unitPrice = (() => {
    let price = product.price
    product.options.forEach((option) => {
      const selectedValueId = selectedOptions[option.id]
      const selectedValue = option.values.find((v) => v.id === selectedValueId)
      if (selectedValue) {
        price += selectedValue.priceModifier
      }
    })
    return price
  })()

  const total = calculateTotal()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof OrderFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setServerError("")

    const result = orderSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof OrderFormData, string>> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof OrderFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      // Build selected options array for the order
      const selectedOptionsArray = product.options.map((option) => {
        const selectedValueId = selectedOptions[option.id]
        const selectedValue = option.values.find((v) => v.id === selectedValueId)
        return {
          name: option.name,
          value: selectedValue?.value || "",
          price: selectedValue?.priceModifier || 0,
        }
      })

      // Build product name with options
      const optionsSuffix = selectedOptionsArray.map((o) => o.value).join(", ")
      const fullProductName = optionsSuffix ? `${product.name} - ${optionsSuffix}` : product.name

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              quantity: quantity,
              unitPrice: unitPrice,
              selectedOptions: selectedOptionsArray,
            },
          ],
          shippingInfo: formData,
          source: "landing-page",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Greška pri kreiranju narudžbe")
      }

      router.push(`/order/${data.orderId}`)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Došlo je do greške"
      setServerError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Get selected option value name for display
  const getSelectedValueName = (option: ProductOption) => {
    const selectedValueId = selectedOptions[option.id]
    const selectedValue = option.values.find((v) => v.id === selectedValueId)
    return selectedValue?.value || ""
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product Options */}
      {product.options.map((option) => (
        <div key={option.id}>
          <label className="block text-sm font-semibold text-amber-900 mb-3">
            {option.name} {option.isRequired && "*"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {option.values
              .filter((v) => v.isAvailable)
              .map((value) => (
                <button
                  key={value.id}
                  type="button"
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, [option.id]: value.id }))
                  }
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedOptions[option.id] === value.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-amber-200/50 bg-white hover:border-amber-300"
                  }`}
                >
                  {selectedOptions[option.id] === value.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <p className="font-medium text-amber-950">{value.value}</p>
                  {value.priceModifier !== 0 && (
                    <p className="text-sm text-amber-600">
                      {value.priceModifier > 0 ? "+" : ""}
                      {value.priceModifier.toFixed(2)} KM
                    </p>
                  )}
                </button>
              ))}
          </div>
        </div>
      ))}

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-amber-900 mb-3">Količina</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-amber-200/50 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 hover:bg-amber-50 transition-colors text-amber-700"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-6 py-3 font-semibold text-amber-950 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-3 hover:bg-amber-50 transition-colors text-amber-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-700/60">Ukupno</p>
            <p className="text-2xl font-light text-amber-950">{total.toFixed(2)} KM</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-amber-200/50" />

      {/* Shipping Info */}
      <div>
        <h3 className="text-lg font-semibold text-amber-950 mb-4">Podaci za dostavu</h3>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-2">
              Ime i prezime *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                errors.name ? "border-red-400" : "border-amber-200/50"
              }`}
              disabled={loading}
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                  errors.email ? "border-red-400" : "border-amber-200/50"
                }`}
                disabled={loading}
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-amber-800 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+387 XX XXX XXX"
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                  errors.phone ? "border-red-400" : "border-amber-200/50"
                }`}
                disabled={loading}
              />
              {errors.phone && <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-amber-800 mb-2">
              Adresa *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Ulica i broj"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                errors.address ? "border-red-400" : "border-amber-200/50"
              }`}
              disabled={loading}
            />
            {errors.address && <p className="mt-1.5 text-sm text-red-500">{errors.address}</p>}
          </div>

          {/* City & Zip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-amber-800 mb-2">
                Grad *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                  errors.city ? "border-red-400" : "border-amber-200/50"
                }`}
                disabled={loading}
              />
              {errors.city && <p className="mt-1.5 text-sm text-red-500">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-amber-800 mb-2">
                Poštanski broj
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border-2 border-amber-200/50 rounded-xl text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-amber-800 mb-2">
              Napomena (opciono)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={2}
              placeholder="Dodatne napomene za dostavu..."
              className="w-full px-4 py-3 bg-white border-2 border-amber-200/50 rounded-xl text-amber-950 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="bg-gradient-to-br from-amber-100/80 to-amber-50/60 rounded-xl p-4 border border-amber-200/50">
        <p className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
          <ShoppingBag className="text-amber-600" size={18} />
          Plaćanje pouzećem
        </p>
        <p className="text-sm text-amber-700/70">
          Platite gotovinom prilikom preuzimanja paketa.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-amber-900/20"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Procesiranje...
          </>
        ) : (
          <>Naruči - {total.toFixed(2)} KM</>
        )}
      </button>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-amber-700/60 pt-2">
        <div className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-amber-600" />
          <span>Dostava 1-3 dana</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-amber-600" />
          <span>Besplatna dostava</span>
        </div>
      </div>
    </form>
  )
}
