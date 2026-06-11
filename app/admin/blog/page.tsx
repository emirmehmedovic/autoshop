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

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-lime-400 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-white">Blog</h1>
              <p className="text-gray-400 mt-1">
                {posts.length} postova • {publishedCount} objavljeno • {draftCount} draft
              </p>
            </div>
          </div>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
          >
            <Plus size={20} />
            Novi post
          </Link>
        </div>
      </div>

      <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Naslov
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-white hover:text-lime-400 transition"
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">{post.excerpt}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${
                        post.isPublished
                          ? "bg-lime-500/10 text-lime-400 border-lime-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
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
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("bs-BA")
                      : new Date(post.createdAt).toLocaleDateString("bs-BA")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-2 text-lime-400 hover:bg-lime-400/10 rounded-lg transition border border-transparent hover:border-lime-400/20"
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
            <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-16 w-16 text-lime-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Nema blog postova</h2>
            <p className="text-gray-400 mb-8">Kreirajte prvi blog post</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-lime-400 text-slate-900 rounded-xl hover:bg-lime-300 transition font-bold shadow-lg shadow-lime-400/20"
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
