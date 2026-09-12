"use client"

import Image from "next/image"
import { useState } from "react"

interface ImageHoverPreviewProps {
  src: string
  alt: string
}

export function ImageHoverPreview({ src, alt }: ImageHoverPreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {/* Mala slika */}
      <div className="relative w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden cursor-pointer">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>

      {/* Uvećana slika - popover */}
      {showPreview && (
        <div className="absolute left-12 top-0 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-48 h-48 bg-white rounded-xl border-2 border-gray-200 shadow-2xl overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain p-2"
              sizes="192px"
            />
          </div>
        </div>
      )}
    </div>
  )
}
