import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Server component that protects admin routes by checking user role
 * Use this in admin pages that need role verification beyond the middleware check
 */
export async function AdminGuard() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return null
}
