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
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition cursor-pointer bg-gray-50"
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
        <p className="text-gray-900 font-bold mb-2">
          Klikni ili prevuci slike ovdje
        </p>
        <p className="text-gray-500 text-sm">
          JPG, PNG ili WEBP (max 10MB po slici)
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Maksimalno {maxImages} slika
        </p>
      </div>

      {/* Loading State */}
      {uploading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 mt-2">Upload u toku...</p>
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
              className="bg-white border border-gray-200 rounded-xl p-4 cursor-move hover:border-orange-300 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* Drag Handle */}
                <div className="flex-shrink-0 pt-2">
                  <GripVertical className="text-gray-400" size={20} />
                </div>

                {/* Image Preview */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
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
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Alt tekst
                  </label>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => handleAltChange(index, e.target.value)}
                    placeholder="Opis slike..."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Slika #{index + 1}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200 h-fit"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="text-center py-8 border border-gray-200 rounded-xl bg-gray-50">
          <ImageIcon className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-gray-500">Još nema dodatih slika</p>
        </div>
      )}
    </div>
  )
}
