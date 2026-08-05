import { Header } from "@/components/shop/Header"
import { Footer } from "@/components/shop/Footer"
import { BackgroundPattern } from "@/components/shop/BackgroundPattern"
import { ContactButtons } from "@/components/shop/ContactButtons"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundPattern />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ContactButtons />
    </div>
  )
}
