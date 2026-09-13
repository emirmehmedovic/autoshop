import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Sparkles } from "lucide-react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice: number | null
    shortDesc: string | null
    stock: number
    images: {
      url: string
      alt: string | null
    }[]
    category: {
      name: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0

  const imageUrl = product.images[0]?.url || "/placeholder-product.svg"

  return (
    /* Double-Bezel (Doppelrand) Architecture: Outer Shell */
    <div className="group p-1.5 rounded-[1.75rem] bg-gradient-to-br from-amber-50/60 via-white/80 to-rose-50/40 ring-1 ring-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(251,191,36,0.15)] hover:ring-amber-200/50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 active:scale-[0.98]">
      {/* Inner Core */}
      <div className="relative overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">

      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-red-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold z-10 shadow-lg shadow-red-500/25 tracking-wide">
            -{discountPercentage}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-bold z-10 tracking-wide">
            Rasprodato
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-800 to-amber-950 text-amber-100 px-2.5 py-1 rounded-full text-[11px] font-bold z-10 flex items-center gap-1 shadow-lg shadow-amber-950/20 tracking-wide">
            <Sparkles size={10} />
            <span>Uskoro nestaje</span>
          </div>
        )}

        <div className="relative w-full h-full bg-gradient-to-br from-stone-50 to-stone-100">
          <Image
            src={imageUrl}
            alt={product.images[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="relative p-5">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center px-2.5 py-0.5 bg-amber-50 rounded-full mb-3">
          <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.15em]">{product.category.name}</span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2 mb-2 text-[15px] leading-snug tracking-tight">
            {product.name}
          </h3>
        </Link>

        {product.shortDesc && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.shortDesc}</p>
        )}

        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-900 tracking-tight tabular-nums">{product.price.toFixed(2)}</span>
              <span className="text-xs text-gray-400 font-medium">KM</span>
            </div>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through tabular-nums">
                {product.comparePrice!.toFixed(2)} KM
              </span>
            )}
          </div>

          {/* Button-in-Button Architecture */}
          <Link
            href={`/product/${product.slug}`}
            className={`group/btn relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              product.stock > 0
                ? "bg-gradient-to-br from-amber-800 to-amber-950 text-amber-100 hover:from-amber-700 hover:to-amber-900 shadow-lg shadow-amber-950/25 active:scale-95"
                : "bg-gray-200/80 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Dodaj u korpu"
          >
            <ShoppingCart
              size={18}
              className={product.stock > 0 ? "group-hover/btn:scale-110 group-hover/btn:rotate-[-8deg] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]" : ""}
            />
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}
