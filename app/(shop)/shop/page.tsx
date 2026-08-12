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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center mb-8 text-sm backdrop-blur-xl bg-gradient-to-r from-amber-950/5 via-white/75 to-amber-700/5 rounded-xl px-4 py-3 border-[5px] border-white/80 shadow-[0_4px_24px_rgba(120,53,15,0.08)]">
          <Link href="/" className="text-amber-950/55 hover:text-amber-800 transition">
            Početna
          </Link>
          <ChevronRight size={16} className="mx-2 text-amber-900/35" />
          <Link href="/shop" className="text-amber-950/55 hover:text-amber-800 transition">
            Proizvodi
          </Link>
          {selectedCategory && (
            <>
              <ChevronRight size={16} className="mx-2 text-amber-900/35" />
              <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-10 relative overflow-hidden rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-amber-950/10 via-white/75 to-amber-700/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(120,53,15,0.12)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-amber-50/25 to-amber-900/5 pointer-events-none" />
          <div className="relative flex items-center space-x-3 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-amber-800 via-amber-900 to-neutral-950 rounded-full shadow-lg shadow-amber-950/30" />
            <div>
              <p className="text-amber-800 text-sm font-semibold uppercase tracking-wider">Katalog proizvoda</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-1">
                {selectedCategory ? selectedCategory.name : "Svi Proizvodi"}
              </h1>
            </div>
          </div>
          <p className="relative text-amber-950/65 ml-7">
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
              <div className="relative overflow-hidden rounded-2xl p-16 text-center backdrop-blur-xl bg-gradient-to-br from-amber-950/10 via-white/75 to-amber-700/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(120,53,15,0.12)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-amber-50/25 to-amber-900/5 pointer-events-none" />
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-b from-amber-900 to-neutral-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-950/25">
                    <span className="text-4xl">📦</span>
                  </div>
                  <p className="text-amber-950/75 text-xl mb-6">Nema proizvoda za prikaz</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-900 to-neutral-950 text-amber-100 rounded-full font-semibold hover:from-amber-800 hover:to-amber-950 transition shadow-lg shadow-amber-950/30"
                  >
                    Poništi filtere
                  </Link>
                </div>
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
