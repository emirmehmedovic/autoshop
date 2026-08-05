import { Breadcrumbs } from "@/components/admin/Breadcrumbs"
import { Settings as SettingsIcon, Globe, Mail, MessageSquare, BarChart, Truck, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Postavke" }]} />

      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 via-white/80 to-amber-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-500/30" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <SettingsIcon size={40} />
              Postavke
            </h1>
            <p className="text-gray-600 mt-1">
              Konfiguracija aplikacije i integracija
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <Globe className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Opšte postavke</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Naziv sajta
              </label>
              <input
                type="text"
                defaultValue="AutoShop"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                defaultValue={process.env.ADMIN_EMAIL || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-400 text-xs mt-1">
                Postavlja se kroz .env fajl
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Kontakt telefon
              </label>
              <input
                type="tel"
                placeholder="+387 XX XXX XXX"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Adresa
              </label>
              <textarea
                rows={2}
                placeholder="Ulica i broj, Grad, Poštanski broj"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <Mail className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email postavke</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Resend API Key
              </label>
              <input
                type="password"
                defaultValue={process.env.RESEND_API_KEY || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono cursor-not-allowed"
              />
              <p className="text-gray-400 text-xs mt-1">
                Postavlja se kroz .env fajl
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 text-sm">
                Email notifikacije se šalju kroz Resend API za nove narudžbe, status promjene i slično.
              </p>
            </div>
          </div>
        </div>

        {/* Telegram Settings */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <MessageSquare className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Telegram postavke</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Bot Token
              </label>
              <input
                type="password"
                defaultValue={process.env.TELEGRAM_BOT_TOKEN || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Chat ID
              </label>
              <input
                type="text"
                defaultValue={process.env.TELEGRAM_CHAT_ID || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono cursor-not-allowed"
              />
            </div>

            <p className="text-gray-400 text-xs">
              Postavlja se kroz .env fajl
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 text-sm">
                Telegram notifikacije se šalju adminu za nove narudžbe i important events.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Settings */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <BarChart className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Analitika</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Meta Pixel ID
              </label>
              <input
                type="text"
                defaultValue={process.env.NEXT_PUBLIC_META_PIXEL_ID || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Clarity ID
              </label>
              <input
                type="text"
                defaultValue={process.env.NEXT_PUBLIC_CLARITY_ID || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono cursor-not-allowed"
              />
            </div>

            <p className="text-gray-400 text-xs">
              Postavlja se kroz .env fajl
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 text-sm">
                Meta Pixel i Clarity IDs se koriste za tracking konverzija i ponašanja korisnika.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <Truck className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dostava</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Cijena dostave (KM)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="5.00"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Besplatna dostava od (KM)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="50.00"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-orange-700 text-sm font-bold mb-2">
                Napomena
              </p>
              <p className="text-gray-600 text-sm">
                Ove postavke trenutno nisu implementirane u bazi. Potrebno je kreirati Settings model u Prismi.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/5 via-white/80 to-indigo-500/5 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <CreditCard className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Plaćanje</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-gray-900 font-bold mb-2">Dostupne metode:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Gotovina pri preuzimanju (COD)
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700 text-sm">
                Za integraciju online plaćanja (kartice, PayPal), potrebno je konfigurisati payment gateway.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-white/80 to-indigo-500/10 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <SettingsIcon size={24} className="text-blue-500" />
          Napomena o postavkama
        </h3>
        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            • ENV varijable (Email, Telegram, Analytics) se postavljaju kroz <code className="px-2 py-1 bg-white rounded font-mono text-orange-500 border border-gray-200">.env</code> fajl na serveru
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
