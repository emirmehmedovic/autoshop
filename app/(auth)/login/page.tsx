"use client"

import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import Link from "next/link"
import { Lock, Mail, LogIn, AlertCircle, Loader2, Sparkles } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Pogrešan email ili lozinka")
      } else {
        router.push(redirect)
        router.refresh()
      }
    } catch (err) {
      setError("Došlo je do greške. Pokušajte ponovo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Sparkles className="text-white" size={28} />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">GlossDrive</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin prijava
          </h1>
          <p className="text-gray-600">
            Prijavite se za pristup administraciji
          </p>
        </div>

        {/* Login card */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-orange-50/50 border-[5px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 pointer-events-none" />

          <form className="relative space-y-6" onSubmit={handleSubmit}>
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email adresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  placeholder="admin@glossdrive.ba"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Lozinka
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Prijava u toku...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Prijavite se
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to shop link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-500 transition text-sm"
          >
            &larr; Vrati se na shop
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Učitavanje...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
