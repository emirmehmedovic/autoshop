"use client"

import { useState, useEffect, useCallback } from "react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  MessageSquare,
  ExternalLink,
  Building2,
  Loader2,
  X,
  Send,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Tags,
  Trash2,
  Edit3,
} from "lucide-react"

interface LeadCategory {
  id: string
  name: string
  color: string
  icon: string | null
  description: string | null
  sortOrder: number
  isActive: boolean
  _count?: { leads: number }
}

interface Lead {
  id: string
  companyName: string
  contactPerson: string | null
  email: string | null
  phone: string | null
  website: string | null
  facebookUrl: string | null
  googleMapsUrl: string | null
  address: string | null
  city: string | null
  region: string | null
  categoryId: string | null
  category: LeadCategory | null
  businessType: string | null
  source: string
  status: string
  priority: string
  estimatedValue: number | null
  lastContactedAt: string | null
  nextFollowUpAt: string | null
  googleRating: number | null
  googleReviews: number | null
  createdAt: string
  notes: { id: string; content: string; createdAt: string }[]
  _count: { notes: number }
}

interface SearchResult {
  googlePlaceId: string
  companyName: string
  address: string | null
  city: string | null
  phone: string | null
  website: string | null
  googleMapsUrl: string | null
  googleRating: number | null
  googleReviews: number | null
  businessType: string
  isExisting: boolean
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  NEW: { label: "Novi", color: "text-blue-700", bg: "bg-blue-100" },
  CONTACTED: { label: "Kontaktiran", color: "text-yellow-700", bg: "bg-yellow-100" },
  INTERESTED: { label: "Zainteresovan", color: "text-purple-700", bg: "bg-purple-100" },
  NEGOTIATING: { label: "Pregovori", color: "text-orange-700", bg: "bg-orange-100" },
  WON: { label: "Zatvoren", color: "text-green-700", bg: "bg-green-100" },
  LOST: { label: "Izgubljen", color: "text-red-700", bg: "bg-red-100" },
  ON_HOLD: { label: "Na čekanju", color: "text-gray-700", bg: "bg-gray-100" },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Nizak", color: "text-gray-500" },
  MEDIUM: { label: "Srednji", color: "text-blue-500" },
  HIGH: { label: "Visok", color: "text-orange-500" },
  URGENT: { label: "Hitan", color: "text-red-500" },
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [categories, setCategories] = useState<LeadCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<Lead | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  // Category management
  const [editingCategory, setEditingCategory] = useState<LeadCategory | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", color: "#6366f1", description: "" })
  const [savingCategory, setSavingCategory] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState("autopraonica OR detailing OR car wash")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [importing, setImporting] = useState<string | null>(null)

