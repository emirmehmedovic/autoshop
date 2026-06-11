const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface Order {
  orderNumber: string
  total: number
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string | null
  isB2B: boolean
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

export async function sendTelegramNotification(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("TELEGRAM_BOT_TOKEN ili TELEGRAM_CHAT_ID nije postavljen")
    return
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Telegram API greška:", error)
    } else {
      console.log("📱 Telegram notifikacija poslana")
    }
  } catch (error) {
    console.error("Greška pri slanju Telegram notifikacije:", error)
  }
}

export async function notifyNewOrder(order: Order) {
  const itemsList = order.items
    .map((item) => `  • ${item.product.name} x${item.quantity}`)
    .join("\n")

  const message = `
🛒 <b>Nova narudžba!</b>

📦 Broj: <code>#${order.orderNumber}</code>
👤 Kupac: ${order.shippingName}
📞 Tel: ${order.shippingPhone}
📍 Grad: ${order.shippingCity}
💰 Iznos: <b>${order.total.toFixed(2)} KM</b> (pouzećem)
${order.isB2B ? "🏢 <b>B2B narudžba</b>" : ""}

<b>Proizvodi:</b>
${itemsList}

<b>Adresa dostave:</b>
${order.shippingAddress}
${order.shippingZip ? order.shippingZip + " " : ""}${order.shippingCity}
  `.trim()

  await sendTelegramNotification(message)
}

export async function notifyOrderStatusChange(
  orderNumber: string,
  oldStatus: string,
  newStatus: string,
  customerName: string
) {
  const statusEmojis: Record<string, string> = {
    PENDING: "🕐",
    CONFIRMED: "✅",
    PROCESSING: "📦",
    SHIPPED: "🚚",
    DELIVERED: "✨",
    CANCELLED: "❌",
    RETURNED: "↩️",
  }

  const message = `
${statusEmojis[newStatus] || "📋"} <b>Status narudžbe promijenjen</b>

📦 Narudžba: <code>#${orderNumber}</code>
👤 Kupac: ${customerName}
🔄 Status: ${oldStatus} → <b>${newStatus}</b>
  `.trim()

  await sendTelegramNotification(message)
}

export async function notifyLowStock(productName: string, currentStock: number) {
  const message = `
⚠️ <b>Niska zaliha!</b>

📦 Proizvod: ${productName}
📊 Preostalo: <b>${currentStock} komada</b>

Potrebno je naručiti nove zalihe.
  `.trim()

  await sendTelegramNotification(message)
}
