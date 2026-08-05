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

      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-orange-500 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FileText size={40} />
              Novi blog post
            </h1>
            <p className="text-gray-600 mt-1">
              Kreirajte novi blog post
            </p>
          </div>
        </div>
      </div>

      <BlogForm />
    </div>
  )
}
