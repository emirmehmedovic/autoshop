"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Upload } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  name: string
}

interface CategoryFormData {
  name: string
  description: string
  imageUrl: string
  parentId: string
  sortOrder: number
  isVisible: boolean
}

interface CategoryFormProps {
  categories: Category[]
  initialData?: Partial<CategoryFormData>
  categoryId?: string
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

export function CategoryForm({ categories, initialData, categoryId }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    parentId: initialData?.parentId || "",
    sortOrder: initialData?.sortOrder || 0,
    isVisible: initialData?.isVisible ?? true,
  })

  // Filter out current category from parent options (can't be parent of itself)
  const availableParents = categories.filter(cat => cat.id !== categoryId)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      const numValue = value === "" ? 0 : parseInt(value)
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("file", file)

      const response = await fetch("/api/admin/categories/upload", {
        method: "POST",
        body: formDataObj,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const { url } = await response.json()
      setFormData((prev) => ({ ...prev, imageUrl: url }))
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Greška pri upload-u slike")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Naziv mora imati najmanje 2 karaktera"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0]
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      return
    }

    setLoading(true)

    try {
      const url = categoryId
        ? `/api/admin/categories/${categoryId}`
        : "/api/admin/categories"

      const method = categoryId ? "PUT" : "POST"

      // Convert empty string to null for parentId
      const submitData = {
        ...formData,
        parentId: formData.parentId || null,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Greška pri čuvanju kategorije")
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Submit error:", error)
      alert(error instanceof Error ? error.message : "Greška pri čuvanju kategorije")
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
              Naziv kategorije *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="npr. Auto kozmetika"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-2">{errors.name}</p>
            )}
            {formData.name && (
              <p className="text-gray-500 text-xs mt-1">
                Slug: {generateSlug(formData.name)}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Opis
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition resize-none"
              placeholder="Kratak opis kategorije"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Roditeljska kategorija
            </label>
            <select
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
            >
              <option value="">Nema (glavna kategorija)</option>
              {availableParents.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-xs mt-1">
              Ostavi prazno za glavnu kategoriju
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Redosljed prikaza
            </label>
            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="0"
            />
            <p className="text-gray-500 text-xs mt-1">
              Manji broj = viša pozicija u listi
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Slika kategorije</h2>
        </div>

        <div className="space-y-4">
          {formData.imageUrl ? (
            <div className="relative w-full h-48 bg-slate-700/30 rounded-xl overflow-hidden border border-white/10">
              <Image
                src={formData.imageUrl}
                alt={formData.name || "Category image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                className="absolute top-4 right-4 p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-lime-400/50 transition cursor-pointer bg-slate-900/30"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-white font-bold mb-2">
                Klikni za upload slike
              </p>
              <p className="text-gray-400 text-sm">
                JPG, PNG ili WEBP (max 10MB)
              </p>
            </div>
          )}

          {uploading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
              <p className="text-gray-400 mt-2">Upload u toku...</p>
            </div>
          )}
        </div>
      </div>

      {/* Visibility Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Vidljivost</h2>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isVisible"
            checked={formData.isVisible}
            onChange={handleChange}
            className="w-5 h-5 rounded border-white/10 bg-slate-900/50 text-lime-400 focus:ring-2 focus:ring-lime-400"
          />
          <div>
            <span className="text-white font-bold">Vidljiva kategorija</span>
            <p className="text-gray-400 text-sm">Kategorija je prikazana na webshopu</p>
          </div>
        </label>
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
              {categoryId ? "Sačuvaj izmjene" : "Kreiraj kategoriju"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
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
