"use client"

import { useState, useRef } from "react"
import { Upload, X, GripVertical, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageData {
  url: string
  alt: string
  sortOrder: number
}

interface ImageUploadProps {
  images: ImageData[]
  onChange: (images: ImageData[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check max images limit
    if (images.length + files.length > maxImages) {
      alert(`Možete dodati maksimalno ${maxImages} slika`)
      return
    }

    setUploading(true)

    try {
      const uploadedImages: ImageData[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/admin/products/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Upload failed")
        }

        const { url } = await response.json()
        uploadedImages.push({
          url,
          alt: "",
          sortOrder: images.length + uploadedImages.length,
        })
      }

      onChange([...images, ...uploadedImages])
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

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // Reorder remaining images
    onChange(newImages.map((img, i) => ({ ...img, sortOrder: i })))
  }

  const handleAltChange = (index: number, alt: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], alt }
    onChange(newImages)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)

    // Update sort orders
    const reorderedImages = newImages.map((img, i) => ({ ...img, sortOrder: i }))
    onChange(reorderedImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)

    // Create a fake event to reuse the file select handler
    const input = fileInputRef.current
    if (input && files.length > 0) {
      const dataTransfer = new DataTransfer()
      files.forEach(file => dataTransfer.items.add(file))
      input.files = dataTransfer.files
      handleFileSelect({ target: input } as any)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDropZone}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-lime-400/50 transition cursor-pointer bg-slate-900/30"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-white font-bold mb-2">
          Klikni ili prevuci slike ovdje
        </p>
        <p className="text-gray-400 text-sm">
          JPG, PNG ili WEBP (max 10MB po slici)
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Maksimalno {maxImages} slika
        </p>
      </div>

      {/* Loading State */}
      {uploading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          <p className="text-gray-400 mt-2">Upload u toku...</p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-xl p-4 cursor-move hover:border-lime-400/30 transition"
            >
              <div className="flex gap-4">
                {/* Drag Handle */}
                <div className="flex-shrink-0 pt-2">
                  <GripVertical className="text-gray-400" size={20} />
                </div>

                {/* Image Preview */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-slate-700/30 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={image.url}
                    alt={image.alt || "Product image"}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Alt Text Input */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Alt tekst
                  </label>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => handleAltChange(index, e.target.value)}
                    placeholder="Opis slike..."
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Slika #{index + 1}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition border border-transparent hover:border-red-400/20 h-fit"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="text-center py-8 border border-white/10 rounded-xl bg-slate-900/20">
          <ImageIcon className="mx-auto mb-3 text-gray-500" size={40} />
          <p className="text-gray-400">Još nema dodatih slika</p>
        </div>
      )}
    </div>
  )
}
