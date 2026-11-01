import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CLINIC,
  DOCTOR,
  FAQS,
  HOURS,
  IMAGES,
  SERVICES,
  STEPS,
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

const ICONS = {
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'],
  pin: ['M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  clock: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'],
  heart: ['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z'],
  users: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M23 21v-2a4 4 0 0 0-3-3.9', 'M16 3.1a4 4 0 0 1 0 7.8'],
  drop: ['M12 2.7l5.7 5.6a8 8 0 1 1-11.4 0z'],
  tooth: ['M7 3C4.5 3 3 5 3 7.5c0 2 .8 3.3 1.3 5.5.6 2.6.7 8 3 8 1.8 0 1.6-5 3.7-5s1.9 5 3.7 5c2.3 0 2.4-5.4 3-8 .5-2.2 1.3-3.5 1.3-5.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z'],
  rct: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  sparkle: ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z', 'M19 3v4', 'M21 5h-4'],
  crown: ['M2 8l5 4 5-7 5 7 5-4-2 11H4z'],
  implant: ['M12 2v3', 'M8 6h8', 'M9 10h6', 'M10 14h4', 'M12 18v3'],
  braces: ['M3 9h18v6H3z', 'M7 9v6', 'M12 9v6', 'M17 9v6'],
  kids: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01'],
  smile: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01'],
  extract: ['M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z'],
  calendar: ['M3 5h18v16H3z', 'M16 2v6', 'M8 2v6', 'M3 11h18'],
  chair: ['M6 3v8a3 3 0 0 0 3 3h9', 'M6 11H4', 'M9 14v7', 'M18 14v7', 'M14 21h8'],
  sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 1v2', 'M12 21v2', 'M4.2 4.2l1.4 1.4', 'M18.4 18.4l1.4 1.4', 'M1 12h2', 'M21 12h2', 'M4.2 19.8l1.4-1.4', 'M18.4 5.6l1.4-1.4'],
  moon: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
  arrow: ['M5 12h14', 'M13 5l7 7-7 7'],
  chevron: ['M6 9l6 6 6-6'],
}

