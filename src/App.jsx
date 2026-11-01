import { useEffect, useMemo, useState } from 'react'
import {
  CLINIC,
  DOCTOR,
  HOURS,
  IMAGES,
  SERVICES,
  TESTIMONIALS,
  TREATMENTS,
  mapsDirectionsUrl,
  mapsEmbedUrl,
} from './data'
import './App.css'

const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#doctor', label: 'Our Doctor' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#location', label: 'Location' },
]

function nowInIST() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t) => parts.find((p) => p.type === t).value
  const iso = `${get('year')}-${get('month')}-${get('day')}`
  return {
    iso,
    day: new Date(`${iso}T00:00:00`).getDay(),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

function formatMinutes(m) {
  const h = Math.floor(m / 60)
  const min = m % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(min).padStart(2, '0')} ${suffix}`
}

function getSlots(isoDate) {
  if (!isoDate) return []
  const { open, close } = HOURS[new Date(`${isoDate}T00:00:00`).getDay()]
  const now = nowInIST()
  const slots = []
  for (let m = open; m < close; m += 30) {
    if (isoDate === now.iso && m <= now.minutes) continue
    slots.push(formatMinutes(m))
  }
  return slots
}

function useOpenStatus() {
  const [now, setNow] = useState(nowInIST)
  useEffect(() => {
    const id = setInterval(() => setNow(nowInIST()), 60_000)
    return () => clearInterval(id)
  }, [])
  const today = HOURS[now.day]
  const isOpen = now.minutes >= today.open && now.minutes < today.close
  return { isOpen, today, todayIndex: now.day }
}

function Stars({ count = 5 }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__logo" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path d="M32 10c-5-4-13-5-18-1-6 5-5 14-2 21 2 5 3 10 4 16 1 5 2 9 5 9 4 0 4-9 6-14 1-3 3-4 5-4s4 1 5 4c2 5 2 14 6 14 3 0 4-4 5-9 1-6 2-11 4-16 3-7 4-16-2-21-5-4-13-3-18 1z" />
            </svg>
          </span>
          <span>
            <strong>RD Dental Care</strong>
            <small>Royapuram, Chennai</small>
          </span>
        </a>

        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
          <a href="#appointment" className="btn btn--primary nav__cta" onClick={() => setOpen(false)}>
            Book Appointment
          </a>
        </nav>

        <button
          className={`burger ${open ? 'burger--open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  const { isOpen, today } = useOpenStatus()
  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className={`pill ${isOpen ? 'pill--open' : 'pill--closed'}`}>
            <span className="dot" /> {isOpen ? 'Open now' : 'Closed now'} · Today {today.label}
          </span>
          <h1>
            Gentle, modern dental care for a <span className="accent">healthy smile</span>
          </h1>
          <p className="lead">
            Trusted family dental clinic in Royapuram, Chennai. Painless treatments, sterile
            environment and convenient evening hours.
          </p>
          <div className="hero__actions">
            <a href="#appointment" className="btn btn--primary btn--lg">
              Book Appointment
            </a>
            <a href={`tel:${CLINIC.phoneTel}`} className="btn btn--ghost btn--lg">
              📞 {CLINIC.phoneDisplay}
            </a>
          </div>
          <div className="hero__rating">
            <strong>{CLINIC.rating.toFixed(1)}</strong>
            <Stars />
            <span>{CLINIC.reviews} Google reviews</span>
          </div>
        </div>
        <div className="hero__media">
          <img src={IMAGES.hero} alt="Dentist treating a patient at RD Dental Care" />
          <div className="hero__badge">
            <span>🛡️</span>
            <div>
              <strong>100% Sterilised</strong>
              <small>Instruments & clinic</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  const items = [
    { n: '5.0★', t: 'Google Rating' },
    { n: 'Painless', t: 'Modern techniques' },
    { n: 'Evening', t: 'Convenient hours' },
    { n: 'Family', t: 'Kids to seniors' },
  ]
  return (
    <section className="highlights">
      <div className="container highlights__grid">
        {items.map((i) => (
          <div key={i.t} className="highlight">
            <strong>{i.n}</strong>
            <span>{i.t}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Our Services</span>
          <h2>Complete dental care under one roof</h2>
          <p>From routine check-ups to advanced restorative treatments, we take care of your whole family.</p>
        </div>
        <div className="services">
          {SERVICES.map((s) => (
            <article key={s.title} className="card service">
              <span className="service__icon" aria-hidden="true">
                {s.icon}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  const points = [
    'Experienced and caring dentist',
    'Strict sterilisation protocols',
    'Digital X-rays & modern equipment',
    'Transparent, affordable pricing',
  ]
  return (
    <section className="section section--tint" id="about">
      <div className="container about">
        <div className="about__media">
          <img src={IMAGES.about} alt="Modern dental treatment room" loading="lazy" />
        </div>
        <div className="about__content">
          <span className="eyebrow">Why RD Dental Care</span>
          <h2>Your comfort is our priority</h2>
          <p>
            At RD Dental Care, we combine clinical expertise with a warm, patient-first approach.
            Every treatment begins with a clear explanation so you know exactly what to expect —
            no surprises, no fear.
          </p>
          <ul className="checks">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <a href="#appointment" className="btn btn--primary">
            Schedule a Visit
          </a>
        </div>
      </div>
      <div className="container gallery">
        {IMAGES.gallery.map((src, i) => (
          <img key={src} src={src} alt={`Dental care ${i + 1}`} loading="lazy" />
        ))}
      </div>
    </section>
  )
}

function Doctor() {
  const traits = [
    { icon: '🤝', title: 'Patient-first', text: 'Every step explained before treatment begins' },
    { icon: '💉', title: 'Painless care', text: 'Gentle techniques for anxious patients' },
    { icon: '👨‍👩‍👧', title: 'Family dentist', text: 'Trusted by kids, adults and seniors' },
  ]
  return (
    <section className="section" id="doctor">
      <div className="container doctor">
        <div className="doctor__media">
          <img src={DOCTOR.photo} alt={`${DOCTOR.name}, ${DOCTOR.role} at RD Dental Care`} loading="lazy" />
          <div className="doctor__tag">
            <strong>{DOCTOR.name}</strong>
            <span>{DOCTOR.role}</span>
          </div>
        </div>
        <div className="doctor__content">
          <span className="eyebrow">Meet Your Dentist</span>
          <h2>{DOCTOR.name}</h2>
          <p className="doctor__role">
            {DOCTOR.role} · RD Dental Care, Royapuram
          </p>
          <p>
            {DOCTOR.name} leads RD Dental Care with a calm, caring approach and a commitment to
            modern, evidence-based dentistry. From routine check-ups to root canals and smile
            makeovers, he makes sure every patient feels comfortable and well informed.
          </p>
          <div className="doctor__traits">
            {traits.map((t) => (
              <div key={t.title} className="trait">
                <span aria-hidden="true">{t.icon}</span>
                <div>
                  <strong>{t.title}</strong>
                  <small>{t.text}</small>
                </div>
              </div>
            ))}
          </div>
          <a href="#appointment" className="btn btn--primary">
            Book with {DOCTOR.name}
          </a>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="section section--tint" id="reviews">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Patient Reviews</span>
          <h2>Rated 5.0 on Google</h2>
          <p>
            <Stars /> Based on {CLINIC.reviews} Google reviews
          </p>
        </div>
        <div className="reviews">
          {TESTIMONIALS.map((r) => (
            <figure key={r.name} className="card review">
              <Stars />
              <blockquote>“{r.text}”</blockquote>
              <figcaption>
                <span className="avatar">{r.name[0]}</span>
                {r.name}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="center">
          <a
            className="btn btn--ghost"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC.mapsQuery)}`}
            target="_blank"
            rel="noreferrer"
          >
            See all reviews on Google
          </a>
        </div>
      </div>
    </section>
  )
}

const EMPTY_FORM = { name: '', phone: '', date: '', time: '', treatment: '', message: '' }

function Appointment() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const minDate = nowInIST().iso
  const slots = useMemo(() => getSlots(form.date), [form.date])

  const update = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value, ...(field === 'date' ? { time: '' } : {}) }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Please enter your name'
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) er.phone = 'Enter a valid 10-digit mobile number'
    if (!form.date) er.date = 'Choose a date'
    if (!form.time) er.time = form.date && slots.length === 0 ? 'No slots left today, pick another date' : 'Choose a time'
    if (!form.treatment) er.treatment = 'Select a treatment'
    return er
  }

  const submit = (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return

    const prettyDate = new Date(`${form.date}T00:00:00`).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const lines = [
      `*New Appointment Request – ${CLINIC.name}*`,
      '',
      `*Name:* ${form.name.trim()}`,
      `*Phone:* ${form.phone.trim()}`,
      `*Date:* ${prettyDate}`,
      `*Time:* ${form.time}`,
      `*Treatment:* ${form.treatment}`,
    ]
    if (form.message.trim()) lines.push(`*Message:* ${form.message.trim()}`)

    const url = `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener')
    setSent(true)
    setForm(EMPTY_FORM)
  }

  return (
    <section className="section section--brand" id="appointment">
      <div className="container appointment">
        <div className="appointment__info">
          <span className="eyebrow eyebrow--light">Book Appointment</span>
          <h2>Book your visit in under a minute</h2>
          <p>
            Fill in your details and we'll open WhatsApp with your request ready to send. Our team
            will confirm your slot shortly.
          </p>
          <ul className="contact-list">
            <li>
              <span>📞</span>
              <a href={`tel:${CLINIC.phoneTel}`}>{CLINIC.phoneDisplay}</a>
            </li>
            <li>
              <span>📍</span>
              {CLINIC.address}
            </li>
            <li>
              <span>🕕</span>
              Mon–Sat 6:00–9:30 PM · Sun 10:00 AM–1:00 PM
            </li>
          </ul>
        </div>

        <form className="card form" onSubmit={submit} noValidate>
          {sent && (
            <div className="alert" role="status">
              ✅ WhatsApp opened with your request. Please tap <strong>Send</strong> in WhatsApp to
              confirm.
            </div>
          )}
          <div className="form__row">
            <Field label="Full name" error={errors.name}>
              <input value={form.name} onChange={update('name')} placeholder="Your name" autoComplete="name" />
            </Field>
            <Field label="Mobile number" error={errors.phone}>
              <input
                value={form.phone}
                onChange={update('phone')}
                placeholder="98765 43210"
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>
          </div>
          <div className="form__row">
            <Field label="Preferred date" error={errors.date}>
              <input type="date" min={minDate} value={form.date} onChange={update('date')} />
            </Field>
            <Field label="Preferred time" error={errors.time}>
              <select value={form.time} onChange={update('time')} disabled={!form.date || slots.length === 0}>
                <option value="">
                  {!form.date ? 'Select a date first' : slots.length ? 'Select time' : 'No slots available'}
                </option>
                {slots.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Treatment" error={errors.treatment}>
            <select value={form.treatment} onChange={update('treatment')}>
              <option value="">Select treatment</option>
              {TREATMENTS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Message (optional)">
            <textarea
              rows="3"
              value={form.message}
              onChange={update('message')}
              placeholder="Tell us about your concern"
            />
          </Field>
          <button type="submit" className="btn btn--whatsapp btn--lg btn--block">
            <WhatsAppIcon /> Book via WhatsApp
          </button>
        </form>
      </div>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  )
}

function Location() {
  const { isOpen, todayIndex } = useOpenStatus()
  const ordered = [1, 2, 3, 4, 5, 6, 0]
  return (
    <section className="section" id="location">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Visit Us</span>
          <h2>Location & clinic hours</h2>
        </div>
        <div className="location">
          <div className="map">
            <iframe
              title="RD Dental Care location map"
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="card hours">
            <h3>
              Clinic Hours
              <span className={`pill pill--sm ${isOpen ? 'pill--open' : 'pill--closed'}`}>
                <span className="dot" /> {isOpen ? 'Open' : 'Closed'}
              </span>
            </h3>
            <table>
              <tbody>
                {ordered.map((i) => (
                  <tr key={i} className={i === todayIndex ? 'today' : ''}>
                    <td>{HOURS[i].day}</td>
                    <td>{HOURS[i].label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="address">📍 {CLINIC.address}</p>
            <div className="hours__actions">
              <a className="btn btn--primary" href={mapsDirectionsUrl} target="_blank" rel="noreferrer">
                Get Directions
              </a>
              <a className="btn btn--ghost" href={`tel:${CLINIC.phoneTel}`}>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <strong className="footer__brand">RD Dental Care</strong>
          <p>Caring for smiles in Royapuram, Chennai.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            <a href={`tel:${CLINIC.phoneTel}`}>{CLINIC.phoneDisplay}</a>
          </p>
          <p>{CLINIC.address}</p>
        </div>
        <div>
          <h4>Hours</h4>
          <p>Mon – Sat: 6:00 PM – 9:30 PM</p>
          <p>Sunday: 10:00 AM – 1:00 PM</p>
        </div>
      </div>
      <div className="container footer__bottom">
        © {new Date().getFullYear()} RD Dental Care, Royapuram. All rights reserved.
      </div>
    </footer>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.9 1.5 5.9 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.3 1.1 1.2-4.2-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.2 9.8 10 5.1 16 5.1s10.8 4.7 10.8 10.5S21.9 26.2 16 26.2zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
    </svg>
  )
}

function FloatingActions() {
  return (
    <div className="fab">
      <a href={`tel:${CLINIC.phoneTel}`} className="fab__btn fab__btn--call" aria-label="Call clinic">
        📞
      </a>
      <a
        href={`https://wa.me/${CLINIC.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="fab__btn fab__btn--wa"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Highlights />
        <Services />
        <About />
        <Doctor />
        <Reviews />
        <Appointment />
        <Location />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
