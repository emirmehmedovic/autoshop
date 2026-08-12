"use client"

import Image from "next/image"
import { useState } from "react"

interface ProductImage {
  url: string
  alt: string | null
}

interface ProductImageGalleryProps {
  images: ProductImage[]
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectedImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Glavna slika */}
      <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-stone-100 rounded-lg overflow-hidden shadow-inner shadow-amber-950/10">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt || "Slika proizvoda"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                index === selectedIndex
                  ? "border-orange-500"
                  : "border-amber-100 hover:border-amber-400"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Slika proizvoda ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
