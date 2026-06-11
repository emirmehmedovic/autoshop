"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface BlogFormData {
  title: string
  content: string
  excerpt: string
  imageUrl: string
  isPublished: boolean
  metaTitle: string
  metaDesc: string
  publishedAt: string
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>
  postId?: string
}

function generateSlug(title: string): string {
  return title
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

export function BlogForm({ initialData, postId }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    imageUrl: initialData?.imageUrl || "",
    isPublished: initialData?.isPublished ?? false,
    metaTitle: initialData?.metaTitle || "",
    metaDesc: initialData?.metaDesc || "",
    publishedAt: initialData?.publishedAt || "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
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
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: formData,
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

    if (!formData.title || formData.title.length < 2) {
      newErrors.title = "Naslov mora imati najmanje 2 karaktera"
    }
    if (!formData.content || formData.content.length < 10) {
      newErrors.content = "Sadržaj mora imati najmanje 10 karaktera"
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
      const url = postId ? `/api/admin/blog/${postId}` : "/api/admin/blog"
      const method = postId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Greška pri čuvanju blog posta")
      }

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error("Submit error:", error)
      alert(error instanceof Error ? error.message : "Greška pri čuvanju blog posta")
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
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Naslov *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              placeholder="Naslov blog posta"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-2">{errors.title}</p>
            )}
            {formData.title && (
              <p className="text-gray-500 text-xs mt-1">
                Slug: {generateSlug(formData.title)}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Kratak opis
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              maxLength={200}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition resize-none"
              placeholder="Kratak opis koji se prikazuje u listi postova"
            />
            <p className="text-gray-500 text-xs mt-1">
              {formData.excerpt.length}/200 karaktera
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Sadržaj *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition resize-none font-mono text-sm"
              placeholder="Sadržaj posta (HTML ili tekst)"
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-2">{errors.content}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Podržava HTML tagove
            </p>
          </div>
        </div>
      </div>

      {/* Featured Image Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Naslovna slika</h2>
        </div>

        <div className="space-y-4">
          {formData.imageUrl ? (
            <div className="relative w-full h-64 bg-slate-700/30 rounded-xl overflow-hidden border border-white/10">
              <Image
                src={formData.imageUrl}
                alt={formData.title || "Blog image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
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
              <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
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

      {/* Publishing Section */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-lime-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Objava</h2>
        </div>

        <div className="space-y-4">
          {/* Is Published */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/10 bg-slate-900/50 text-lime-400 focus:ring-2 focus:ring-lime-400"
            />
            <div>
              <span className="text-white font-bold">Objavi post</span>
              <p className="text-gray-400 text-sm">Post je vidljiv na webshopu</p>
            </div>
          </label>

          {/* Published At */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Datum objave
            </label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
            />
            <p className="text-gray-500 text-xs mt-1">
              Ako je prazno, koristi se trenutni datum prilikom objave
            </p>
          </div>
        </div>
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
              placeholder="Naslov za pretraživače (ako je prazan, koristi naslov posta)"
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
              placeholder="Opis za pretraživače (ako je prazan, koristi excerpt)"
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
              {postId ? "Sačuvaj izmjene" : "Kreiraj post"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
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
