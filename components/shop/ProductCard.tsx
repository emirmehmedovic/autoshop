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
    <div className="group relative overflow-hidden rounded-[22px] backdrop-blur-xl bg-gradient-to-br from-amber-950/8 via-white/85 to-amber-700/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(120,53,15,0.1)] hover:shadow-[0_16px_48px_rgba(120,53,15,0.18)] hover:-translate-y-1.5 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-amber-50/20 to-amber-900/5 pointer-events-none" />

      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold z-10 shadow-lg shadow-red-500/30">
            -{discountPercentage}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold z-10">
            Rasprodato
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-900 to-neutral-950 text-amber-100 px-3 py-1.5 rounded-lg text-xs font-bold z-10 flex items-center space-x-1 shadow-lg shadow-amber-950/30">
            <Sparkles size={12} />
            <span>Uskoro nestaje</span>
          </div>
        )}

        <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-stone-100">
          <Image
            src={imageUrl}
            alt={product.images[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="relative p-5">
        {/* Category badge */}
        <div className="inline-flex items-center px-2.5 py-1 bg-amber-100/80 backdrop-blur-sm border border-amber-200/70 rounded-full mb-3">
          <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider">{product.category.name}</span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-gray-900 group-hover:text-amber-800 transition line-clamp-2 mb-2 text-lg">
            {product.name}
          </h3>
        </Link>

        {product.shortDesc && (
          <p className="text-sm text-amber-950/55 line-clamp-2 mb-4">{product.shortDesc}</p>
        )}

        <div className="flex items-end justify-between pt-4 border-t border-amber-100/80">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">KM</span>
            </div>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {product.comparePrice!.toFixed(2)} KM
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.slug}`}
            className={`group/btn relative p-3 rounded-xl transition-all duration-300 ${
              product.stock > 0
                ? "bg-gradient-to-r from-amber-900 to-neutral-950 text-amber-100 hover:from-amber-800 hover:to-amber-950 hover:scale-110 shadow-lg shadow-amber-950/30"
                : "bg-gray-200/80 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Dodaj u korpu"
          >
            <ShoppingCart size={20} className={product.stock > 0 ? "group-hover/btn:scale-110 transition-transform" : ""} />
          </Link>
        </div>
      </div>
    </div>
  )
}
