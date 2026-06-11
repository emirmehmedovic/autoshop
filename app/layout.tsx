import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { ClarityScript } from "@/components/analytics/ClarityScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AutoShop - Auto Kozmetika i Repromatrijali | BiH",
  description: "Online prodaja auto kozmetike i repromatrijala u Bosni i Hercegovini. Brza dostava, plaćanje pouzećem.",
  keywords: ["auto kozmetika", "repromatrijali", "BiH", "Sarajevo", "online kupovina"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>{children}</SessionProvider>
        <MetaPixel />
        <ClarityScript />
      </body>
    </html>
  );
}
