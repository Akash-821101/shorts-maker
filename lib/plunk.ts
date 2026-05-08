/**
 * Plunk Email Utility
 * Handles sending transactional emails using the Plunk API.
 */

import { getVideoReadyEmailTemplate } from './email-templates'

interface SendEmailParams {
  to: string
  subject: string
  body: string
  from?: string
  name?: string
}

// TODO: Use this for sendingTransactional Emails once domain setup with plunk complete.

export async function sendEmail({ to, subject, body, from, name }: SendEmailParams) {
  const apiKey = process.env.PLUNK_SECRET_KEY

  if (!apiKey) {
    console.error('[Plunk] Missing PLUNK_SECRET_KEY environment variable.')
    return { success: false, error: 'Missing API Key' }
  }

  try {
    const response = await fetch('https://next-api.useplunk.com/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        from: from || process.env.PLUNK_FROM_EMAIL,
        name: name || process.env.PLUNK_FROM_NAME || 'Shorts Maker',
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      console.error('[Plunk] Failed to send email:', data)
      return { success: false, error: data.error || 'API Error' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Plunk] Network error sending email:', error)
    return { success: false, error: 'Network Error' }
  }
}

export { getVideoReadyEmailTemplate }
