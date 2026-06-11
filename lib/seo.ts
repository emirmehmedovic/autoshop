import { Metadata } from "next"

export const siteConfig = {
  name: "AutoShop",
  description: "Online prodaja auto kozmetike i repromatrijala u Bosni i Hercegovini",
  url: "https://autoshop.ba",
  ogImage: "/og-image.jpg",
  keywords: [
    "auto kozmetika",
    "repromatrijali",
    "BiH",
    "Sarajevo",
    "auto njega",
    "poliranje",
    "pranje auta",
    "auto detailing",
  ],
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  noIndex = false,
}: {
  title: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  noIndex?: boolean
}): Metadata {
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`
  const fullDescription = description || siteConfig.description
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url
  const ogImage = image || siteConfig.ogImage

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords?.join(", ") || siteConfig.keywords.join(", "),
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "bs_BA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

// SEO za proizvode
export function generateProductSEO(product: {
  name: string
  description: string
  price: number
  images: { url: string }[]
  metaTitle?: string | null
  metaDesc?: string | null
  slug: string
}): Metadata {
  return generateSEOMetadata({
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.description.substring(0, 160),
    image: product.images[0]?.url,
    url: `/product/${product.slug}`,
    keywords: ["kupi", product.name, "cijena", "online"],
  })
}

// SEO za kategorije
export function generateCategorySEO(category: {
  name: string
  description?: string | null
  slug: string
}): Metadata {
  return generateSEOMetadata({
    title: `${category.name} - Proizvodi`,
    description:
      category.description ||
      `Pregledajte našu ponudu proizvoda iz kategorije ${category.name}. Brza dostava širom BiH.`,
    url: `/shop?category=${category.slug}`,
  })
}

// JSON-LD structured data
export function generateProductJsonLd(product: {
  name: string
  description: string
  price: number
  images: { url: string }[]
  sku: string
  slug: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: "BAM",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  }
}
