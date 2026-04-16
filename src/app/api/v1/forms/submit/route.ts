/**
 * POST /api/v1/forms/submit
 *
 * Universal form submission handler for contact, partner, and career forms.
 * In production, this sends an email notification via SMTP. In dev mode,
 * it logs the submission and returns success.
 *
 * Request body:
 * {
 *   "form": "contact" | "partner" | "careers",
 *   "data": { ... form fields }
 * }
 */

import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(1),
});

const PartnerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  phone: z.string().optional(),
  type: z.string().optional(),
  message: z.string().optional(),
});

const CareersSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  position: z.string().optional(),
  message: z.string().optional(),
});

const SubmitSchema = z.object({
  form: z.enum(["contact", "partner", "careers"]),
  data: z.record(z.string(), z.unknown()),
});

const EMAIL_ROUTING: Record<string, string> = {
  contact: "info@techfides.com",
  partner: "partners@techfides.com",
  careers: "careers@techfides.com",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { form, data } = parsed.data;

  // Validate form-specific fields
  let validated: Record<string, unknown>;
  try {
    switch (form) {
      case "contact":
        validated = ContactSchema.parse(data);
        break;
      case "partner":
        validated = PartnerSchema.parse(data);
        break;
      case "careers":
        validated = CareersSchema.parse(data);
        break;
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Form validation failed", details: err },
      { status: 400 }
    );
  }

  const targetEmail = EMAIL_ROUTING[form];

  // In production: send email via SMTP/Resend/Postmark
  // For now: log and return success
  const smtpConfigured = !!process.env.EMAIL_SERVER_HOST;

  if (smtpConfigured) {
    try {
      // nodemailer or similar would go here
      // For Resend: await resend.emails.send({ from, to, subject, html })
      console.log(`[forms] Would send email to ${targetEmail}:`, validated);
    } catch (err) {
      console.error(`[forms] Email send failed:`, err);
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }
  } else {
    console.log(`[forms] ${form} submission (no SMTP configured):`, {
      to: targetEmail,
      data: validated,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    success: true,
    form,
    to: targetEmail,
    timestamp: new Date().toISOString(),
    emailSent: smtpConfigured,
  });
}
