/** @param {{ name: string; phone: string; date: string; time: string; treatment: string; message?: string }} form */
export function formatBookingMessage(form, clinicName) {
  const prettyDate = new Date(`${form.date}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })

  const lines = [
    `*New Appointment Request – ${clinicName}*`,
    '',
    `*Name:* ${form.name.trim()}`,
    `*Phone:* ${form.phone.trim()}`,
    `*Date:* ${prettyDate}`,
    `*Time:* ${form.time}`,
    `*Treatment:* ${form.treatment}`,
  ]
  if (form.message?.trim()) lines.push(`*Message:* ${form.message.trim()}`)
  return lines.join('\n')
}

export function formatPatientConfirmation(form, clinicName, phoneDisplay) {
  const prettyDate = new Date(`${form.date}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })

  return [
    `Hi ${form.name.trim()},`,
    '',
    `Thank you for booking with *${clinicName}*.`,
    '',
    `*Date:* ${prettyDate}`,
    `*Time:* ${form.time}`,
    `*Treatment:* ${form.treatment}`,
    '',
    `We will confirm your slot shortly. For urgent help, call ${phoneDisplay}.`,
  ].join('\n')
}

/** @returns {string | null} E.164 digits without + (India mobile) */
export function normalizeIndiaWhatsApp(phone) {
  const digits = phone.replace(/\D/g, '')
  const ten = digits.length >= 10 ? digits.slice(-10) : digits
  if (!/^[6-9]\d{9}$/.test(ten)) return null
  return `91${ten}`
}
