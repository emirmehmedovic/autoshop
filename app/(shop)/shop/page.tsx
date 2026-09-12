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

  // Fetch kategorije za sidebar (broji samo proizvode na stanju)
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
              stock: { gt: 0 },
            },
          },
        },
      },
    },
  })

  // Fetch proizvode sa filterima (samo na stanju)
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      stock: { gt: 0 },
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
        <nav className="flex items-center mb-8 text-sm bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
          <Link href="/" className="text-gray-500 hover:text-yellow-600 transition">
            Početna
          </Link>
          <ChevronRight size={16} className="mx-2 text-gray-300" />
          <Link href="/shop" className="text-gray-500 hover:text-yellow-600 transition">
            Proizvodi
          </Link>
          {selectedCategory && (
            <>
              <ChevronRight size={16} className="mx-2 text-gray-300" />
              <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-10 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-500/30" />
            <div>
              <p className="text-yellow-600 text-sm font-semibold uppercase tracking-wider">Katalog proizvoda</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-1">
                {selectedCategory ? selectedCategory.name : "Svi Proizvodi"}
              </h1>
            </div>
          </div>
          <p className="text-gray-500 ml-7">
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
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/25">
                  <span className="text-4xl">📦</span>
                </div>
                <p className="text-gray-600 text-xl mb-6">Nema proizvoda za prikaz</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 rounded-full font-semibold hover:from-yellow-400 hover:to-amber-400 transition shadow-lg shadow-yellow-500/30"
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
