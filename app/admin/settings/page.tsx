import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { Settings as SettingsIcon, Globe, Mail, MessageSquare, BarChart, Truck, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Postavke" }]} />

      <div className="backdrop-blur-md bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-lime-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <SettingsIcon size={40} />
              Postavke
            </h1>
            <p className="text-gray-400 mt-1">
              Konfiguracija aplikacije i integracija
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20">
              <Globe className="text-lime-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Opšte postavke</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Naziv sajta
              </label>
              <input
                type="text"
                defaultValue="AutoShop"
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                defaultValue={process.env.ADMIN_EMAIL || ""}
                disabled
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-gray-400 placeholder-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">
                Postavlja se kroz .env fajl
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Kontakt telefon
              </label>
              <input
                type="tel"
                placeholder="+387 XX XXX XXX"
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Adresa
              </label>
              <textarea
                rows={2}
                placeholder="Ulica i broj, Grad, Poštanski broj"
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20">
              <Mail className="text-lime-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Email postavke</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Resend API Key
              </label>
              <input
                type="password"
                defaultValue={process.env.RESEND_API_KEY || ""}
                disabled
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-gray-400 font-mono cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">
                Postavlja se kroz .env fajl
              </p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-sm">
                📧 Email notifikacije se šalju kroz Resend API za nove narudžbe, status promjene i slično.
              </p>
            </div>
          </div>
        </div>

        {/* Telegram Settings */}
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20">
              <MessageSquare className="text-lime-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Telegram postavke</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Bot Token
              </label>
              <input
                type="password"
                defaultValue={process.env.TELEGRAM_BOT_TOKEN || ""}
                disabled
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-gray-400 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Chat ID
              </label>
              <input
                type="text"
                defaultValue={process.env.TELEGRAM_CHAT_ID || ""}
                disabled
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-gray-400 font-mono cursor-not-allowed"
              />
            </div>

            <p className="text-gray-500 text-xs">
              Postavlja se kroz .env fajl
            </p>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-sm">
                💬 Telegram notifikacije se šalju adminu za nove narudžbe i important events.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Settings */}
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20">
              <BarChart className="text-lime-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Analitika</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Meta Pixel ID
              </label>
              <input
                type="text"
                defaultValue={process.env.NEXT_PUBLIC_META_PIXEL_ID || ""}
                disabled
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-gray-400 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Clarity ID
              </label>
              <input
                type="text"
                defaultValue={process.env.NEXT_PUBLIC_CLARITY_ID || ""}
                disabled
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-gray-400 font-mono cursor-not-allowed"
              />
            </div>

            <p className="text-gray-500 text-xs">
              Postavlja se kroz .env fajl
            </p>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-sm">
                📊 Meta Pixel i Clarity IDs se koriste za tracking konverzija i ponašanja korisnika.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20">
              <Truck className="text-lime-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Dostava</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Cijena dostave (KM)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="5.00"
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Besplatna dostava od (KM)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="50.00"
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
              />
            </div>

            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <p className="text-orange-400 text-sm font-bold mb-2">
                ⚠️ Napomena
              </p>
              <p className="text-gray-400 text-sm">
                Ove postavke trenutno nisu implementirane u bazi. Potrebno je kreirati Settings model u Prismi.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="backdrop-blur-md bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/20">
              <CreditCard className="text-lime-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Plaćanje</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 border border-white/10 rounded-xl">
              <p className="text-white font-bold mb-2">Dostupne metode:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="w-2 h-2 bg-lime-400 rounded-full"></span>
                  Gotovina pri preuzimanju (COD)
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-sm">
                💳 Za integraciju online plaćanja (kartice, PayPal), potrebno je konfigurisati payment gateway.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 backdrop-blur-md bg-gradient-to-br from-blue-800/40 to-blue-900/40 border border-blue-500/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <SettingsIcon size={24} className="text-blue-400" />
          Napomena o postavkama
        </h3>
        <div className="space-y-2 text-gray-300 text-sm">
          <p>
            • ENV varijable (Email, Telegram, Analytics) se postavljaju kroz <code className="px-2 py-1 bg-slate-900/50 rounded font-mono text-lime-400">.env</code> fajl na serveru
          </p>
          <p>
            • Za perzistentne postavke (dostava, plaćanje), potrebno je kreirati Settings model u Prismi
          </p>
          <p>
            • Trenutno polja koja nisu read-only ne čuvaju promjene (WIP)
          </p>
        </div>
      </div>
    </div>
  )
}
