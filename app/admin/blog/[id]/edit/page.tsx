import { prisma } from "@/lib/prisma"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { BlogForm } from "@/components/admin/BlogForm"
import { FileText } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const post = await prisma.blogPost.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  // Transform data for form
  const initialData = {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || "",
    imageUrl: post.imageUrl || "",
    isPublished: post.isPublished,
    metaTitle: post.metaTitle || "",
    metaDesc: post.metaDesc || "",
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 16)
      : "",
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/admin/blog" },
          { label: post.title },
        ]}
      />

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <FileText size={40} />
              Uredi blog post
            </h1>
            <p className="text-gray-400 mt-1">{post.title}</p>
          </div>
        </div>
      </div>

      <BlogForm initialData={initialData} postId={post.id} />
    </div>
  )
}
