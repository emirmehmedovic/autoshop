import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const contactSchema = z.object({
  ime: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Unesite validnu email adresu"),
  telefon: z.string().optional(),
  tipUpita: z.enum(["opci", "narudzba", "veleprodaja", "reklamacija", "saradnja"]),
  poruka: z.string().min(10, "Poruka mora imati najmanje 10 karaktera"),
})

const tipUpitaLabels: Record<string, string> = {
  opci: "Opći upit",
  narudzba: "Narudžba / Cijena",
  veleprodaja: "Veleprodaja / B2B",
  reklamacija: "Reklamacija",
  saradnja: "Saradnja",
}

async function sendTelegramNotification(data: z.infer<typeof contactSchema>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured")
    return
  }

  const message = `
📬 *Nova poruka sa kontakt forme*

👤 *Ime:* ${data.ime}
📧 *Email:* ${data.email}
📞 *Telefon:* ${data.telefon || "Nije uneseno"}
📋 *Tip upita:* ${tipUpitaLabels[data.tipUpita]}

💬 *Poruka:*
${data.poruka}
  `.trim()

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })
  } catch (error) {
    console.error("Failed to send Telegram notification:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Nevalidni podaci", details: result.error.issues },
        { status: 400 }
      )
    }

    const data = result.data

    // Check if Resend is configured
    if (!resend) {
      console.warn("Resend API key not configured, skipping email")
      await sendTelegramNotification(data)
      return NextResponse.json({ success: true })
    }

    // Send email via Resend
    const adminEmail = process.env.ADMIN_EMAIL || "info@glossdrive.ba"

    await resend.emails.send({
      from: "GlossDrive <noreply@glossdrive.ba>",
      to: adminEmail,
      replyTo: data.email,
      subject: `[GlossDrive] ${tipUpitaLabels[data.tipUpita]} - ${data.ime}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nova poruka sa kontakt forme</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Ime:</td>
                <td style="padding: 10px 0; color: #111827;">${data.ime}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; color: #111827;"><a href="mailto:${data.email}" style="color: #f97316;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Telefon:</td>
                <td style="padding: 10px 0; color: #111827;">${data.telefon || "Nije uneseno"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Tip upita:</td>
                <td style="padding: 10px 0; color: #111827;">${tipUpitaLabels[data.tipUpita]}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 10px; color: #374151;">Poruka:</h3>
              <p style="margin: 0; color: #4b5563; white-space: pre-wrap;">${data.poruka}</p>
            </div>
          </div>
        </div>
      `,
    })

    // Send Telegram notification
    await sendTelegramNotification(data)

    // Send confirmation email to customer
    await resend.emails.send({
      from: "GlossDrive <noreply@glossdrive.ba>",
      to: data.email,
      subject: "Primili smo vašu poruku - GlossDrive",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">GlossDrive</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; margin: 0 0 15px;">Poštovani ${data.ime},</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hvala vam što ste nas kontaktirali! Primili smo vašu poruku i odgovorit ćemo vam u najkraćem mogućem roku.
            </p>
            <p style="color: #4b5563; line-height: 1.6;">
              U međuvremenu, slobodno pregledajte našu ponudu premium auto kozmetike i detailing proizvoda.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://glossdrive.ba/shop" style="display: inline-block; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: bold;">
                Pregledaj proizvode
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              S poštovanjem,<br>
              <strong>GlossDrive Tim</strong><br>
              <a href="mailto:info@glossdrive.ba" style="color: #f97316;">info@glossdrive.ba</a><br>
              <a href="tel:+38761577576" style="color: #f97316;">+387 61 577 576</a>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Greška prilikom slanja poruke. Molimo pokušajte ponovo." },
      { status: 500 }
    )
  }
}
