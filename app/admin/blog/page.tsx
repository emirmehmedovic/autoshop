import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Eye, EyeOff, FileText } from "lucide-react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton"

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  })

  const publishedCount = posts.filter(p => p.isPublished).length
  const draftCount = posts.filter(p => !p.isPublished).length

  return (
    <div>
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/5 via-white/80 to-pink-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
              <p className="text-gray-600 mt-1">
                {posts.length} postova • {publishedCount} objavljeno • {draftCount} draft
              </p>
            </div>
          </div>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-md"
          >
            <Plus size={20} />
            Novi post
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Naslov
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-gray-900 hover:text-orange-500 transition"
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.excerpt}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${
                        post.isPublished
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {post.isPublished ? (
                        <>
                          <Eye size={14} /> Objavljen
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} /> Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("bs-BA")
                      : new Date(post.createdAt).toLocaleDateString("bs-BA")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition border border-transparent hover:border-orange-200"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteBlogButton
                        postId={post.id}
                        postTitle={post.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-16 w-16 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nema blog postova</h2>
            <p className="text-gray-500 mb-8">Kreirajte prvi blog post</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold shadow-md"
            >
              <Plus size={20} />
              Novi post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
