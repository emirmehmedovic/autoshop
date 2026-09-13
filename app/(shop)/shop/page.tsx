import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ProductCard } from "@/components/shop/ProductCard"
import { FilterSidebar } from "@/components/shop/FilterSidebar"
import { ChevronRight } from "lucide-react"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="flex items-center mb-10 text-sm">
            <Link href="/" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">
              Početna
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <Link href="/shop" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">
              Proizvodi
            </Link>
            {selectedCategory && (
              <>
                <ChevronRight size={14} className="mx-2 text-gray-300" />
                <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
              </>
            )}
          </nav>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal delay={100}>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-3">
              <div className="inline-flex items-center px-3 py-1 bg-amber-100/80 rounded-full">
                <span className="text-amber-700 uppercase tracking-[0.2em] text-[10px] font-bold">Katalog proizvoda</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              {selectedCategory ? selectedCategory.name : "Svi proizvodi"}
            </h1>
            <p className="text-gray-500 mt-3">
              {products.length} {products.length === 1 ? "proizvod pronađen" : "proizvoda pronađeno"}
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar sa filterima */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <ScrollReveal delay={200}>
              <FilterSidebar
                categories={categories}
                selectedCategory={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </ScrollReveal>
          </aside>

          {/* Grid proizvoda */}
          <div className="flex-1">
            {products.length === 0 ? (
              <ScrollReveal delay={300}>
                <div className="rounded-[2rem] p-1.5 bg-gradient-to-br from-amber-100/40 to-white/60 ring-1 ring-amber-200/30">
                  <div className="rounded-[calc(2rem-0.375rem)] bg-white p-16 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                      <span className="text-3xl">📦</span>
                    </div>
                    <p className="text-gray-600 text-lg mb-6">Nema proizvoda za prikaz</p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-lg shadow-gray-900/20 active:scale-[0.98]"
                    >
                      Poništi filtere
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
