import { Resend } from 'resend'
import { getVideoReadyEmailTemplate } from './email-templates'

/**
 * Resend Email Utility
 * Handles sending transactional emails using the Resend SDK.
 */

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  body: string
  from?: string
}

export async function sendResendEmail({ to, subject, body, from }: SendEmailParams) {
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
  } catch (err) {
    console.error('[Resend] Network error sending email:', err)
    return { success: false, error: 'Network Error' }
  }
}

export { getVideoReadyEmailTemplate }
