import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"

export const metadata = {
  title: "Blog | AutoShop",
  description: "Savjeti i novosti o auto kozmetici i održavanju vozila",
}

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600">
          Savjeti, trikovi i novosti iz svijeta auto kozmetike
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Nema objavljenih postova</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              {post.imageUrl && (
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2 line-clamp-2">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {post.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(post.publishedAt).toLocaleDateString("bs-BA")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>5 min čitanja</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
