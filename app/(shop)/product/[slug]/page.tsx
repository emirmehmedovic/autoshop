import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductImageGallery } from "@/components/shop/ProductImageGallery"
import { AddToCartButton } from "@/components/shop/AddToCartButton"
import { ProductViewTracker } from "@/components/analytics/ProductViewTracker"
import { ShoppingCart, Truck, Shield, Package } from "lucide-react"
import { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    return {
      title: "Proizvod nije pronađen",
    }
  }

  return {
    title: product.metaTitle || `${product.name} | AutoShop`,
    description: product.metaDesc || product.shortDesc || product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meta Pixel ViewContent tracking */}
        <ProductViewTracker product={product} />

        {/* Breadcrumb - Glassmorphism */}
        <nav className="flex items-center mb-8 text-sm backdrop-blur-sm bg-white/5 rounded-lg px-4 py-3 border border-white/10">
          <Link href="/" className="text-gray-400 hover:text-lime-400 transition">
            Početna
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link href="/shop" className="text-gray-400 hover:text-lime-400 transition">
            Proizvodi
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="text-gray-400 hover:text-lime-400 transition"
          >
            {product.category.name}
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lijeva strana - Galerija slika */}
          <div className="backdrop-blur-md bg-slate-800/40 border border-white/10 rounded-2xl p-6">
            <ProductImageGallery
              images={
                product.images.length > 0
                  ? product.images
                  : [{ url: "/placeholder-product.svg", alt: product.name }]
              }
            />
          </div>

          {/* Desna strana - Informacije */}
          <div className="space-y-6">
            {/* Category & Title Card */}
            <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
              <div className="inline-flex items-center px-3 py-1 bg-lime-400/10 border border-lime-400/20 rounded-full mb-4">
                <span className="text-xs text-lime-400 font-semibold uppercase tracking-wider">{product.category.name}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{product.name}</h1>
              <p className="text-sm text-gray-400">SKU: {product.sku}</p>
            </div>

            {/* Price Card */}
            <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-bold text-white">
                  {product.price.toFixed(2)}
                </span>
                <span className="text-xl text-gray-400">KM</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {product.comparePrice!.toFixed(2)} KM
                    </span>
                    <span className="px-3 py-1 backdrop-blur-md bg-red-500/90 text-white rounded-lg text-sm font-bold border border-white/20">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Status zaliha */}
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-lime-400">
                  <Package size={20} />
                  <span className="font-semibold">
                    {product.stock > 10 ? "Na stanju" : `${product.stock} komada na stanju`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <Package size={20} />
                  <span className="font-semibold">Rasprodato</span>
                </div>
              )}

              {/* Kratak opis */}
              {product.shortDesc && (
                <p className="text-gray-300 mt-4 leading-relaxed">{product.shortDesc}</p>
              )}
            </div>

            {/* Dodaj u korpu */}
            <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
              <AddToCartButton product={product} />
            </div>

            {/* Prednosti kupovine */}
            <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20 group-hover:bg-lime-400/20 transition">
                    <Truck className="text-lime-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Brza dostava</h3>
                    <p className="text-sm text-gray-400">Dostava širom BiH za 1-3 radna dana</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20 group-hover:bg-lime-400/20 transition">
                    <Shield className="text-lime-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Plaćanje pouzećem</h3>
                    <p className="text-sm text-gray-400">Platite prilikom preuzimanja paketa</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20 group-hover:bg-lime-400/20 transition">
                    <ShoppingCart className="text-lime-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Originalni proizvodi</h3>
                    <p className="text-sm text-gray-400">Garantovani kvalitet i originalnost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detaljan opis */}
        <div className="mt-8 backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <div className="w-1 h-8 bg-lime-400 rounded-full mr-4" />
            Opis proizvoda
          </h2>
          <div
            className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    </div>
  )
}
