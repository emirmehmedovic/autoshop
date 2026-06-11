import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "CUSTOMER"
      customerType: "B2C" | "B2B"
    } & DefaultSession["user"]
  }
  interface User {
    role: "ADMIN" | "CUSTOMER"
    customerType: "B2C" | "B2B"
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
            include: { b2bProfile: true },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          const valid = await bcrypt.compare(password, user.passwordHash)
          if (!valid) {
            return null
          }

          // Provjera da li je B2B korisnik odobren
          if (user.customerType === "B2B" && !user.isApproved) {
            throw new Error("B2B nalog čeka odobrenje administratora")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            customerType: user.customerType,
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            return null
          }
          throw error
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.customerType = user.customerType
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "CUSTOMER"
        session.user.customerType = token.customerType as "B2C" | "B2B"
      }
      return session
    },
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl
      const isLoggedIn = !!auth?.user
      const isAdmin = auth?.user?.role === "ADMIN"

      // Zaštita admin ruta
      if (pathname.startsWith("/admin")) {
        return isLoggedIn && isAdmin
      }

      // Zaštita account ruta
      if (pathname.startsWith("/account")) {
        return isLoggedIn
      }

      return true
    },
  },
})
