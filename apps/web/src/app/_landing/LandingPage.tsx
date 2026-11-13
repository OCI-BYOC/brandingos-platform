"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import {
  ArrowRight, ArrowUpRight, Check, Star,
  Briefcase, ShoppingBag, BookOpen, BarChart2,
} from "lucide-react"

/* ─── Animation presets ─────────────────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }
const fadeIn   = { hidden: { opacity: 0 },         show: { opacity: 1, transition: { duration: 0.5 } } }
const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const staggerS = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

/* ─── Animated counter ──────────────────────────────────────────────────── */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * to))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, to])

  return <span ref={ref}>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>
}

/* ─── Dashboard preview ─────────────────────────────────────────────────── */
function DashboardPreview() {
  const kpiData = [
    { color: "#7c3aed", bars: [4, 6, 5, 8, 7, 9, 8, 10] },
    { color: "#059669", bars: [3, 5, 4, 7, 6, 8, 7, 9] },
    { color: "#0891b2", bars: [5, 7, 6, 9, 8, 10, 9, 11] },
  ]
  const linePoints = "0,42 9,36 18,40 27,28 36,22 45,18 54,20 63,13 72,16 81,8 90,10 100,5"

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 h-9 border-b" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex-1 mx-4 max-w-[220px]">
          <div className="rounded px-2 h-5 flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />
            <span className="text-[10px] font-mono truncate" style={{ color: "rgba(255,255,255,0.4)" }}>app.brandingos.in/dashboard</span>
          </div>
        </div>
      </div>

      <div className="flex h-64 overflow-hidden" style={{ background: "#0f0f14" }}>
        {/* Sidebar */}
        <div className="w-36 flex flex-col p-2 shrink-0" style={{ background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-2 py-2 mb-2">
            <div className="h-3.5 w-20 rounded-sm" style={{ background: "linear-gradient(90deg,#7c3aed,#0891b2)" }} />
          </div>
          {["Overview", "Portfolio", "Store", "Courses", "Analytics"].map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5"
              style={{ background: i === 0 ? "rgba(124,58,237,0.2)" : "transparent" }}
            >
              <div className="w-2.5 h-2.5 rounded shrink-0" style={{ background: i === 0 ? "#7c3aed" : "rgba(255,255,255,0.1)" }} />
              <div className="h-1.5 rounded-full" style={{ width: i === 0 ? "40px" : "32px", background: i === 0 ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.08)" }} />
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-3 overflow-hidden" style={{ background: "#0f0f14" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="h-2.5 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="flex gap-1.5">
              <div className="w-5 h-5 rounded-lg" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
              <div className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }} />
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            {kpiData.map((kpi, i) => (
              <div key={i} className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-4 h-4 rounded mb-1.5 flex items-center justify-center" style={{ background: `${kpi.color}20` }}>
                  <div className="w-2 h-2 rounded-sm" style={{ background: kpi.color }} />
                </div>
                <div className="h-2.5 w-10 rounded-sm mb-0.5" style={{ background: "rgba(255,255,255,0.3)" }} />
                <div className="h-1.5 w-7 rounded-full mb-1.5" style={{ background: "rgba(255,255,255,0.1)" }} />
                <div className="flex items-end gap-0.5 h-4">
                  {kpi.bars.map((h, j) => (
                    <div key={j} className="flex-1 rounded-t-sm" style={{ height: `${h * 10}%`, backgroundColor: `${kpi.color}50` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Area chart */}
          <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="h-1.5 w-20 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.15)" }} />
            <svg viewBox="0 0 100 50" className="w-full h-10">
              <defs>
                <linearGradient id="lg1dark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={`0,50 ${linePoints} 100,50`} fill="url(#lg1dark)" stroke="none" />
              <polyline points={linePoints} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Data ──────────────────────────────────────────────────────────────── */
const STATS = [
  { value: 1200,   suffix: "+",   prefix: "",  label: "Creators building" },
  { value: 3400,   suffix: "+",   prefix: "",  label: "Portfolios live" },
  { value: 2,      suffix: ".8Cr+", prefix: "₹", label: "Revenue generated" },
  { value: 180000, suffix: "+",   prefix: "",  label: "AI credits used" },
]

const PLANS = [
  {
    name: "Free", price: "₹0", period: "forever", highlight: false, cta: "Get started",
    features: ["1 portfolio", "5 products", "50 AI credits/mo", "BrandingOS subdomain"],
  },
  {
    name: "Pro", price: "₹499", period: "/month", highlight: true, cta: "Start Pro",
    features: ["3 portfolios", "50 products", "500 AI credits/mo", "Custom domain", "Analytics"],
  },
  {
    name: "Growth", price: "₹1,499", period: "/month", highlight: false, cta: "Start Growth",
    features: ["10 portfolios", "Unlimited products", "2000 AI credits/mo", "LMS & courses", "Priority support"],
  },
  {
    name: "Brand", price: "₹3,999", period: "/month", highlight: false, cta: "Contact sales",
    features: ["Unlimited everything", "10,000 AI credits/mo", "White-label", "API access", "Dedicated support"],
  },
]

const SUPPORTING_TESTIMONIALS = [
  {
    name: "Rahul Verma", role: "Full Stack Developer, Pune", avatar: "RV",
    quote: "My first course sold out in 48 hours without any ads. The LMS is so clean — students actually enjoy the experience.",
    metric: "342", metricLabel: "students in 48h",
  },
  {
    name: "Anjali Mehta", role: "Brand Consultant, Mumbai", avatar: "AM",
    quote: "12 inbound client leads per month now. My BrandingOS page does the selling for me.",
    metric: "12×", metricLabel: "more inbound leads",
  },
]

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-900 overflow-x-hidden" style={{ background: "#ffffff" }}>

      {/* ─── DARK HERO ZONE (nav + hero + stats) ─────────────────────────── */}
      <div className="relative" style={{ background: "#07070a" }}>

        {/* Mesh gradient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute" style={{ top: "-20%", left: "-10%", width: "60%", height: "70%", background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div className="absolute" style={{ top: "30%", right: "-15%", width: "50%", height: "60%", background: "radial-gradient(ellipse, rgba(8,145,178,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute" style={{ bottom: "0", left: "30%", width: "40%", height: "40%", background: "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)" }} />

        {/* ─── Nav ──────────────────────────────────────────────────────── */}
        <nav className="relative z-50 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <span className="text-xl font-bold text-white tracking-tight">BrandingOS</span>
            <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {[["Features", "#features"], ["Pricing", "#pricing"]].map(([l, h]) => (
                <a key={l} href={h} className="hover:text-white transition-colors font-medium">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="hidden md:inline-block text-sm font-medium px-3 py-1.5 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                Sign in
              </Link>
              <Link href="/sign-up" className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all" style={{ background: "rgba(124,58,237,0.9)", color: "#fff", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
                Start free →
              </Link>
            </div>
          </div>
        </nav>

        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[52%_48%] gap-10 lg:gap-16 items-center">

              {/* ── Left ── */}
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.div variants={fadeIn} className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-8 text-xs font-semibold tracking-wide" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "rgba(167,139,250,0.9)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  NOW IN BETA · 1,200+ CREATORS
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="mb-7"
                  style={{
                    fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.0,
                    color: "#ffffff",
                    fontFamily: "var(--font-display, 'Space Grotesk', system-ui)",
                  }}
                >
                  Build a brand<br />
                  creators envy —<br />
                  <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6d28d9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>and clients trust.</span>
                </motion.h1>

                <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-9 max-w-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Portfolio, store, courses, and analytics — the complete creator OS, built for Indian creators going global.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl transition-all text-sm"
                    style={{ background: "#7c3aed", color: "#fff", boxShadow: "0 0 32px rgba(124,58,237,0.5), 0 4px 16px rgba(0,0,0,0.3)" }}
                  >
                    Start for free <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/alex-chen"
                    className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm transition-all"
                    style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}
                  >
                    See a live example <ArrowUpRight size={14} />
                  </Link>
                </motion.div>

                <motion.div variants={fadeIn} className="flex items-center flex-wrap gap-4 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span>₹2.8Cr generated</span>
                  <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                  <span>Free to start</span>
                  <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                  <span>No credit card</span>
                </motion.div>
              </motion.div>

              {/* ── Right: dashboard preview ── */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative hidden lg:block"
              >
                <DashboardPreview />
                <div className="absolute -inset-8 -z-10 rounded-3xl" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(20px)" }} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Stats ────────────────────────────────────────────────────── */}
        <div className="relative border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="max-w-6xl mx-auto px-6 py-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="text-center py-4 px-6"
                  style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                >
                  <p className="text-3xl font-bold tabular-nums" style={{ color: "#ffffff", fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}>
                    <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="text-xs mt-1 font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="h-16 w-full" style={{ background: "linear-gradient(to bottom, #07070a, #ffffff)" }} />
      </div>

      {/* ─── Integrations marquee ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-7 overflow-hidden">
        <p className="text-center text-[11px] font-semibold tracking-[0.18em] uppercase mb-5" style={{ color: "#cbd5e1" }}>
          Integrates with
        </p>
        <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
          {["Razorpay", "Stripe", "YouTube", "Instagram", "LinkedIn", "Twitter / X", "Figma", "Notion", "Loom", "Typeform",
            "Razorpay", "Stripe", "YouTube", "Instagram", "LinkedIn", "Twitter / X", "Figma", "Notion", "Loom", "Typeform",
          ].map((name, i) => (
            <span key={i} className="text-slate-200 font-semibold text-sm tracking-wide shrink-0">{name}</span>
          ))}
        </div>
      </div>

      {/* ─── Features — Bento ─────────────────────────────────────────────── */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: "#7c3aed" }}>Platform</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-slate-900 max-w-xl"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}
            >
              Everything you need to monetize as a creator.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Portfolio — 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-2xl overflow-hidden"
              style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              {/* Gradient band */}
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
              <div className="p-7 flex gap-6">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
                    <Briefcase size={18} style={{ color: "#7c3aed" }} />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: "#7c3aed" }}>01 — Portfolio</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">Portfolio Builder</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-sm">
                    Build a stunning portfolio with AI-generated content, custom themes, and instant publishing on your own domain.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Custom Themes", "SEO Ready", "AI Copy", "Custom Domain"].map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ede9fe" }}>{t}</span>
                    ))}
                  </div>
                </div>
                {/* Mini mockup */}
                <div className="hidden lg:block w-44 shrink-0">
                  <div className="rounded-2xl p-4 h-full flex flex-col" style={{ background: "linear-gradient(145deg, #fafafa, #f5f3ff)", border: "1px solid #ede9fe" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-3" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>AC</div>
                    <div className="h-2 w-20 rounded-full mb-1" style={{ background: "#cbd5e1" }} />
                    <div className="h-1.5 w-14 rounded-full mb-4" style={{ background: "#e2e8f0" }} />
                    <div className="space-y-1.5 flex-1">
                      {[100, 80, 60].map((w, i) => <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: "#e2e8f0" }} />)}
                    </div>
                    <div className="flex gap-1 mt-3">
                      {["Figma", "React"].map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#ede9fe", color: "#7c3aed" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right col: Store + Analytics */}
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl overflow-hidden flex-1"
                style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #0891b2, #67e8f9)" }} />
                <div className="p-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #ecfeff, #cffafe)" }}>
                    <ShoppingBag size={16} style={{ color: "#0891b2" }} />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#0891b2" }}>02 — Store</p>
                  <h3 className="font-bold text-slate-900 mb-2 leading-tight">Creator Store</h3>
                  <p className="text-sm text-slate-500 mb-3 leading-relaxed">Sell digital products globally — Razorpay + Stripe.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Digital + Physical", "INR + USD"].map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#ecfeff", color: "#0891b2", border: "1px solid #cffafe" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-2xl overflow-hidden flex-1"
                style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #d97706, #fbbf24)" }} />
                <div className="p-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)" }}>
                    <BarChart2 size={16} style={{ color: "#d97706" }} />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#d97706" }}>03 — Analytics</p>
                  <h3 className="font-bold text-slate-900 mb-2 leading-tight">Analytics</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Real-time views, revenue, and conversions.</p>
                </div>
              </motion.div>
            </div>

            {/* Courses — full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3 rounded-2xl overflow-hidden"
              style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #059669, #34d399)" }} />
              <div className="p-7 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" }}>
                  <BookOpen size={18} style={{ color: "#059669" }} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: "#059669" }}>04 — LMS</p>
                  <h3 className="font-bold text-slate-900 mb-1.5 text-lg leading-tight">Courses & LMS</h3>
                  <p className="text-sm text-slate-500">Build and sell online courses with video hosting, drip content, certificates, and cohort management.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {["Video Hosting", "Certificates", "Cohorts", "Drip Content"].map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #d1fae5" }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#fafafa" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: "#059669" }}>Social Proof</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-slate-900"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}
            >
              Real results, real creators.
            </motion.h2>
          </motion.div>

          {/* Featured — dark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-10 mb-5 relative overflow-hidden"
            style={{ background: "#07070a" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(124,58,237,0.12) 0%, transparent 60%)" }} />
            <div className="absolute top-4 left-6 select-none pointer-events-none" style={{ fontSize: "120px", lineHeight: 1, fontFamily: "Georgia, serif", color: "rgba(167,139,250,0.15)" }}>&ldquo;</div>
            <div className="relative z-10">
              <div className="flex gap-0.5 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="leading-relaxed mb-8 max-w-2xl" style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", lineHeight: 1.65, color: "rgba(255,255,255,0.85)" }}>
                &ldquo;I launched my portfolio and made ₹50,000 in my first weekend on BrandingOS. It completely changed how I work with clients — I went from chasing leads to being found by them.&rdquo;
              </p>
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>PS</div>
                  <div>
                    <p className="font-semibold text-white text-sm">Priya Sharma</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>UI/UX Designer · Bangalore</p>
                  </div>
                </div>
                <div className="rounded-2xl px-5 py-3" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(167,139,250,0.7)" }}>Earned first weekend</p>
                  <p className="text-2xl font-bold" style={{ color: "#a78bfa" }}>₹50,000</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {SUPPORTING_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-7"
                style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(j => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#f1f5f9", color: "#475569" }}>{t.avatar}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">{t.metric}</p>
                    <p className="text-[11px] text-slate-400">{t.metricLabel}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.16em] uppercase mb-4 text-slate-400">Pricing</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-slate-900 mb-3"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}
            >
              Grow at your own pace.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-slate-400 text-sm">Start free — upgrade when you&apos;re ready. No lock-in.</motion.p>
          </motion.div>

          <motion.div variants={staggerS} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-4 gap-4">
            {PLANS.map((p) => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                className="rounded-2xl p-6 flex flex-col relative"
                style={p.highlight ? {
                  background: "linear-gradient(145deg, #7c3aed, #5b21b6)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.4), 0 2px 8px rgba(0,0,0,0.2)",
                  border: "1px solid rgba(167,139,250,0.3)",
                } : {
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full tracking-wide uppercase" style={{ background: "#a78bfa", color: "#fff" }}>
                    Popular
                  </span>
                )}
                <h3 className={`font-bold mb-1 text-xs tracking-[0.1em] uppercase ${p.highlight ? "text-violet-200" : "text-slate-400"}`}>{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-3xl font-black ${p.highlight ? "text-white" : "text-slate-900"}`}>{p.price}</span>
                  <span className={`text-xs font-medium ${p.highlight ? "text-violet-300" : "text-slate-400"}`}>{p.period}</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${p.highlight ? "text-violet-100" : "text-slate-500"}`}>
                      <Check size={12} className={`mt-0.5 shrink-0 ${p.highlight ? "text-violet-300" : "text-violet-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="text-center text-sm py-2.5 rounded-xl font-semibold transition-colors"
                  style={p.highlight ? {
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                  } : {
                    background: "#0f172a",
                    color: "#fff",
                  }}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA — dark ───────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden" style={{ background: "#07070a" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute" style={{ top: "-30%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "80%", background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.16em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Get started</motion.p>
            <motion.h2
              variants={fadeUp}
              className="mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#ffffff", fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}
            >
              Own your creator brand.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
              Join 1,200+ creators already building with BrandingOS.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-sm transition-all"
                style={{ background: "#ffffff", color: "#07070a", boxShadow: "0 4px 24px rgba(255,255,255,0.15)" }}
              >
                Start for free <ArrowRight size={16} />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-sm transition-all"
                style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
              >
                Sign in
              </Link>
            </motion.div>
            <motion.p variants={fadeIn} className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
              Free forever plan · No credit card required · Setup in 5 minutes
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ background: "#07070a", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-sm font-bold text-white">BrandingOS</span>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>The creator OS built for India and beyond.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {["Privacy", "Terms", "Support", "Blog", "Changelog"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2025 BrandingOS</p>
        </div>
      </footer>
    </div>
  )
}
