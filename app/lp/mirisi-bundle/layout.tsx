import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Signature Collection - Premium Miris za Auto | GlossDrive",
  description: "Premium miris za auto izrađen od pravog drveta. Diskretan, dugotrajan i savršen za svaki enterijer. Od 25 KM.",
  openGraph: {
    title: "Signature Collection - Premium Miris za Auto",
    description: "Premium miris za auto izrađen od pravog drveta. Diskretan, dugotrajan i savršen za svaki enterijer. Od 25 KM.",
    type: "website",
    url: "https://autokozmetika.ba/lp/mirisi-bundle",
    images: [
      {
        url: "https://autokozmetika.ba/products/signature.png",
        width: 1200,
        height: 630,
        alt: "Signature Collection miris za auto",
      },
    ],
    siteName: "GlossDrive",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signature Collection - Premium Miris za Auto",
    description: "Premium miris za auto izrađen od pravog drveta. Od 25 KM.",
    images: ["https://autokozmetika.ba/products/signature.png"],
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
