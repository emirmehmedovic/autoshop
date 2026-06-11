"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    customerType: "B2C" as "B2C" | "B2B",
    // B2B polja
    companyName: "",
    pib: "",
    address: "",
    contactPerson: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne podudaraju")
      return
    }

    if (formData.password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Greška pri registraciji")
      }

      if (formData.customerType === "B2B") {
        router.push("/login?message=b2b-pending")
      } else {
        router.push("/login?message=registered")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Kreirajte nalog
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Već imate nalog?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Prijavite se
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Tip kupca */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tip kupca</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="B2C"
                  checked={formData.customerType === "B2C"}
                  onChange={(e) =>
                    setFormData({ ...formData, customerType: e.target.value as "B2C" | "B2B" })
                  }
                  className="mr-2"
                />
                Privatni kupac
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="B2B"
                  checked={formData.customerType === "B2B"}
                  onChange={(e) =>
                    setFormData({ ...formData, customerType: e.target.value as "B2C" | "B2B" })
                  }
                  className="mr-2"
                />
                Firma (B2B)
              </label>
            </div>
          </div>

          {/* Osnovna polja */}
          <div className="space-y-4">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email adresa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ime i prezime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Telefon"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Lozinka"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Potvrdite lozinku"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* B2B dodatna polja */}
          {formData.customerType === "B2B" && (
            <div className="space-y-4 border-t pt-4">
              <p className="text-sm text-gray-600">Podaci o firmi</p>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Naziv firme"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={formData.pib}
                onChange={(e) => setFormData({ ...formData, pib: e.target.value })}
                placeholder="PIB (opciono)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresa firme"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Kontakt osoba"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                * B2B nalozi zahtijevaju odobrenje administratora prije korištenja
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Kreiranje naloga..." : "Kreiraj nalog"}
          </button>
        </form>
      </div>
    </div>
  )
}
