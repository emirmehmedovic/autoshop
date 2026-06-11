import { Resend } from "resend"

// Lazy initialization - only create client when needed and API key is available
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

interface Order {
  id: string
  orderNumber: string
  total: number
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string | null
  shippingNote: string | null
  guestEmail: string | null
  isB2B: boolean
  createdAt: Date
  items: Array<{
    quantity: number
    unitPrice: number
    total: number
    product: {
      name: string
    }
  }>
  user?: {
    email: string
  } | null
}

export async function sendOrderConfirmationToCustomer(order: Order) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY nije postavljen, preskačem slanje emaila")
    return
  }

  const customerEmail = order.guestEmail || order.user?.email

  if (!customerEmail) {
    console.error("Email adresa kupca nije pronađena")
    return
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.product.name}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${item.unitPrice.toFixed(2)} KM
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <strong>${item.total.toFixed(2)} KM</strong>
      </td>
    </tr>
  `
    )
    .join("")

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">AutoShop</h1>
    <p style="color: #dbeafe; margin: 10px 0 0 0;">Potvrda narudžbe</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Poštovani/a <strong>${order.shippingName}</strong>,</p>

    <p>Hvala vam na narudžbi! Vaša narudžba je uspješno primljena i trenutno se procesira.</p>

    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #1f2937;">
        Narudžba #${order.orderNumber}
      </h2>
      <p style="margin: 0; color: #6b7280;">
        ${new Date(order.createdAt).toLocaleDateString("bs-BA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>

    <h3 style="margin-top: 30px; margin-bottom: 15px; font-size: 18px; color: #1f2937;">Proizvodi:</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Proizvod</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Količina</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Cijena</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Ukupno</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span>Ukupno proizvodi:</span>
        <strong>${order.total.toFixed(2)} KM</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span>Dostava:</span>
        <strong style="color: #059669;">Besplatna</strong>
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #e5e7eb; font-size: 18px;">
        <strong>Ukupno za plaćanje:</strong>
        <strong style="color: #2563eb;">${order.total.toFixed(2)} KM</strong>
      </div>
    </div>

    <h3 style="margin-bottom: 15px; font-size: 18px; color: #1f2937;">Adresa dostave:</h3>
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <p style="margin: 0 0 5px 0;"><strong>${order.shippingName}</strong></p>
      <p style="margin: 0 0 5px 0;">${order.shippingAddress}</p>
      <p style="margin: 0 0 5px 0;">${order.shippingZip ? order.shippingZip + " " : ""}${order.shippingCity}</p>
      <p style="margin: 0 0 5px 0;">Tel: ${order.shippingPhone}</p>
      ${order.shippingNote ? `<p style="margin: 10px 0 0 0; padding-top: 10px; border-top: 1px solid #e5e7eb;"><em>Napomena: ${order.shippingNote}</em></p>` : ""}
    </div>

    <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
      <p style="margin: 0; font-weight: 600; color: #1e40af;">💰 Plaćanje pouzećem (COD)</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e3a8a;">Platite gotovinom prilikom preuzimanja paketa.</p>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
      Vaša narudžba će biti dostavljena u roku od 1-3 radna dana.
      O svakoj promjeni statusa narudžbe bićete obaviješteni putem emaila.
    </p>

    <p style="font-size: 14px; color: #6b7280;">
      Ako imate bilo kakvih pitanja, slobodno nas kontaktirajte na
      <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #2563eb;">${process.env.ADMIN_EMAIL}</a>
    </p>

    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} AutoShop. Sva prava zadržana.
      </p>
    </div>
  </div>
</body>
</html>
  `

  const resend = getResendClient()
  if (!resend) {
    console.warn("RESEND_API_KEY nije postavljen, preskačem slanje emaila")
    return
  }

  try {
    await resend.emails.send({
      from: "AutoShop <narudzbe@autoshop.ba>",
      to: customerEmail,
      subject: `Potvrda narudžbe #${order.orderNumber}`,
      html,
    })
    console.log(`✉️ Email potvrde poslan kupcu: ${customerEmail}`)
  } catch (error) {
    console.error("Greška pri slanju emaila kupcu:", error)
  }
}

export async function sendNewOrderToAdmin(order: Order) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    console.warn("RESEND_API_KEY ili ADMIN_EMAIL nije postavljen")
    return
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.total.toFixed(2)} KM</td>
    </tr>
  `
    )
    .join("")

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
  <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🛒 Nova narudžba!</h1>
  </div>

  <div style="background: white; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 10px 0;">Narudžba #${order.orderNumber}</h2>
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #92400e;">
        ${order.total.toFixed(2)} KM ${order.isB2B ? " (B2B)" : ""}
      </p>
    </div>

    <h3 style="margin-top: 20px;">Kupac:</h3>
    <p style="margin: 5px 0;"><strong>${order.shippingName}</strong></p>
    <p style="margin: 5px 0;">📞 ${order.shippingPhone}</p>
    <p style="margin: 5px 0;">📧 ${order.guestEmail || order.user?.email}</p>

    <h3 style="margin-top: 20px;">Dostava:</h3>
    <p style="margin: 5px 0;">${order.shippingAddress}</p>
    <p style="margin: 5px 0;">${order.shippingZip ? order.shippingZip + " " : ""}${order.shippingCity}</p>
    ${order.shippingNote ? `<p style="margin: 5px 0; background: #fef3c7; padding: 10px; border-radius: 4px;"><strong>Napomena:</strong> ${order.shippingNote}</p>` : ""}

    <h3 style="margin-top: 20px;">Proizvodi:</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb;">Proizvod</th>
          <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb;">Kol.</th>
          <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Ukupno</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="margin-top: 30px; text-align: center;">
      <a href="${process.env.NEXTAUTH_URL}/admin/orders"
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Otvori u admin panelu
      </a>
    </div>
  </div>
</body>
</html>
  `

  const resend = getResendClient()
  if (!resend) {
    console.warn("RESEND_API_KEY nije postavljen, preskačem slanje emaila")
    return
  }

  try {
    await resend.emails.send({
      from: "AutoShop Sistem <sistem@autoshop.ba>",
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 Nova narudžba #${order.orderNumber} — ${order.total.toFixed(2)} KM`,
      html,
    })
    console.log(`✉️ Email notifikacija poslana adminu`)
  } catch (error) {
    console.error("Greška pri slanju emaila adminu:", error)
  }
}
