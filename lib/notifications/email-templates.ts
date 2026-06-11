// Email template za B2B odobrenje
export function b2bApprovalEmailTemplate(data: {
  userName: string
  companyName: string
  priceGroup?: { name: string; discount: number }
  loginUrl: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">AutoShop</h1>
    <p style="color: #d1fae5; margin: 10px 0 0 0;">B2B Nalog Odobren!</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Poštovani/a <strong>${data.userName}</strong>,</p>

    <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 18px; font-weight: 600; color: #065f46;">
        🎉 Vaš B2B nalog je odobren!
      </p>
    </div>

    <p>Čestitamo! Vaš B2B nalog za firmu <strong>${data.companyName}</strong> je uspješno odobren.</p>

    ${
      data.priceGroup
        ? `
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #1f2937;">Vaša cjenovna grupa:</h3>
      <p style="font-size: 20px; font-weight: bold; color: #7c3aed; margin: 0;">
        ${data.priceGroup.name}
      </p>
      <p style="font-size: 32px; font-weight: bold; color: #10b981; margin: 10px 0;">
        ${data.priceGroup.discount}% popust
      </p>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        na sve proizvode u shop-u
      </p>
    </div>
    `
        : ""
    }

    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 10px 0; color: #1e40af;">Vaše B2B pogodnosti:</h3>
      <ul style="margin: 5px 0; padding-left: 20px; color: #1e3a8a;">
        <li>Specijalne cijene na sve proizvode</li>
        <li>Mogućnost naručivanja većih količina</li>
        <li>Prioritetna dostava</li>
        <li>Automatsko izdavanje računa</li>
        <li>Posvećena B2B podrška</li>
      </ul>
    </div>

    <p style="margin-top: 30px;">Možete se odmah prijaviti i početi sa kupovinom:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.loginUrl}"
         style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Prijavite se
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Ako imate bilo kakvih pitanja, slobodno nas kontaktirajte na
      <a href="mailto:info@autoshop.ba" style="color: #10b981;">info@autoshop.ba</a>
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
}

// Template za status promjenu narudžbe
export function orderStatusChangeEmailTemplate(data: {
  customerName: string
  orderNumber: string
  oldStatus: string
  newStatus: string
  statusMessage: string
  orderUrl: string
}) {
  const statusColors: Record<string, string> = {
    CONFIRMED: "#3b82f6",
    PROCESSING: "#8b5cf6",
    SHIPPED: "#6366f1",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
  }

  const statusColor = statusColors[data.newStatus] || "#6b7280"

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${statusColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">AutoShop</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Status narudžbe ažuriran</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px;">Poštovani/a <strong>${data.customerName}</strong>,</p>

    <p>Status vaše narudžbe je ažuriran:</p>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Narudžba</p>
      <p style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">#${data.orderNumber}</p>

      <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid ${statusColor};">
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: ${statusColor};">
          ${data.statusMessage}
        </p>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.orderUrl}"
         style="display: inline-block; background: ${statusColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Pregledaj narudžbu
      </a>
    </div>

    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} AutoShop. Sva prava zadržana.
      </p>
    </div>
  </div>
</body>
</html>
  `
}