function Icon({ name, size = 22 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(ICONS[name] ?? []).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useInView(onEnter) {
  const ref = useRef(null)
  const cb = useRef(onEnter)
  useEffect(() => {
    cb.current = onEnter
  })
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      cb.current(el)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cb.current(el)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useInView((el) => el.classList.add('reveal--in'))
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

function CountUp({ to, decimals = 0, suffix = '' }) {
  const [val, setVal] = useState(prefersReducedMotion() ? to : 0)
  const ref = useInView(() => {
    if (prefersReducedMotion()) return
    const start = performance.now()
    const dur = 1200
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      setVal(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    setTimeout(() => setVal(to), dur + 150)
  })
  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const attr = document.documentElement.getAttribute('data-theme')
    return attr === 'dark' ? 'dark' : 'light'
  })
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage unavailable */
    }
  }
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
    </button>
  )
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
            <Icon name="tooth" size={24} />
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

        <div className="header__tools">
          <ThemeToggle />
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
              Book Appointment <Icon name="arrow" size={18} />
            </a>
            <a href={`tel:${CLINIC.phoneTel}`} className="btn btn--ghost btn--lg">
              <Icon name="phone" size={18} /> {CLINIC.phoneDisplay}
            </a>
          </div>
          <div className="hero__rating">
            <strong>{CLINIC.rating.toFixed(1)}</strong>
            <Stars />
            <span>{CLINIC.reviews} Google reviews</span>
          </div>
        </div>
        <div className="hero__media">
          <div className="hero__frame">
            <img
              src={IMAGES.hero}
              alt="Dentist treating a patient at RD Dental Care, Royapuram"
              width="1400"
              height="1225"
              fetchPriority="high"
            />
          </div>
          <div className="hero__badge">
            <span className="hero__badge-icon">
              <Icon name="shield" size={22} />
            </span>
            <div>
              <strong>100% Sterilised</strong>
              <small>Instruments & clinic</small>
            </div>
          </div>
          <div className="hero__badge hero__badge--top">
            <span className="hero__badge-icon">
              <Icon name="drop" size={22} />
            </span>
            <div>
              <strong>Painless care</strong>
              <small>Gentle techniques</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  const items = [
    { n: <CountUp to={CLINIC.rating} decimals={1} suffix="★" />, t: 'Google Rating' },
    { n: <CountUp to={CLINIC.reviews} />, t: 'Google Reviews' },
    { n: 'Evening', t: 'Convenient hours' },
    { n: 'Family', t: 'Kids to seniors' },
  ]
  return (
    <section className="highlights">
      <Reveal className="container highlights__grid">
        {items.map((i) => (
          <div key={i.t} className="highlight">
            <strong>{i.n}</strong>
            <span>{i.t}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <Reveal className="section__head">
          <span className="eyebrow">Our Services</span>
          <h2>Complete dental care under one roof</h2>
          <p>From routine check-ups to advanced restorative treatments, we take care of your whole family.</p>
        </Reveal>
        <div className="services">
          {SERVICES.map((s, i) => (
            <Reveal
              as="article"
              key={s.title}
              delay={(i % 3) * 80}
              className="card service"
            >
              <span className="service__icon" aria-hidden="true">
                <Icon name={s.icon} size={24} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
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
        <Reveal className="about__media">
          <img src={IMAGES.about} alt="Modern dental treatment room" loading="lazy" />
        </Reveal>
        <Reveal className="about__content" delay={120}>
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
        </Reveal>
      </div>
      <div className="container gallery">
        {IMAGES.gallery.map((src, i) => (
          <Reveal key={src} delay={i * 100} className="gallery__item">
            <img src={src} alt={`Dental care ${i + 1}`} loading="lazy" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="section" id="process">
      <div className="container">
        <Reveal className="section__head">
          <span className="eyebrow">How it works</span>
          <h2>Three simple steps to a better smile</h2>
        </Reveal>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 100} className="step">
              <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="step__icon">
                <Icon name={s.icon} size={26} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Doctor() {
  const traits = [
    { icon: 'heart', title: 'Patient-first', text: 'Every step explained before treatment begins' },
    { icon: 'drop', title: 'Painless care', text: 'Gentle techniques for anxious patients' },
    { icon: 'users', title: 'Family dentist', text: 'Trusted by kids, adults and seniors' },
  ]
  return (
    <section className="section section--dark" id="doctor">
      <div className="container doctor">
        <Reveal className="doctor__media">
          <img src={DOCTOR.photo} alt={`${DOCTOR.name}, ${DOCTOR.role} at RD Dental Care`} loading="lazy" />
          <div className="doctor__tag">
            <strong>{DOCTOR.name}</strong>
            <span>{DOCTOR.role}</span>
          </div>
        </Reveal>
        <Reveal className="doctor__content" delay={120}>
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
                <span aria-hidden="true">
                  <Icon name={t.icon} size={22} />
                </span>
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
        </Reveal>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <Reveal className="section__head">
          <span className="eyebrow">Patient Reviews</span>
          <h2>Rated 5.0 on Google</h2>
          <p>
            <Stars /> Based on {CLINIC.reviews} Google reviews
          </p>
        </Reveal>
        <div className="reviews">
          {TESTIMONIALS.map((r, i) => (
            <Reveal as="figure" key={r.name} delay={i * 100} className="card review">
              <Stars />
              <blockquote>“{r.text}”</blockquote>
              <figcaption>
                <span className="avatar">{r.name[0]}</span>
                {r.name}
              </figcaption>
            </Reveal>
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

function Faq() {
  return (
    <section className="section section--tint" id="faq">
      <div className="container faq">
        <Reveal className="section__head">
          <span className="eyebrow">FAQ</span>
          <h2>Questions, answered</h2>
        </Reveal>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          })}
        </script>
        <Reveal className="faq__list">
          {FAQS.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>
                {f.q}
                <Icon name="chevron" size={20} />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </Reveal>
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
              <span><Icon name="phone" size={18} /></span>
              <a href={`tel:${CLINIC.phoneTel}`}>{CLINIC.phoneDisplay}</a>
            </li>
            <li>
              <span><Icon name="pin" size={18} /></span>
              {CLINIC.address}
            </li>
            <li>
              <span><Icon name="clock" size={18} /></span>
              Mon–Sat 6:00–9:30 PM · Sun 10:00 AM–1:00 PM
            </li>
          </ul>
        </div>

        <form className="card form" onSubmit={submit} noValidate>
          {sent && (
            <div className="alert" role="status">
              WhatsApp opened with your request. Please tap <strong>Send</strong> in WhatsApp to
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
            <p className="address">
              <Icon name="pin" size={16} /> {CLINIC.address}
            </p>
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
          <p>Gentle, modern family dentistry in Royapuram, Chennai.</p>
        </div>
        <div>
          <h4>Explore</h4>
          {NAV.map((n) => (
            <p key={n.href}>
              <a href={n.href}>{n.label}</a>
            </p>
          ))}
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
        <Icon name="phone" size={24} />
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
        <Process />
        <Doctor />
        <Reviews />
        <Faq />
        <Appointment />
        <Location />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
