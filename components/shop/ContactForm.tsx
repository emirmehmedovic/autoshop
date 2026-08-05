"use client"

import { useState } from "react"
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { z } from "zod"

const contactSchema = z.object({
  ime: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Unesite validnu email adresu"),
  telefon: z.string().min(9, "Unesite validan broj telefona").optional().or(z.literal("")),
  tipUpita: z.enum(["opci", "narudzba", "veleprodaja", "reklamacija", "saradnja"]),
  poruka: z.string().min(10, "Poruka mora imati najmanje 10 karaktera"),
})

type ContactFormData = z.infer<typeof contactSchema>

const tipUpitaOptions = [
  { value: "opci", label: "Opći upit" },
  { value: "narudzba", label: "Narudžba / Cijena" },
  { value: "veleprodaja", label: "Veleprodaja / B2B" },
  { value: "reklamacija", label: "Reklamacija" },
  { value: "saradnja", label: "Saradnja" },
]

interface ContactFormProps {
  defaultTipUpita?: ContactFormData["tipUpita"]
  className?: string
}

export function ContactForm({ defaultTipUpita = "opci", className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    ime: "",
    email: "",
    telefon: "",
    tipUpita: defaultTipUpita,
    poruka: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrors({})
    setErrorMessage("")

    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ContactFormData] = issue.message
        }
      })
      setErrors(fieldErrors)
      setStatus("idle")
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Greška prilikom slanja poruke")
      }

      setStatus("success")
      setFormData({
        ime: "",
        email: "",
        telefon: "",
        tipUpita: defaultTipUpita,
        poruka: "",
      })
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Greška prilikom slanja poruke")
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-2xl p-8 text-center backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10 border-[5px] border-white/80 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Poruka uspješno poslana!</h3>
        <p className="text-gray-600 mb-6">
          Hvala vam na upitu. Odgovorit ćemo vam u najkraćem mogućem roku.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition"
        >
          Pošalji novu poruku
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-5">
        {/* Ime */}
        <div>
          <label htmlFor="ime" className="block text-sm font-semibold text-gray-700 mb-2">
            Ime i prezime <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="ime"
            name="ime"
            value={formData.ime}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.ime ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
            } focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition outline-none`}
            placeholder="Vaše ime i prezime"
          />
          {errors.ime && <p className="mt-1.5 text-sm text-red-500">{errors.ime}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email adresa <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
            } focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition outline-none`}
            placeholder="vasa@email.com"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="telefon" className="block text-sm font-semibold text-gray-700 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            id="telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.telefon ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
            } focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition outline-none`}
            placeholder="+387 61 xxx xxx"
          />
          {errors.telefon && <p className="mt-1.5 text-sm text-red-500">{errors.telefon}</p>}
        </div>

        {/* Tip upita */}
        <div>
          <label htmlFor="tipUpita" className="block text-sm font-semibold text-gray-700 mb-2">
            Tip upita <span className="text-red-500">*</span>
          </label>
          <select
            id="tipUpita"
            name="tipUpita"
            value={formData.tipUpita}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition outline-none"
          >
            {tipUpitaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Poruka */}
        <div>
          <label htmlFor="poruka" className="block text-sm font-semibold text-gray-700 mb-2">
            Poruka <span className="text-red-500">*</span>
          </label>
          <textarea
            id="poruka"
            name="poruka"
            value={formData.poruka}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.poruka ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
            } focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition outline-none resize-none`}
            placeholder="Opišite vaš upit..."
          />
          {errors.poruka && <p className="mt-1.5 text-sm text-red-500">{errors.poruka}</p>}
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Slanje...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Pošalji poruku
            </>
          )}
        </button>
      </div>
    </form>
  )
}
