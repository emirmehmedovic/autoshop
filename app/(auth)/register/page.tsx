import { redirect } from "next/navigation"

// Registracija je onemogućena - admin nalozi se kreiraju kroz admin panel
export default function RegisterPage() {
  redirect("/login")
}
