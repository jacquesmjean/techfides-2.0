/**
 * Branded HTML Email Template — Outlook-safe, table-based layout
 *
 * Builds HTML as a string (no react-dom/server) to avoid Next.js
 * restrictions on server-only imports in API routes.
 *
 * Brand colors:
 * - Dark bg: #0a0f1a
 * - Card bg: #111827
 * - Electric blue: #0ea5e9
 * - Light blue: #38bdf8
 * - Green: #22c55e
 * - Text: #e2e8f0
 * - Muted text: #94a3b8
 */

export interface BrandedEmailProps {
  recipientFirstName: string;
  recipientCompany: string;
  subject: string;
  bodyParagraphs: string[];
  ctaText: string;
  ctaUrl: string;
  senderName: string;
  senderTitle: string;
  strategyBadge?: string;
  unsubscribeUrl?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Render the branded email to HTML + plain text.
 */
export function renderBrandedEmail(
  props: BrandedEmailProps
): { html: string; text: string } {
  const {
    recipientFirstName,
    bodyParagraphs,
    ctaText,
    ctaUrl,
    senderName,
    senderTitle,
    subject,
    unsubscribeUrl = "mailto:support@techfides.com?subject=Unsubscribe",
  } = props;

  const logoUrl =
    (process.env.TECHFIDES_PUBLIC_URL || "https://techfides.com") +
    "/images/techfides-logo-white.png";

  const paragraphsHtml = bodyParagraphs
    .map(
      (p) =>
        `<p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 16px;font-family:Arial,sans-serif;">${escapeHtml(p)}</p>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0f1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f1a;margin:0;padding:0;">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#111827;border-radius:12px;border:1px solid #1e293b;max-width:600px;width:100%;">
<!-- Header -->
<tr>
<td style="padding:30px 40px 20px;border-bottom:2px solid #0ea5e9;">
<img src="${escapeHtml(logoUrl)}" alt="TechFides" width="160" style="display:block;" />
</td>
</tr>
<!-- Body -->
<tr>
<td style="padding:30px 40px;">
<p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;font-family:Arial,sans-serif;">
Hi ${escapeHtml(recipientFirstName)},
</p>
${paragraphsHtml}
<!-- CTA Button -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
<tr>
<td align="center">
<a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background-color:#0ea5e9;color:#ffffff;font-size:15px;font-weight:bold;font-family:Arial,sans-serif;text-decoration:none;padding:14px 32px;border-radius:8px;">
${escapeHtml(ctaText)}
</a>
</td>
</tr>
</table>
<!-- Signature -->
<table cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr>
<td style="border-left:3px solid #0ea5e9;padding-left:16px;">
<p style="color:#e2e8f0;font-size:14px;font-weight:bold;margin:0 0 4px;font-family:Arial,sans-serif;">${escapeHtml(senderName)}</p>
<p style="color:#94a3b8;font-size:13px;margin:0 0 4px;font-family:Arial,sans-serif;">${escapeHtml(senderTitle)}</p>
<p style="color:#38bdf8;font-size:13px;margin:0;font-family:Arial,sans-serif;">TechFides | techfides.com</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- Footer -->
<tr>
<td style="padding:20px 40px;border-top:1px solid #1e293b;">
<p style="color:#64748b;font-size:11px;line-height:1.5;margin:0 0 8px;font-family:Arial,sans-serif;text-align:center;">
TechFides | Frisco, TX | Guadalajara, MX | Libreville, GA
</p>
<p style="color:#64748b;font-size:11px;line-height:1.5;margin:0;font-family:Arial,sans-serif;text-align:center;">
<a href="${escapeHtml(unsubscribeUrl)}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
 |
<a href="https://techfides.com/privacy" style="color:#64748b;text-decoration:underline;">Privacy Policy</a>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

  const text = [
    `Hi ${recipientFirstName},`,
    "",
    ...bodyParagraphs,
    "",
    `${ctaText}: ${ctaUrl}`,
    "",
    senderName,
    senderTitle,
    "TechFides | techfides.com",
    "",
    "---",
    "TechFides | Frisco, TX | Guadalajara, MX | Libreville, GA",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return { html, text };
}
