"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./ImageUpload"
import { Save, X } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface ProductImage {
  url: string
  alt: string
  sortOrder: number
}

interface ProductFormData {
  name: string
  description: string
  shortDesc: string
  sku: string
  price: number
  comparePrice: number | null
  stock: number
  lowStockAlert: number
  isActive: boolean
  isFeatured: boolean
  categoryId: string
  metaTitle: string
  metaDesc: string
  images: ProductImage[]
}

interface ProductFormProps {
  categories: Category[]
  initialData?: Partial<ProductFormData>
  productId?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function ProductForm({ categories, initialData, productId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    shortDesc: initialData?.shortDesc || "",
    sku: initialData?.sku || "",
    price: initialData?.price || 0,
    comparePrice: initialData?.comparePrice || null,
    stock: initialData?.stock || 0,
    lowStockAlert: initialData?.lowStockAlert || 5,
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    categoryId: initialData?.categoryId || "",
    metaTitle: initialData?.metaTitle || "",
    metaDesc: initialData?.metaDesc || "",
    images: initialData?.images || [],
  })

  // Auto-generate SKU from name
  useEffect(() => {
    if (!productId && formData.name && !formData.sku) {
      const autoSku = generateSlug(formData.name).toUpperCase()
      setFormData(prev => ({ ...prev, sku: autoSku }))
    }
  }, [formData.name, formData.sku, productId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      const numValue = value === "" ? 0 : parseFloat(value)
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Naziv mora imati najmanje 2 karaktera"
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Opis mora imati najmanje 10 karaktera"
    }
    if (!formData.sku) {
      newErrors.sku = "SKU je obavezan"
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Cijena mora biti veća od 0"
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Kategorija je obavezna"
    }
    if (formData.stock < 0) {
      newErrors.stock = "Zaliha ne može biti negativna"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      return
    }

    setLoading(true)

    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products"

      const method = productId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Greška pri čuvanju proizvoda")
      }

      // Success - redirect to products list
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Submit error:", error)
      alert(error instanceof Error ? error.message : "Greška pri čuvanju proizvoda")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Osnovne informacije</h2>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Naziv proizvoda *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="npr. Turtle Wax Premium Vosak"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-2">{errors.name}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="TW-PREM-001"
            />
            {errors.sku && (
              <p className="text-red-400 text-sm mt-2">{errors.sku}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Kratki opis
            </label>
            <input
              type="text"
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              maxLength={150}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="Kratak opis koji se prikazuje na kartici proizvoda"
            />
            <p className="text-gray-500 text-xs mt-1">
              {formData.shortDesc.length}/150 karaktera
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Detaljan opis *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition resize-none"
              placeholder="Detaljan opis proizvoda, karakteristike, način upotrebe..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Cijene</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Prodajna cijena (KM) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-400 text-sm mt-2">{errors.price}</p>
            )}
          </div>

          {/* Compare Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Prekrižena cijena (KM)
            </label>
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice || ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="0.00"
            />
            <p className="text-gray-500 text-xs mt-1">
              Prikazuje se kao stara cijena
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Zalihe</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Dostupna količina *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-red-400 text-sm mt-2">{errors.stock}</p>
            )}
          </div>

          {/* Low Stock Alert */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Upozorenje za niske zalihe
            </label>
            <input
              type="number"
              name="lowStockAlert"
              value={formData.lowStockAlert}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="5"
            />
            <p className="text-gray-500 text-xs mt-1">
              Upozorenje kada zaliha padne ispod ovog broja
            </p>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Kategorija</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
            Kategorija *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
          >
            <option value="">Izaberi kategoriju...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-400 text-sm mt-2">{errors.categoryId}</p>
          )}
        </div>
      </div>

      {/* Status Toggles */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Status</h2>
        </div>

        <div className="space-y-4">
          {/* Is Active */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/10 bg-slate-900/50 text-lime-400 focus:ring-2 focus:ring-lime-400"
            />
            <div>
              <span className="text-white font-bold">Aktivan proizvod</span>
              <p className="text-gray-400 text-sm">Proizvod je vidljiv na webshopu</p>
            </div>
          </label>

          {/* Is Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/10 bg-slate-900/50 text-lime-400 focus:ring-2 focus:ring-lime-400"
            />
            <div>
              <span className="text-white font-bold">Istaknut proizvod</span>
              <p className="text-gray-400 text-sm">Prikazuje se na početnoj stranici</p>
            </div>
          </label>
        </div>
      </div>

      {/* Images Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Slike</h2>
        </div>

        <ImageUpload
          images={formData.images}
          onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
        />
      </div>

      {/* SEO Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">SEO</h2>
        </div>

        <div className="space-y-4">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Meta naslov
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              maxLength={60}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="Naslov za pretraživače (ako je prazan, koristi naziv proizvoda)"
            />
            <p className="text-gray-500 text-xs mt-1">
              {formData.metaTitle.length}/60 karaktera
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Meta opis
            </label>
            <textarea
              name="metaDesc"
              value={formData.metaDesc}
              onChange={handleChange}
              maxLength={160}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition resize-none"
              placeholder="Opis za pretraživače (ako je prazan, koristi kratki opis)"
            />
            <p className="text-gray-500 text-xs mt-1">
              {formData.metaDesc.length}/160 karaktera
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
              Čuvanje...
            </>
          ) : (
            <>
              <Save size={20} />
              {productId ? "Sačuvaj izmjene" : "Kreiraj proizvod"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-slate-700/50 text-white rounded-xl hover:bg-slate-700 transition font-bold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
          Odustani
        </button>
      </div>
    </form>
  )
}
