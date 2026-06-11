import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ProductCard } from "@/components/shop/ProductCard"
import { FilterSidebar } from "@/components/shop/FilterSidebar"
import { ChevronRight } from "lucide-react"

interface SearchParams {
  category?: string
  search?: string
  minPrice?: string
  maxPrice?: string
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { category, search, minPrice, maxPrice } = params

  // Fetch kategorije za sidebar
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  // Fetch proizvode sa filterima
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category && {
        category: {
          slug: category,
        },
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  })

  const selectedCategory = category
    ? categories.find((cat) => cat.slug === category)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb - Glassmorphism */}
        <nav className="flex items-center mb-8 text-sm backdrop-blur-sm bg-white/5 rounded-lg px-4 py-3 border border-white/10">
          <Link href="/" className="text-gray-400 hover:text-lime-400 transition">
            Početna
          </Link>
          <ChevronRight size={16} className="mx-2 text-gray-600" />
          <Link href="/shop" className="text-gray-400 hover:text-lime-400 transition">
            Proizvodi
          </Link>
          {selectedCategory && (
            <>
              <ChevronRight size={16} className="mx-2 text-gray-600" />
              <span className="text-white font-medium">{selectedCategory.name}</span>
            </>
          )}
        </nav>

        {/* Header - Glassmorphism */}
        <div className="mb-10 backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-lime-400 to-lime-600 rounded-full" />
            <div>
              <p className="text-lime-400 text-sm font-semibold uppercase tracking-wider">Katalog proizvoda</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-1">
                {selectedCategory ? selectedCategory.name : "Svi Proizvodi"}
              </h1>
            </div>
          </div>
          <p className="text-gray-400 ml-7">
            {products.length} {products.length === 1 ? "proizvod pronađen" : "proizvoda pronađeno"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar sa filterima */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              selectedCategory={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Grid proizvoda */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="backdrop-blur-md bg-slate-800/30 border border-white/10 rounded-2xl p-16 text-center">
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📦</span>
                </div>
                <p className="text-gray-300 text-xl mb-6">Nema proizvoda za prikaz</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-lime-400 text-slate-900 rounded-lg font-semibold hover:bg-lime-300 transition"
                >
                  Poništi filtere
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
