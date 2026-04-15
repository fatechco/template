interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, from = process.env.EMAIL_FROM || "noreply@kemedar.com" } = options;

  // Use SMTP or transactional email service
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
    return true;
  }

  try {
    // In production, use nodemailer or Resend SDK
    const response = await fetch(`https://${smtpHost}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return response.ok;
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    return false;
  }
}

export function buildEmailTemplate(title: string, body: string, ctaUrl?: string, ctaLabel?: string): string {
  return `
    <!DOCTYPE html>
    <html dir="ltr">
    <head><meta charset="utf-8"><title>${title}</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Kemedar</h1>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937;">${title}</h2>
        <p style="color: #4b5563; line-height: 1.6;">${body}</p>
        ${ctaUrl ? `<a href="${ctaUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">${ctaLabel || "View"}</a>` : ""}
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Kemedar Real Estate Platform</p>
    </body>
    </html>
  `;
}
