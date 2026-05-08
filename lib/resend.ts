import { Resend } from 'resend'


/**
 * Resend Email Utility
 * Handles sending transactional emails using the Resend SDK.
 */

interface SendEmailParams {
  to: string
  subject: string
  body: string
  from?: string
}

export async function sendResendEmail({ to, subject, body, from }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error('[Resend] Missing RESEND_API_KEY environment variable.')
    return { success: false, error: 'Missing Resend API key' }
  }

  const resend = new Resend(apiKey)

  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
      subject,
      html: body,
    })

    if (error) {
      console.error('[Resend] Failed to send email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error(`[Resend] Network error sending email: ${err.name} - ${err.message}`)
    return { success: false, error: 'Network Error' }
  }
}

