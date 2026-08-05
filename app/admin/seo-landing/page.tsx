"use client"

import { useState } from "react"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import {
  Globe,
  ExternalLink,
  Search,
  FileText,
  MapPin,
  Briefcase,
  Info,
  Scale,
  Megaphone,
  Plus,
  Eye,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface LandingPage {
  id: string
  title: string
  url: string
  category: "basic" | "category" | "b2b" | "local" | "legal" | "ads"
  description: string
  keywords: string[]
  isActive: boolean
}

const seoPages: LandingPage[] = [
  // Osnovne stranice
  {
    id: "o-nama",
    title: "O nama",
    url: "/o-nama",
    category: "basic",
    description: "Brand story i informacije o GlossDrive-u",
    keywords: ["glossdrive", "o nama", "auto kozmetika tuzla"],
    isActive: true,
  },
  {
    id: "kontakt",
    title: "Kontakt",
    url: "/kontakt",
    category: "basic",
    description: "Kontakt forma i informacije",
    keywords: ["kontakt", "glossdrive kontakt", "auto kozmetika kontakt"],
    isActive: true,
  },
  {
    id: "dostava",
    title: "Dostava",
    url: "/dostava",
    category: "basic",
    description: "Informacije o dostavi i plaćanju",
    keywords: ["dostava", "kako naručiti", "plaćanje pouzećem"],
    isActive: true,
  },
  // Kategorije
  {
    id: "auto-kozmetika",
    title: "Auto Kozmetika",
    url: "/auto-kozmetika",
    category: "category",
    description: "Svi proizvodi za njegu vozila",
    keywords: ["auto kozmetika", "sredstva za auto", "njega vozila"],
    isActive: true,
  },
  {
    id: "mirisi-za-auto",
    title: "Mirisi za Auto",
    url: "/mirisi-za-auto",
    category: "category",
    description: "Osvježivači i mirisi za automobile",
    keywords: ["mirisi za auto", "osvježivači", "auto parfemi"],
    isActive: true,
  },
  {
    id: "ciscenje-enterijera",
    title: "Čišćenje Enterijera",
    url: "/ciscenje-enterijera",
    category: "category",
    description: "Sredstva za čišćenje unutrašnjosti vozila",
    keywords: ["čišćenje enterijera", "unutrašnjost vozila", "sredstva za enterijer"],
    isActive: true,
  },
  {
    id: "ciscenje-eksterijera",
    title: "Čišćenje Eksterijera",
    url: "/ciscenje-eksterijera",
    category: "category",
    description: "Sredstva za pranje i čišćenje vanjštine vozila",
    keywords: ["pranje auta", "šampon za auto", "sredstva za pranje"],
    isActive: true,
  },
  {
    id: "poliranje-detailing",
    title: "Poliranje i Detailing",
    url: "/poliranje-detailing",
    category: "category",
    description: "Profesionalni detailing proizvodi",
    keywords: ["poliranje auta", "auto detailing", "pasta za poliranje"],
    isActive: true,
  },
  // B2B
  {
    id: "veleprodaja",
    title: "Veleprodaja",
    url: "/veleprodaja",
    category: "b2b",
    description: "B2B prodaja i veleprodajne cijene",
    keywords: ["veleprodaja", "b2b", "repromaterijal"],
    isActive: true,
  },
  {
    id: "oprema-za-autopraonice",
    title: "Oprema za Autopraonice",
    url: "/oprema-za-autopraonice",
    category: "b2b",
    description: "Profesionalna oprema za autopraonice",
    keywords: ["oprema autopraonice", "repromaterijal", "profesionalna oprema"],
    isActive: true,
  },
  {
    id: "samousluzne-autopraonice",
    title: "Samouslužne Autopraonice",
    url: "/samousluzne-autopraonice",
    category: "b2b",
    description: "Oprema za samouslužne autopraonice",
    keywords: ["samouslužne autopraonice", "oprema", "sredstva za praonice"],
    isActive: true,
  },
  // Lokalni SEO
  {
    id: "auto-kozmetika-tuzla",
    title: "Auto Kozmetika Tuzla",
    url: "/auto-kozmetika-tuzla",
    category: "local",
    description: "Lokalna SEO stranica za Tuzlu",
    keywords: ["auto kozmetika tuzla", "detailing tuzla", "car care tuzla"],
    isActive: true,
  },
  {
    id: "autopraonice-tuzla",
    title: "Autopraonice Tuzla",
    url: "/autopraonice-tuzla",
    category: "local",
    description: "Oprema za autopraonice u Tuzli",
    keywords: ["autopraonice tuzla", "oprema tuzla", "repromaterijal tuzla"],
    isActive: true,
  },
  {
    id: "auto-kozmetika-bih",
    title: "Auto Kozmetika BiH",
    url: "/auto-kozmetika-bih",
    category: "local",
    description: "Auto kozmetika za cijelu BiH",
    keywords: ["auto kozmetika bih", "bosna", "detailing bih"],
    isActive: true,
  },
  // Pravne
  {
    id: "privatnost",
    title: "Politika Privatnosti",
    url: "/privatnost",
    category: "legal",
    description: "Politika privatnosti i zaštita podataka",
    keywords: ["privatnost", "gdpr", "zaštita podataka"],
    isActive: true,
  },
  {
    id: "uslovi",
    title: "Uslovi Korištenja",
    url: "/uslovi",
    category: "legal",
    description: "Uslovi korištenja web stranice",
    keywords: ["uslovi", "pravila", "terms"],
    isActive: true,
  },
]

const categoryInfo = {
  basic: { label: "Osnovne", color: "blue", icon: Info },
  category: { label: "Kategorije", color: "green", icon: FileText },
  b2b: { label: "B2B", color: "purple", icon: Briefcase },
  local: { label: "Lokalni SEO", color: "orange", icon: MapPin },
  legal: { label: "Pravne", color: "gray", icon: Scale },
  ads: { label: "Reklame", color: "pink", icon: Megaphone },
}

export default function SeoLandingPage() {
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPages = seoPages.filter((page) => {
    const matchesFilter = filter === "all" || page.category === filter
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: seoPages.length,
    basic: seoPages.filter((p) => p.category === "basic").length,
    category: seoPages.filter((p) => p.category === "category").length,
    b2b: seoPages.filter((p) => p.category === "b2b").length,
    local: seoPages.filter((p) => p.category === "local").length,
    legal: seoPages.filter((p) => p.category === "legal").length,
    ads: seoPages.filter((p) => p.category === "ads").length,
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "SEO & Landing" }]} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/5 via-white/80 to-teal-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/30" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Globe size={40} />
                SEO & Landing Pages
              </h1>
              <p className="text-gray-600 mt-1">
                Upravljanje SEO stranicama i landing pages za reklame
              </p>
            </div>
          </div>

          <button
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition shadow-lg shadow-emerald-500/25"
          >
            <Plus size={20} />
            Nova Landing Page
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div
          onClick={() => setFilter("all")}
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
            filter === "all"
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Ukupno</div>
        </div>
        {Object.entries(categoryInfo).map(([key, info]) => {
          const Icon = info.icon
          const count = stats[key as keyof typeof stats] || 0
          return (
            <div
              key={key}
              onClick={() => setFilter(key)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                filter === key
                  ? `border-${info.color}-500 bg-${info.color}-50`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={`text-${info.color}-500`} />
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
              <div className="text-sm text-gray-600">{info.label}</div>
            </div>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pretraži stranice po naslovu, URL-u ili ključnim riječima..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
        />
      </div>

      {/* Pages list */}
      <div className="space-y-3">
        {filteredPages.map((page) => {
          const catInfo = categoryInfo[page.category]
          const Icon = catInfo.icon
          return (
            <div
              key={page.id}
              className="relative overflow-hidden rounded-xl p-5 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 border-[3px] border-white/80 shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${catInfo.color}-500 to-${catInfo.color}-600 flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{page.title}</h3>
                    <p className="text-sm text-gray-500">{page.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${catInfo.color}-100 text-${catInfo.color}-700`}>
                    {catInfo.label}
                  </span>

                  <Link
                    href={page.url}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                  >
                    <Eye size={16} />
                    Pregled
                  </Link>

                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition"
                  >
                    <ExternalLink size={16} />
                    Otvori
                  </a>
                </div>
              </div>

              {/* URL and Keywords */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <code className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 font-mono">
                    {page.url}
                  </code>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {page.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                  {page.keywords.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{page.keywords.length - 3} više
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nema rezultata za vašu pretragu</p>
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-white/80 to-teal-500/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp size={24} className="text-emerald-500" />
          SEO Savjeti
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div className="space-y-2">
            <p>• Svaka stranica ima jedinstveni H1 tag i meta opis</p>
            <p>• Schema.org markup je dodan za LocalBusiness i FAQ</p>
            <p>• Lokalne ključne riječi (Tuzla, BiH) su uključene</p>
          </div>
          <div className="space-y-2">
            <p>• Landing pages za reklame kreirajte u zasebnoj kategoriji</p>
            <p>• Pratite performanse kroz Google Search Console</p>
            <p>• Redovno ažurirajte sadržaj za bolje rangiranje</p>
          </div>
        </div>
      </div>
    </div>
  )
}
