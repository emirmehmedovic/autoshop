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
      options: {
        orderBy: { sortOrder: "asc" },
        include: {
          values: {
            orderBy: { sortOrder: "asc" },
          },
        },
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meta Pixel ViewContent tracking */}
        <ProductViewTracker product={product} />

        {/* Breadcrumb */}
        <nav className="flex items-center mb-8 text-sm backdrop-blur-xl bg-gradient-to-r from-gray-500/5 via-white/70 to-gray-500/5 rounded-xl px-4 py-3 border-[5px] border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <Link href="/" className="text-gray-500 hover:text-orange-500 transition">
            Početna
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/shop" className="text-gray-500 hover:text-orange-500 transition">
            Proizvodi
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="text-gray-500 hover:text-orange-500 transition"
          >
            {product.category.name}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lijeva strana - Galerija slika */}
          <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
            <div className="relative">
              <ProductImageGallery
                images={
                  product.images.length > 0
                    ? product.images
                    : [{ url: "/placeholder-product.svg", alt: product.name }]
                }
              />
            </div>
          </div>

          {/* Desna strana - Informacije */}
          <div className="space-y-6">
            {/* Category & Title Card */}
            <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center px-3 py-1 bg-orange-100/80 backdrop-blur-sm border border-orange-200/50 rounded-full mb-4">
                  <span className="text-xs text-orange-600 font-semibold uppercase tracking-wider">{product.category.name}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
            </div>

            {/* Price Card */}
            <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/5 via-white/80 to-green-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
              <div className="relative">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-500">KM</span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        {product.comparePrice!.toFixed(2)} KM
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/30">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                {/* Status zaliha */}
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Package size={20} />
                    <span className="font-semibold">
                      {product.stock > 10 ? "Na stanju" : `${product.stock} komada na stanju`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <Package size={20} />
                    <span className="font-semibold">Rasprodato</span>
                  </div>
                )}

                {/* Kratak opis */}
                {product.shortDesc && (
                  <p className="text-gray-600 mt-4 leading-relaxed">{product.shortDesc}</p>
                )}
              </div>
            </div>

            {/* Dodaj u korpu */}
            <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
              <div className="relative">
                <AddToCartButton product={product} />
              </div>
            </div>

            {/* Prednosti kupovine */}
            <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/5 via-white/80 to-pink-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
              <div className="relative space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl border border-white/50 shadow-sm group-hover:shadow-md transition">
                    <Truck className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Brza dostava</h3>
                    <p className="text-sm text-gray-600">Dostava širom BiH za 1-3 radna dana</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl border border-white/50 shadow-sm group-hover:shadow-md transition">
                    <Shield className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Plaćanje pouzećem</h3>
                    <p className="text-sm text-gray-600">Platite prilikom preuzimanja paketa</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl border border-white/50 shadow-sm group-hover:shadow-md transition">
                    <ShoppingCart className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Originalni proizvodi</h3>
                    <p className="text-sm text-gray-600">Garantovani kvalitet i originalnost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detaljan opis */}
        <div className="mt-8 relative overflow-hidden rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-4 shadow-lg shadow-orange-500/30" />
              Opis proizvoda
            </h2>
            <div
              className="prose prose-gray max-w-none text-gray-600 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
