import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { BlogForm } from "@/components/admin/BlogForm"
import { FileText } from "lucide-react"

export default function NewBlogPostPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/admin/blog" },
          { label: "Novi post" },
        ]}
      />

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <FileText size={40} />
              Novi blog post
            </h1>
            <p className="text-gray-400 mt-1">
              Kreirajte novi blog post
            </p>
          </div>
        </div>
      </div>

      <BlogForm />
    </div>
  )
}
