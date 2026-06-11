// Meta Pixel tracking funkcije
// Koristi se u client komponentama

declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: object) => void
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// Helper funkcija za slanje evenata
export const trackEvent = (event: string, data?: object) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data)
    console.log(`📊 Meta Pixel: ${event}`, data)
  }
}

// Standard eventi

export const trackPageView = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView")
  }
}

export const trackViewContent = (product: {
  id: string
  name: string
  price: number
  category?: string
}) => {
  trackEvent("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "BAM",
    content_category: product.category,
  })
}

export const trackAddToCart = (product: {
  id: string
  name: string
  price: number
  quantity?: number
}) => {
  trackEvent("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price * (product.quantity || 1),
    currency: "BAM",
    num_items: product.quantity || 1,
  })
}

export const trackInitiateCheckout = (cart: {
  items: Array<{ id: string; name: string; price: number; quantity: number }>
  total: number
}) => {
  trackEvent("InitiateCheckout", {
    content_ids: cart.items.map((item) => item.id),
    contents: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
    value: cart.total,
    currency: "BAM",
    num_items: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  })
}

export const trackPurchase = (order: {
  orderNumber: string
  total: number
  items: Array<{
    productId: string
    quantity: number
  }>
}) => {
  trackEvent("Purchase", {
    value: order.total,
    currency: "BAM",
    content_ids: order.items.map((item) => item.productId),
    contents: order.items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    })),
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    order_id: order.orderNumber,
  })
}

export const trackSearch = (searchQuery: string) => {
  trackEvent("Search", {
    search_string: searchQuery,
  })
}

export const trackLead = () => {
  trackEvent("Lead")
}

export const trackCompleteRegistration = () => {
  trackEvent("CompleteRegistration")
}

// Custom eventi (za landing pages)
export const trackCustomEvent = (eventName: string, data?: object) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, data)
    console.log(`📊 Meta Pixel Custom: ${eventName}`, data)
  }
}
