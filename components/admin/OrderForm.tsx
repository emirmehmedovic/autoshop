"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { SHIPPING_COST } from "@/lib/shipping"

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED"

interface ProductOptionValue {
  id: string
  value: string
  priceModifier: number
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
  sku: string
  price: number
  stock: number
  options: ProductOption[]
}

interface OrderItemForm {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  selectedOptions: { name: string; value: string; price: number }[]
  optionValueIds: Record<string, string>
}

interface InitialOrderData {
  id: string
  orderNumber: string
  shippingName: string
  guestEmail: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingNote: string
  status: OrderStatus
  isPaid: boolean
  shippingCost: number
  discount: number
  items: OrderItemForm[]
}

interface OrderFormProps {
  products: Product[]
  initialData?: InitialOrderData
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Na čekanju" },
  { value: "CONFIRMED", label: "Potvrđena" },
  { value: "PROCESSING", label: "U pripremi" },
  { value: "SHIPPED", label: "Poslana" },
  { value: "DELIVERED", label: "Dostavljena" },
  { value: "CANCELLED", label: "Otkazana" },
  { value: "RETURNED", label: "Vraćena" },
]

function makeRow(product?: Product): OrderItemForm {
  const selectedProduct = product
  const optionValueIds: Record<string, string> = {}
  const selectedOptions: { name: string; value: string; price: number }[] = []

  selectedProduct?.options.forEach((option) => {
    const firstValue = option.values.find((value) => value.isAvailable)
    if (firstValue) {
      optionValueIds[option.id] = firstValue.id
      selectedOptions.push({
        name: option.name,
        value: firstValue.value,
        price: firstValue.priceModifier,
      })
    }
  })

  const optionTotal = selectedOptions.reduce((sum, option) => sum + option.price, 0)

  return {
    id: crypto.randomUUID(),
    productId: selectedProduct?.id || "",
    quantity: 1,
    unitPrice: (selectedProduct?.price || 0) + optionTotal,
    selectedOptions,
    optionValueIds,
  }
}

