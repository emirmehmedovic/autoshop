import { Metadata } from "next"

export const siteConfig = {
  name: "GlossDrive",
  description: "Premium auto kozmetika, detailing proizvodi i oprema za autopraonice u Bosni i Hercegovini. Dostava širom BiH.",
  url: "https://glossdrive.ba",
  ogImage: "/og-image.jpg",
  keywords: [
    "auto kozmetika",
    "detailing",
    "car care",
    "repromatrijali",
    "BiH",
    "Tuzla",
    "autopraonice",
    "poliranje",
    "pranje auta",
    "auto detailing",
  ],
  contact: {
    phone: "+38761577576",
    email: "info@glossdrive.ba",
    address: {
      city: "Tuzla",
      country: "BA",
    },
  },
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

// LocalBusiness JSON-LD
export function generateLocalBusinessJsonLd(options?: {
  name?: string
  description?: string
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: options?.name || siteConfig.name,
    description: options?.description || siteConfig.description,
    url: options?.url || siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.address.city,
      addressCountry: siteConfig.contact.address.country,
    },
    openingHours: "Mo-Fr 09:00-17:00",
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Bosnia and Herzegovina",
    },
  }
}

// FAQ JSON-LD
export function generateFAQJsonLd(
  faqItems: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

// BreadcrumbList JSON-LD
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}

// Organization JSON-LD
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      areaServed: "BA",
      availableLanguage: ["bs", "hr", "sr"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.address.city,
      addressCountry: siteConfig.contact.address.country,
    },
  }
}
