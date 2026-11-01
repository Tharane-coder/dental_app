import {
  formatBookingMessage,
  formatPatientConfirmation,
  normalizeIndiaWhatsApp,
} from '../lib/bookingMessage.js'

const CLINIC_NAME = 'RD Dental Care'
const CLINIC_PHONE_DISPLAY = '080727 42170'
const DEFAULT_NOTIFY_TO = '919344096595'

async function sendWhapiText(token, baseUrl, to, body) {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/messages/text`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, body, typing_time: 1 }),
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    const message =
      typeof data?.error === 'string'
        ? data.error
        : data?.message || `Whapi request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

function pickString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.WHAPI_TOKEN
  if (!token) {
    return res.status(503).json({ error: 'WhatsApp booking is not configured yet.' })
  }

  const baseUrl = process.env.WHAPI_BASE_URL || 'https://gate.whapi.cloud'
  const notifyTo = (process.env.WHAPI_NOTIFY_TO || DEFAULT_NOTIFY_TO).replace(/\D/g, '')

  const body = req.body ?? {}
  const form = {
    name: pickString(body.name),
    phone: pickString(body.phone),
    date: pickString(body.date),
    time: pickString(body.time),
    treatment: pickString(body.treatment),
    message: pickString(body.message),
  }

  if (form.name.length < 2) {
    return res.status(400).json({ error: 'Please enter your name.' })
  }
  const patientTo = normalizeIndiaWhatsApp(form.phone)
  if (!patientTo) {
    return res.status(400).json({ error: 'Enter a valid 10-digit mobile number.' })
  }
  if (!form.date || !form.time || !form.treatment) {
    return res.status(400).json({ error: 'Date, time, and treatment are required.' })
  }

  const bookingText = formatBookingMessage(form, CLINIC_NAME)
  const confirmText = formatPatientConfirmation(form, CLINIC_NAME, CLINIC_PHONE_DISPLAY)

  try {
    await sendWhapiText(token, baseUrl, notifyTo, bookingText)
    await sendWhapiText(token, baseUrl, patientTo, confirmText)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Whapi booking error:', err)
    return res.status(502).json({
      error: err instanceof Error ? err.message : 'Could not send WhatsApp message.',
    })
  }
}