export function OrderForm({ products, initialData }: OrderFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    shippingName: initialData?.shippingName || "",
    guestEmail: initialData?.guestEmail || "",
    shippingPhone: initialData?.shippingPhone || "",
    shippingAddress: initialData?.shippingAddress || "",
    shippingCity: initialData?.shippingCity || "",
    shippingZip: initialData?.shippingZip || "",
    shippingNote: initialData?.shippingNote || "",
    status: initialData?.status || "PENDING",
    isPaid: initialData?.isPaid || false,
    shippingCost: initialData?.shippingCost ?? SHIPPING_COST,
    discount: initialData?.discount || 0,
  })
  const [items, setItems] = useState<OrderItemForm[]>(
    initialData?.items.length ? initialData.items : [makeRow(products[0])]
  )

  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products])
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const total = Math.max(0, subtotal + formData.shippingCost - formData.discount)

  const updateItemProduct = (rowId: string, productId: string) => {
    const product = productMap.get(productId)
    setItems((current) => current.map((item) => (item.id === rowId ? makeRow(product) : item)))
  }

  const updateItemOption = (rowId: string, optionId: string, valueId: string) => {
    setItems((current) => current.map((item) => {
      if (item.id !== rowId) return item
      const product = productMap.get(item.productId)
      if (!product) return item

      const optionValueIds = { ...item.optionValueIds, [optionId]: valueId }
      const selectedOptions = product.options.flatMap((option) => {
        const selectedValue = option.values.find((value) => value.id === optionValueIds[option.id])
        return selectedValue
          ? [{ name: option.name, value: selectedValue.value, price: selectedValue.priceModifier }]
          : []
      })
      const optionTotal = selectedOptions.reduce((sum, option) => sum + option.price, 0)

      return {
        ...item,
        optionValueIds,
        selectedOptions,
        unitPrice: product.price + optionTotal,
      }
    }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      ...formData,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        selectedOptions: item.selectedOptions,
      })),
    }

    const response = await fetch(initialData ? `/api/admin/orders/${initialData.id}` : "/api/admin/orders", {
      method: initialData ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    setSaving(false)

    if (!response.ok) {
      setError(data.error || "Greška pri čuvanju narudžbe")
      return
    }

    router.push(`/admin/orders/${data.order.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Podaci kupca</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-200 px-4 py-3" placeholder="Ime i prezime" value={formData.shippingName} onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })} required />
            <input className="rounded-xl border border-gray-200 px-4 py-3" placeholder="Email" type="email" value={formData.guestEmail} onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })} required />
            <input className="rounded-xl border border-gray-200 px-4 py-3" placeholder="Telefon" value={formData.shippingPhone} onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })} required />
            <input className="rounded-xl border border-gray-200 px-4 py-3" placeholder="Grad" value={formData.shippingCity} onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })} required />
            <input className="rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2" placeholder="Adresa" value={formData.shippingAddress} onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })} required />
            <input className="rounded-xl border border-gray-200 px-4 py-3" placeholder="Poštanski broj" value={formData.shippingZip} onChange={(e) => setFormData({ ...formData, shippingZip: e.target.value })} />
            <textarea className="rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2" placeholder="Napomena" rows={3} value={formData.shippingNote} onChange={(e) => setFormData({ ...formData, shippingNote: e.target.value })} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Status i total</h2>
          <div className="space-y-4">
            <select className="w-full rounded-xl border border-gray-200 px-4 py-3" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}>
              {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.isPaid} onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })} />
              Plaćeno
            </label>
            <input className="w-full rounded-xl border border-gray-200 px-4 py-3" type="number" step="0.01" min="0" value={formData.shippingCost} onChange={(e) => setFormData({ ...formData, shippingCost: Number(e.target.value) || 0 })} placeholder="Dostava" />
            <input className="w-full rounded-xl border border-gray-200 px-4 py-3" type="number" step="0.01" min="0" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })} placeholder="Popust" />
            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <div className="flex justify-between"><span>Međuzbroj</span><strong>{subtotal.toFixed(2)} KM</strong></div>
              <div className="flex justify-between"><span>Dostava</span><strong>{formData.shippingCost.toFixed(2)} KM</strong></div>
              <div className="flex justify-between"><span>Popust</span><strong>-{formData.discount.toFixed(2)} KM</strong></div>
              <div className="mt-2 border-t pt-2 flex justify-between text-lg"><span>Ukupno</span><strong>{total.toFixed(2)} KM</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Proizvodi</h2>
          <button type="button" onClick={() => setItems([...items, makeRow(products[0])])} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
            <Plus size={18} /> Dodaj proizvod
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const product = productMap.get(item.productId)
            return (
              <div key={item.id} className="rounded-xl border border-gray-200 p-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_110px_130px_44px]">
                  <select className="rounded-xl border border-gray-200 px-3 py-2" value={item.productId} onChange={(e) => updateItemProduct(item.id, e.target.value)} required>
                    {products.map((productOption) => (
                      <option key={productOption.id} value={productOption.id}>{productOption.name} ({productOption.sku})</option>
                    ))}
                  </select>
                  <input className="rounded-xl border border-gray-200 px-3 py-2" type="number" min="1" value={item.quantity} onChange={(e) => setItems((current) => current.map((row) => row.id === item.id ? { ...row, quantity: Math.max(1, Number(e.target.value) || 1) } : row))} />
                  <input className="rounded-xl border border-gray-200 px-3 py-2" type="number" step="0.01" min="0" value={item.unitPrice} onChange={(e) => setItems((current) => current.map((row) => row.id === item.id ? { ...row, unitPrice: Number(e.target.value) || 0 } : row))} />
                  <button type="button" onClick={() => setItems((current) => current.length > 1 ? current.filter((row) => row.id !== item.id) : current)} className="rounded-xl text-red-500 hover:bg-red-50 flex items-center justify-center">
                    <Trash2 size={18} />
                  </button>
                </div>

                {product && product.options.length > 0 && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {product.options.map((option) => (
                      <label key={option.id} className="text-sm font-medium text-gray-700">
                        {option.name}
                        <select className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2" value={item.optionValueIds[option.id] || ""} onChange={(e) => updateItemOption(item.id, option.id, e.target.value)}>
                          {option.values.filter((value) => value.isAvailable).map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.value}{value.priceModifier !== 0 ? ` (${value.priceModifier > 0 ? "+" : ""}${value.priceModifier.toFixed(2)} KM)` : ""}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.push("/admin/orders")} className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">
          Odustani
        </button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          {saving && <Loader2 size={18} className="animate-spin" />}
          Sačuvaj narudžbu
        </button>
      </div>
    </form>
  )
}
