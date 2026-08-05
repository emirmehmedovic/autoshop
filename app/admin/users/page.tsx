"use client"

import { useState, useEffect } from "react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import {
  Users,
  UserPlus,
  Trash2,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Shield,
} from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  })

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error("Greška pri dohvatanju")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError("Greška pri učitavanju administratora")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")
    setFormSuccess("")

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Greška pri kreiranju")
      }

      setFormSuccess("Administrator uspješno kreiran!")
      setFormData({ email: "", name: "", password: "" })
      fetchUsers()

      setTimeout(() => {
        setShowForm(false)
        setFormSuccess("")
      }, 2000)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Greška pri kreiranju")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteLoading(true)

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Greška pri brisanju")
      }

      setUsers(users.filter((u) => u.id !== id))
      setDeleteId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Greška pri brisanju")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Administratori" }]} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full shadow-lg shadow-purple-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Users size={40} />
                Administratori
              </h1>
              <p className="text-gray-600 mt-1">
                Upravljanje admin nalozima
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition shadow-lg shadow-purple-500/25"
          >
            <UserPlus size={20} />
            Novi administrator
          </button>
        </div>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 overflow-hidden rounded-3xl backdrop-blur-xl bg-white border-[5px] border-white/80 shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus size={24} className="text-purple-500" />
                  Novi administrator
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setFormError("")
                    setFormSuccess("")
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-700">{formSuccess}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ime i prezime
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="Ime Prezime"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email adresa
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="admin@glossdrive.ba"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lozinka
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 karaktera</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormError("")
                    setFormSuccess("")
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition disabled:opacity-70"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Kreiranje...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Kreiraj
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm mx-4 overflow-hidden rounded-2xl bg-white border-[5px] border-white/80 shadow-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Obrisati administratora?</h3>
              <p className="text-gray-600 mb-6">
                Ova akcija se ne može poništiti. Administrator će izgubiti pristup sistemu.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Odustani
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={deleteLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-70"
                >
                  {deleteLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Obriši
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nema registrovanih administratora</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-purple-50/50 border-[5px] border-white/80 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => setDeleteId(user.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Obriši administratora"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {user.name || "Bez imena"}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-purple-500" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={14} />
                  {new Date(user.createdAt).toLocaleDateString("bs-BA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  <Shield size={12} />
                  Administrator
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-white/80 to-indigo-500/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Shield size={24} className="text-purple-500" />
          O administratorskim nalozima
        </h3>
        <div className="space-y-2 text-gray-700 text-sm">
          <p>• Administratori imaju puni pristup admin panelu i svim funkcijama</p>
          <p>• Svaki administrator može kreirati nove administratorske naloge</p>
          <p>• Administrator ne može obrisati vlastiti nalog</p>
          <p>• Obrisani nalozi se ne mogu vratiti</p>
        </div>
      </div>
    </div>
  )
}
