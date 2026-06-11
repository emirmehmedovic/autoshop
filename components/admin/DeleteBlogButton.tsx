"use client"

import { useState } from "react"
import { Trash2, X, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface DeleteBlogButtonProps {
  postId: string
  postTitle: string
}

export function DeleteBlogButton({ postId, postTitle }: DeleteBlogButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Greška pri brisanju")
      }

      setShowModal(false)
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert(error instanceof Error ? error.message : "Greška pri brisanju blog posta")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition border border-transparent hover:border-red-400/20"
      >
        <Trash2 size={18} />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Obriši blog post?
                </h3>
                <p className="text-gray-400">
                  Da li ste sigurni da želite da obrišete <span className="font-bold text-white">{postTitle}</span>?
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Ova akcija je nepovratna.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Brisanje...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Obriši
                  </>
                )}
              </button>

              <button
                onClick={() => setShowModal(false)}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 text-white rounded-xl hover:bg-slate-700 transition font-bold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
