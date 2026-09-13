import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { ClarityScript } from "@/components/analytics/ClarityScript";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GlossDrive - Detailing & Car Care | BiH",
  description: "Online prodaja auto kozmetike i repromatrijala u Bosni i Hercegovini. Brza dostava, plaćanje pouzećem.",
  keywords: ["auto kozmetika", "repromatrijali", "detailing", "car care", "BiH", "Sarajevo", "online kupovina"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className={`${plusJakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <SessionProvider>{children}</SessionProvider>
        <MetaPixel />
        <ClarityScript />
      </body>
    </html>
  );
}
