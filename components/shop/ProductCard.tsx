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
    <div className="group relative backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-lime-400/30 transition-all duration-300">
      {/* Glassmorphism hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/0 to-lime-600/0 group-hover:from-lime-400/5 group-hover:to-lime-600/5 transition-all duration-300 pointer-events-none" />

      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-3 left-3 backdrop-blur-md bg-red-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold z-10 border border-white/20">
            -{discountPercentage}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 backdrop-blur-md bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold z-10 border border-white/20">
            Rasprodato
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-3 right-3 backdrop-blur-md bg-orange-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold z-10 border border-white/20 flex items-center space-x-1">
            <Sparkles size={12} />
            <span>Uskoro nestaje</span>
          </div>
        )}

        <div className="relative w-full h-full bg-slate-700/30">
          <Image
            src={imageUrl}
            alt={product.images[0]?.alt || product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/0 to-slate-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="relative p-5">
        {/* Category badge */}
        <div className="inline-flex items-center px-2.5 py-1 bg-lime-400/10 border border-lime-400/20 rounded-full mb-3">
          <span className="text-xs text-lime-400 font-semibold uppercase tracking-wider">{product.category.name}</span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-white group-hover:text-lime-400 transition line-clamp-2 mb-2 text-lg">
            {product.name}
          </h3>
        </Link>

        {product.shortDesc && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-4">{product.shortDesc}</p>
        )}

        <div className="flex items-end justify-between pt-4 border-t border-white/10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-400">KM</span>
            </div>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {product.comparePrice!.toFixed(2)} KM
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.slug}`}
            className={`group/btn relative p-3 rounded-xl transition-all duration-300 ${
              product.stock > 0
                ? "bg-lime-400 text-slate-900 hover:bg-lime-300 hover:scale-110"
                : "bg-slate-700/50 text-gray-500 cursor-not-allowed border border-white/10"
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
