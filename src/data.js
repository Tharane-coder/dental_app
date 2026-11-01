export const CLINIC = {
  name: 'RD Dental Care',
  area: 'Royapuram',
  rating: 5.0,
  reviews: 21,
  address: '111/48, Adam Sahib St, Pudumanaikuppam, Royapuram, Chennai, Tamil Nadu 600013',
  phoneDisplay: '080727 42170',
  phoneTel: '+918072742170',
  whatsapp: '919344096595',
  mapsQuery: 'RD Dental Care, 111/48, Adam Sahib St, Royapuram, Chennai 600013',
}

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(CLINIC.mapsQuery)}&output=embed`
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CLINIC.mapsQuery)}`

// Day index follows JS Date#getDay(): 0 = Sunday. Times are 24h minutes since midnight (IST).
export const HOURS = [
  { day: 'Sunday', open: 10 * 60, close: 13 * 60, label: '10:00 AM – 1:00 PM' },
  { day: 'Monday', open: 18 * 60, close: 21 * 60 + 30, label: '6:00 PM – 9:30 PM' },
  { day: 'Tuesday', open: 18 * 60, close: 21 * 60 + 30, label: '6:00 PM – 9:30 PM' },
  { day: 'Wednesday', open: 18 * 60, close: 21 * 60 + 30, label: '6:00 PM – 9:30 PM' },
  { day: 'Thursday', open: 18 * 60, close: 21 * 60 + 30, label: '6:00 PM – 9:30 PM' },
  { day: 'Friday', open: 18 * 60, close: 21 * 60 + 30, label: '6:00 PM – 9:30 PM' },
  { day: 'Saturday', open: 18 * 60, close: 21 * 60 + 30, label: '6:00 PM – 9:30 PM' },
]

export const SERVICES = [
  {
    icon: '🦷',
    title: 'General Check-up & Cleaning',
    text: 'Thorough oral examination, scaling and polishing to keep your teeth and gums healthy.',
  },
  {
    icon: '🩺',
    title: 'Root Canal Treatment',
    text: 'Painless, single-sitting RCT with modern rotary instruments to save your natural tooth.',
  },
  {
    icon: '✨',
    title: 'Teeth Whitening',
    text: 'Safe, professional whitening for a brighter, more confident smile.',
  },
  {
    icon: '👑',
    title: 'Crowns & Bridges',
    text: 'Natural-looking ceramic and zirconia crowns to restore strength and appearance.',
  },
  {
    icon: '🔩',
    title: 'Dental Implants',
    text: 'Permanent, natural-feeling replacements for missing teeth.',
  },
  {
    icon: '😁',
    title: 'Braces & Aligners',
    text: 'Orthodontic solutions to straighten teeth for children and adults.',
  },
  {
    icon: '🧒',
    title: 'Kids Dentistry',
    text: 'Gentle, friendly care that makes dental visits easy for children.',
  },
  {
    icon: '🪥',
    title: 'Fillings & Extractions',
    text: 'Tooth-coloured fillings and comfortable extractions, including wisdom teeth.',
  },
]

export const TREATMENTS = [
  'General Check-up',
  'Teeth Cleaning / Scaling',
  'Tooth Pain / Emergency',
  'Root Canal Treatment',
  'Teeth Whitening',
  'Crowns & Bridges',
  'Dental Implants',
  'Braces / Aligners',
  'Kids Dentistry',
  'Fillings',
  'Tooth Extraction',
  'Other',
]

export const TESTIMONIALS = [
  {
    name: 'Priya S.',
    text: 'Very gentle and caring treatment. The doctor explained everything clearly before starting my root canal. Completely painless!',
  },
  {
    name: 'Mohammed R.',
    text: 'Clean, well-maintained clinic with modern equipment. Evening timings are very convenient for working people.',
  },
  {
    name: 'Karthik V.',
    text: 'Took my son for his first dental visit. The doctor was patient and friendly — he was not scared at all. Highly recommended.',
  },
]

export const DOCTOR = {
  name: 'Dr. Deepak',
  role: 'Dental Surgeon',
  photo: '/deepak_dr.png',
}

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80',
  about: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80',
  ],
}