  // New lead form
  const [newLead, setNewLead] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    categoryId: "",
    businessType: "",
    priority: "MEDIUM",
  })
  const [saving, setSaving] = useState(false)

  // Note
  const [newNote, setNewNote] = useState("")
  const [savingNote, setSavingNote] = useState(false)

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (priorityFilter !== "all") params.set("priority", priorityFilter)
      if (cityFilter !== "all") params.set("city", cityFilter)
      if (categoryFilter !== "all") params.set("categoryId", categoryFilter)

      const res = await fetch(`/api/admin/leads?${params}`)
      const data = await res.json()
      setLeads(data.leads || [])
      setCities(data.cities || [])
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter, priorityFilter, cityFilter, categoryFilter])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads/categories")
      const data = await res.json()
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingCategory(true)
    try {
      const url = editingCategory
        ? `/api/admin/leads/categories/${editingCategory.id}`
        : "/api/admin/leads/categories"

      const res = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory || newCategory),
      })

      if (res.ok) {
        fetchCategories()
        setEditingCategory(null)
        setNewCategory({ name: "", color: "#6366f1", description: "" })
      } else {
        const data = await res.json()
        alert(data.error || "Greška pri spremanju kategorije")
      }
    } catch (error) {
      console.error("Save category error:", error)
    } finally {
      setSavingCategory(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Da li ste sigurni da želite obrisati ovu kategoriju?")) return
    setDeletingCategory(categoryId)
    try {
      const res = await fetch(`/api/admin/leads/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchCategories()
      } else {
        const data = await res.json()
        alert(data.error || "Greška pri brisanju kategorije")
      }
    } catch (error) {
      console.error("Delete category error:", error)
    } finally {
      setDeletingCategory(null)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Data fetching requires setState
    void fetchLeads()
  }, [fetchLeads])

  const handleSearch = async () => {
    setSearching(true)
    try {
      const res = await fetch("/api/admin/leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        setSearchResults(data.leads || [])
      }
    } catch (error) {
      console.error("Search error:", error)
      alert("Greška pri pretrazi")
    } finally {
      setSearching(false)
    }
  }

  const handleImportLead = async (result: SearchResult) => {
    setImporting(result.googlePlaceId)
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: result.companyName,
          phone: result.phone,
          website: result.website,
          address: result.address,
          city: result.city,
          googleMapsUrl: result.googleMapsUrl,
          googlePlaceId: result.googlePlaceId,
          googleRating: result.googleRating,
          googleReviews: result.googleReviews,
          businessType: result.businessType,
          source: "GOOGLE_PLACES",
        }),
      })

      if (res.ok) {
        // Mark as imported
        setSearchResults((prev) =>
          prev.map((r) =>
            r.googlePlaceId === result.googlePlaceId ? { ...r, isExisting: true } : r
          )
        )
        fetchLeads()
      } else {
        const data = await res.json()
        alert(data.error || "Greška pri uvozu")
      }
    } catch (error) {
      console.error("Import error:", error)
    } finally {
      setImporting(null)
    }
  }

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      })

      if (res.ok) {
        setShowAddModal(false)
        setNewLead({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          website: "",
          city: "",
          categoryId: "",
          businessType: "",
          priority: "MEDIUM",
        })
        fetchLeads()
      } else {
        const data = await res.json()
        alert(data.error || "Greška pri dodavanju")
      }
    } catch (error) {
      console.error("Add error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchLeads()
      if (showDetailModal?.id === leadId) {
        setShowDetailModal((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (error) {
      console.error("Status update error:", error)
    }
  }

  const handleCategoryChange = async (leadId: string, categoryId: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: categoryId || null }),
      })
      if (res.ok) {
        const updatedLead = await res.json()
        fetchLeads()
        if (showDetailModal?.id === leadId) {
          setShowDetailModal((prev) => (prev ? {
            ...prev,
            categoryId: updatedLead.categoryId,
            category: updatedLead.category
          } : null))
        }
      }
    } catch (error) {
      console.error("Category update error:", error)
    }
  }

  const handleAddNote = async (leadId: string) => {
    if (!newNote.trim()) return
    setSavingNote(true)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      })

      if (res.ok) {
        setNewNote("")
        // Refresh lead details
        const leadRes = await fetch(`/api/admin/leads/${leadId}`)
        const leadData = await leadRes.json()
        setShowDetailModal(leadData)
        fetchLeads()
      }
    } catch (error) {
      console.error("Note error:", error)
    } finally {
      setSavingNote(false)
    }
  }

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "NEW").length,
    inProgress: leads.filter((l) => ["CONTACTED", "INTERESTED", "NEGOTIATING"].includes(l.status)).length,
    won: leads.filter((l) => l.status === "WON").length,
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "B2B Leadovi" }]} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-indigo-500/5 via-white/80 to-purple-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Target size={40} />
                B2B Leadovi
              </h1>
              <p className="text-gray-600 mt-1">
                Upravljanje potencijalnim B2B kupcima
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm"
            >
              <Tags size={18} />
              Kategorije
            </button>
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm"
            >
              <Search size={18} />
              Pretraži Google
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition shadow-lg shadow-indigo-500/25"
            >
              <Plus size={18} />
              Dodaj lead
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Ukupno</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.new}</div>
              <div className="text-sm text-gray-500">Novi</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
              <div className="text-sm text-gray-500">U toku</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.won}</div>
              <div className="text-sm text-gray-500">Zatvoreno</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pretraži po imenu, telefonu, gradu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Svi statusi</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Svi prioriteti</option>
          {Object.entries(priorityConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {cities.length > 0 && (
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Svi gradovi</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        )}

        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Sve kategorije</option>
            {categories.filter(c => c.isActive).map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nema leadova</h3>
          <p className="text-gray-500 mb-6">Počnite dodavati leadove ili pretražite Google</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowSearchModal(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Pretraži Google
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition"
            >
              Dodaj ručno
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setShowDetailModal(lead)}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{lead.companyName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[lead.status]?.bg} ${statusConfig[lead.status]?.color}`}>
                      {statusConfig[lead.status]?.label}
                    </span>
                    <span className={`text-xs font-semibold ${priorityConfig[lead.priority]?.color}`}>
                      {priorityConfig[lead.priority]?.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {lead.category && (
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: lead.category.color }}
                      >
                        <Tags size={12} />
                        {lead.category.name}
                      </span>
                    )}
                    {lead.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {lead.city}
                      </span>
                    )}
                    {lead.businessType && !lead.category && (
                      <span className="flex items-center gap-1">
                        <Building2 size={14} />
                        {lead.businessType}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {lead.phone}
                      </span>
                    )}
                    {lead.googleRating && (
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        {lead.googleRating} ({lead.googleReviews})
                      </span>
                    )}
                    {lead._count.notes > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {lead._count.notes} bilješki
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {lead.googleMapsUrl && (
                    <a
                      href={lead.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Google Maps"
                    >
                      <MapPin size={18} />
                    </a>
                  )}
                  {lead.website && (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      title="Web stranica"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                  {lead.facebookUrl && (
                    <a
                      href={lead.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Facebook"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Dodaj novog leada</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Naziv firme *</label>
                <input
                  type="text"
                  value={newLead.companyName}
                  onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="npr. Auto Detailing Studio"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kontakt osoba</label>
                  <input
                    type="text"
                    value={newLead.contactPerson}
                    onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ime i prezime"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+387 61 123 456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="kontakt@firma.ba"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Grad</label>
                  <input
                    type="text"
                    value={newLead.city}
                    onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tuzla"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kategorija</label>
                  <select
                    value={newLead.categoryId}
                    onChange={(e) => setNewLead({ ...newLead, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Bez kategorije</option>
                    {categories.filter(c => c.isActive).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tip biznisa (legacy)</label>
                <select
                  value={newLead.businessType}
                  onChange={(e) => setNewLead({ ...newLead, businessType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Odaberi...</option>
                  <option value="Autopraonica">Autopraonica</option>
                  <option value="Detailing studio">Detailing studio</option>
                  <option value="Autoservis">Autoservis</option>
                  <option value="Benzinska pumpa">Benzinska pumpa</option>
                  <option value="Auto salon">Auto salon</option>
                  <option value="Ostalo">Ostalo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Web stranica</label>
                <input
                  type="url"
                  value={newLead.website}
                  onChange={(e) => setNewLead({ ...newLead, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://www.firma.ba"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prioritet</label>
                <select
                  value={newLead.priority}
                  onChange={(e) => setNewLead({ ...newLead, priority: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LOW">Nizak</option>
                  <option value="MEDIUM">Srednji</option>
                  <option value="HIGH">Visok</option>
                  <option value="URGENT">Hitan</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus size={18} />}
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Google Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pretraži Google Maps</h2>
                <button onClick={() => setShowSearchModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="npr. autopraonica Tuzla, detailing studio..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search size={18} />}
                  Pretraži
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Unesite pojam i kliknite pretraži da pronađete biznise</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div
                      key={result.googlePlaceId}
                      className={`p-4 rounded-xl border ${result.isExisting ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{result.companyName}</h3>
                            {result.googleRating && (
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                {result.googleRating} ({result.googleReviews})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {result.address && <p className="flex items-center gap-1"><MapPin size={14} /> {result.address}</p>}
                            {result.phone && <p className="flex items-center gap-1"><Phone size={14} /> {result.phone}</p>}
                            {result.website && (
                              <a href={result.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                                <Globe size={14} /> {result.website}
                              </a>
                            )}
                          </div>
                        </div>

                        <div>
                          {result.isExisting ? (
                            <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                              <CheckCircle size={16} />
                              Već dodan
                            </span>
                          ) : (
                            <button
                              onClick={() => handleImportLead(result)}
                              disabled={importing === result.googlePlaceId}
                              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
                            >
                              {importing === result.googlePlaceId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Plus size={16} />
                              )}
                              Dodaj
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Tags size={24} />
                  Upravljanje kategorijama leadova
                </h2>
                <button onClick={() => { setShowCategoryModal(false); setEditingCategory(null) }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Add/Edit Category Form */}
              <form onSubmit={handleSaveCategory} className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {editingCategory ? "Uredi kategoriju" : "Dodaj novu kategoriju"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naziv *</label>
                    <input
                      type="text"
                      value={editingCategory?.name || newCategory.name}
                      onChange={(e) =>
                        editingCategory
                          ? setEditingCategory({ ...editingCategory, name: e.target.value })
                          : setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="npr. Autopraonica"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Boja</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editingCategory?.color || newCategory.color}
                        onChange={(e) =>
                          editingCategory
                            ? setEditingCategory({ ...editingCategory, color: e.target.value })
                            : setNewCategory({ ...newCategory, color: e.target.value })
                        }
                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingCategory?.color || newCategory.color}
                        onChange={(e) =>
                          editingCategory
                            ? setEditingCategory({ ...editingCategory, color: e.target.value })
                            : setNewCategory({ ...newCategory, color: e.target.value })
                        }
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        placeholder="#6366f1"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                  <input
                    type="text"
                    value={editingCategory?.description || newCategory.description}
                    onChange={(e) =>
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, description: e.target.value })
                        : setNewCategory({ ...newCategory, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Kratki opis kategorije"
                  />
                </div>
                <div className="flex gap-2">
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                    >
                      Odustani
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={savingCategory}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition disabled:opacity-50"
                  >
                    {savingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
                    {editingCategory ? "Spremi izmjene" : "Dodaj kategoriju"}
                  </button>
                </div>
              </form>

              {/* Categories List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Postojeće kategorije</h3>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nema kategorija. Dodajte prvu kategoriju iznad.</p>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-xl border ${cat.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: cat.color }}
                          >
                            <Tags size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{cat.name}</h4>
                            {cat.description && (
                              <p className="text-sm text-gray-500">{cat.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {cat._count?.leads || 0} leadova
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCategory(cat)}
                            className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                            title="Uredi"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            disabled={deletingCategory === cat.id || (cat._count?.leads || 0) > 0}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title={(cat._count?.leads || 0) > 0 ? "Ne možete obrisati kategoriju sa leadovima" : "Obriši"}
                          >
                            {deletingCategory === cat.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{showDetailModal.companyName}</h2>
                  <p className="text-gray-500">
                    {showDetailModal.category?.name || showDetailModal.businessType || "Bez kategorije"}
                    {showDetailModal.city && ` • ${showDetailModal.city}`}
                  </p>
                </div>
                <button onClick={() => setShowDetailModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Category Badge */}
              {showDetailModal.category && (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: showDetailModal.category.color }}
                  >
                    <Tags size={14} />
                    {showDetailModal.category.name}
                  </span>
                </div>
              )}

              {/* Status & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={showDetailModal.status}
                    onChange={(e) => handleStatusChange(showDetailModal.id, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategorija</label>
                  <select
                    value={showDetailModal.categoryId || ""}
                    onChange={(e) => handleCategoryChange(showDetailModal.id, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Bez kategorije</option>
                    {categories.filter(c => c.isActive).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                {showDetailModal.phone && (
                  <a href={`tel:${showDetailModal.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <Phone size={20} className="text-green-500" />
                    <span className="text-gray-900">{showDetailModal.phone}</span>
                  </a>
                )}
                {showDetailModal.email && (
                  <a href={`mailto:${showDetailModal.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <Mail size={20} className="text-blue-500" />
                    <span className="text-gray-900 truncate">{showDetailModal.email}</span>
                  </a>
                )}
                {showDetailModal.website && (
                  <a href={showDetailModal.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <Globe size={20} className="text-purple-500" />
                    <span className="text-gray-900 truncate">Web stranica</span>
                  </a>
                )}
                {showDetailModal.googleMapsUrl && (
                  <a href={showDetailModal.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <MapPin size={20} className="text-red-500" />
                    <span className="text-gray-900 truncate">Google Maps</span>
                  </a>
                )}
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Bilješke
                </h3>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Dodaj bilješku..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddNote(showDetailModal.id)
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddNote(showDetailModal.id)}
                    disabled={savingNote || !newNote.trim()}
                    className="px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition disabled:opacity-50"
                  >
                    {savingNote ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {showDetailModal.notes.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Nema bilješki</p>
                  ) : (
                    showDetailModal.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-gray-900 text-sm">{note.content}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(note.createdAt).toLocaleDateString("bs-BA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
