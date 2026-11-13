"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import {
  ArrowRight, ArrowUpRight, Check, Star,
  Briefcase, ShoppingBag, BookOpen, BarChart2,
} from "lucide-react"

/* ─── Animation presets ─────────────────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }
const fadeIn   = { hidden: { opacity: 0 },         show: { opacity: 1, transition: { duration: 0.4 } } }
const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const staggerS = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

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
    <div className="rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 h-9 bg-slate-50 border-b border-slate-200">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 mx-4 max-w-[220px]">
          <div className="bg-white border border-slate-200 rounded px-2 h-5 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 shrink-0" />
            <span className="text-[10px] text-slate-400 font-mono truncate">app.brandingos.in/dashboard</span>
          </div>
        </div>
      </div>

      <div className="flex h-64 overflow-hidden">
        {/* Sidebar */}
        <div className="w-36 bg-white border-r border-slate-100 flex flex-col p-2 shrink-0">
          <div className="px-2 py-2 mb-2">
            <div className="h-3.5 w-20 rounded-sm" style={{ background: "linear-gradient(90deg,#7c3aed,#0891b2)" }} />
          </div>
          {["Overview", "Portfolio", "Store", "Courses", "Analytics"].map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 ${i === 0 ? "bg-violet-50" : ""}`}
            >
              <div className={`w-2.5 h-2.5 rounded shrink-0 ${i === 0 ? "bg-violet-400" : "bg-slate-100"}`} />
              <div className={`h-1.5 rounded-full ${i === 0 ? "bg-violet-200 w-10" : "bg-slate-100 w-8"}`} />
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 bg-slate-50/60 p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="h-2.5 w-28 bg-slate-700 rounded-full opacity-70" />
            <div className="flex gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-white border border-slate-200" />
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            {kpiData.map((kpi, i) => (
              <div key={i} className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm">
                <div className="w-4 h-4 rounded mb-1.5" style={{ background: `${kpi.color}18` }}>
                  <div className="w-full h-full rounded flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm" style={{ background: kpi.color }} />
                  </div>
                </div>
                <div className="h-2.5 w-10 rounded-sm mb-0.5" style={{ background: "#0f172a", opacity: 0.7 }} />
                <div className="h-1.5 w-7 bg-slate-100 rounded-full mb-1.5" />
                <div className="flex items-end gap-0.5 h-4">
                  {kpi.bars.map((h, j) => (
                    <div key={j} className="flex-1 rounded-t-sm" style={{ height: `${h * 10}%`, backgroundColor: `${kpi.color}55` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Area chart */}
          <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm">
            <div className="h-1.5 w-20 bg-slate-200 rounded-full mb-2" />
            <svg viewBox="0 0 100 50" className="w-full h-10">
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={`0,50 ${linePoints} 100,50`} fill="url(#lg1)" stroke="none" />
              <polyline points={linePoints} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ─── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            BrandingOS
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            {[["Features", "#features"], ["Pricing", "#pricing"]].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-slate-900 transition-colors font-medium">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors px-3 py-1.5 hidden md:inline-block">
              Sign in
            </Link>
            <Link href="/sign-up" className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14 pb-10 md:pt-20 md:pb-16">
        {/* Single subtle blob — top-left only */}
        <div className="absolute -top-32 -left-32 w-[380px] h-[380px] rounded-full bg-violet-100 blur-[100px] opacity-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[52%_48%] gap-10 lg:gap-16 items-center">

            {/* ── Left: editorial text ── */}
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase mb-6">
                Creator Platform
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="text-slate-900 mb-6"
                style={{
                  fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                }}
              >
                Build a brand<br />
                creators envy —<br />
                <span style={{ color: "#7c3aed" }}>and clients trust.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                Portfolio, store, courses, and analytics — the complete creator OS, built for Indian creators going global.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 text-sm"
                >
                  Start for free <ArrowRight size={15} />
                </Link>
                <Link
                  href="/alex-chen"
                  className="inline-flex items-center gap-2 text-slate-600 font-medium px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:text-slate-900 transition-all text-sm"
                >
                  See a live example <ArrowUpRight size={14} />
                </Link>
              </motion.div>

              <motion.div variants={fadeIn} className="flex items-center flex-wrap gap-4 text-sm text-slate-400">
                <span>1,200+ creators</span>
                <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
                <span>₹2.8Cr generated</span>
                <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
                <span>Free to start</span>
              </motion.div>
            </motion.div>

            {/* ── Right: dashboard preview ── */}
            <motion.div
              initial={{ opacity: 0, x: 36, rotateY: -3 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1200px" }}
              className="relative hidden lg:block"
            >
              <DashboardPreview />
              <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-violet-100/40 via-transparent to-transparent rounded-3xl blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/40">
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
                className={`text-center py-4 px-6 ${i < 3 ? "md:border-r md:border-slate-200" : ""}`}
              >
                <p className="text-3xl font-bold text-slate-900 tabular-nums">
                  <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Integrations ─────────────────────────────────────────────────── */}
      <div className="border-b border-slate-50 py-7 overflow-hidden">
        <p className="text-center text-[11px] font-semibold text-slate-300 tracking-[0.16em] uppercase mb-5">
          Integrates with
        </p>
        <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
          {["Razorpay", "Stripe", "YouTube", "Instagram", "LinkedIn", "Twitter / X", "Figma", "Notion", "Loom", "Typeform",
            "Razorpay", "Stripe", "YouTube", "Instagram", "LinkedIn", "Twitter / X", "Figma", "Notion", "Loom", "Typeform",
          ].map((name, i) => (
            <span key={i} className="text-slate-200 font-semibold text-sm tracking-wide shrink-0">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Features — Bento grid ─────────────────────────────────────────── */}
      <section id="features" className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.14em] text-violet-500 uppercase mb-4">Platform</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-slate-900 max-w-xl"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Everything you need to monetize as a creator.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Portfolio — large card (2 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 card overflow-hidden p-7 min-h-[280px]"
            >
              <div className="flex gap-6 h-full">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-5">
                    <Briefcase size={18} className="text-violet-600" />
                  </div>
                  <p className="text-[11px] font-semibold text-violet-500 uppercase tracking-[0.14em] mb-2">01 — Portfolio</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">Portfolio Builder</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-sm">
                    Build a stunning portfolio with AI-generated content, custom themes, and instant publishing on your own domain.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Custom Themes", "SEO Ready", "AI Copy", "Custom Domain"].map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 font-medium border border-violet-100">{t}</span>
                    ))}
                  </div>
                </div>
                {/* Mini portfolio mockup */}
                <div className="hidden lg:block w-44 shrink-0">
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 h-full flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold mb-3">AC</div>
                    <div className="h-2 w-20 bg-slate-200 rounded-full mb-1" />
                    <div className="h-1.5 w-14 bg-slate-100 rounded-full mb-4" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                      <div className="h-1.5 w-4/5 bg-slate-100 rounded-full" />
                      <div className="h-1.5 w-3/5 bg-slate-100 rounded-full" />
                    </div>
                    <div className="flex gap-1 mt-3">
                      {["Figma", "React"].map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-500 font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side — Store + Analytics stacked */}
            <div className="flex flex-col gap-4">
              {/* Store */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card p-6 flex-1"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                  <ShoppingBag size={16} className="text-cyan-600" />
                </div>
                <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-[0.14em] mb-1.5">02 — Store</p>
                <h3 className="font-bold text-slate-900 mb-2 leading-tight">Creator Store</h3>
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">Sell digital products globally — Razorpay + Stripe.</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Digital + Physical", "INR + USD"].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-600 font-medium border border-cyan-100">{t}</span>
                  ))}
                </div>
              </motion.div>

              {/* Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="card p-6 flex-1"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  <BarChart2 size={16} className="text-amber-600" />
                </div>
                <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-[0.14em] mb-1.5">03 — Analytics</p>
                <h3 className="font-bold text-slate-900 mb-2 leading-tight">Analytics</h3>
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">Track views, revenue, and conversions in real-time.</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Real-time", "Revenue Tracking"].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-medium border border-amber-100">{t}</span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Courses — full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3 card p-7"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-[0.14em] mb-1">04 — LMS</p>
                  <h3 className="font-bold text-slate-900 mb-1.5 text-lg leading-tight">Courses & LMS</h3>
                  <p className="text-sm text-slate-500">Build and sell online courses with video hosting, drip content, certificates, and cohort management.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {["Video Hosting", "Certificates", "Cohorts", "Drip Content"].map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-medium border border-emerald-100">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.14em] text-emerald-500 uppercase mb-4">Social Proof</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-slate-900"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Real results, real creators.
            </motion.h2>
          </motion.div>

          {/* Featured testimonial — dark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-950 rounded-3xl p-10 mb-5 relative overflow-hidden"
          >
            <div
              className="absolute top-4 left-6 select-none pointer-events-none text-violet-400"
              style={{ fontSize: "120px", lineHeight: 1, fontFamily: "Georgia, 'Times New Roman', serif", opacity: 0.18 }}
            >&ldquo;</div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 15% 50%, rgb(124 58 237 / 0.07) 0%, transparent 60%)" }} />

            <div className="relative z-10">
              <div className="flex gap-0.5 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p
                className="text-white/90 leading-relaxed mb-8 max-w-2xl"
                style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", lineHeight: 1.65 }}
              >
                &ldquo;I launched my portfolio and made ₹50,000 in my first weekend on BrandingOS. It completely changed how I work with clients — I went from chasing leads to being found by them.&rdquo;
              </p>
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">PS</div>
                  <div>
                    <p className="font-semibold text-white text-sm">Priya Sharma</p>
                    <p className="text-xs text-slate-500">UI/UX Designer · Bangalore</p>
                  </div>
                </div>
                <div className="bg-violet-500/15 border border-violet-400/25 rounded-2xl px-5 py-3">
                  <p className="text-xs font-medium text-violet-400/80 mb-0.5">Earned first weekend</p>
                  <p className="text-2xl font-bold text-violet-300">₹50,000</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Supporting testimonials */}
          <div className="grid md:grid-cols-2 gap-5">
            {SUPPORTING_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-7"
              >
                <div className="flex gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">{t.avatar}</div>
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
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-14"
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase mb-4">Pricing</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-slate-900 mb-3"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Grow at your own pace.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-slate-400 text-sm">Start free — upgrade when you&apos;re ready. No lock-in.</motion.p>
          </motion.div>

          <motion.div
            variants={staggerS}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-4"
          >
            {PLANS.map((p) => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                className={`rounded-2xl p-6 flex flex-col relative ${
                  p.highlight
                    ? "bg-violet-600 text-white shadow-xl shadow-violet-200/60"
                    : "bg-white border border-slate-200"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-violet-400 text-white px-3 py-1 rounded-full tracking-wide uppercase">
                    Popular
                  </span>
                )}
                <h3 className={`font-bold mb-1 text-xs tracking-[0.1em] uppercase ${p.highlight ? "text-violet-200" : "text-slate-400"}`}>
                  {p.name}
                </h3>
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
                  className={`text-center text-sm py-2.5 rounded-xl font-semibold transition-colors ${
                    p.highlight
                      ? "bg-white text-violet-700 hover:bg-violet-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA — dark ───────────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#09090b" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase mb-5">
              Get started
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-white mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0 }}
            >
              Own your creator brand.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-slate-400 text-base leading-relaxed mb-10">
              Join 1,200+ creators already building with BrandingOS.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-white text-slate-950 font-bold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-colors text-sm shadow-xl"
              >
                Start for free <ArrowRight size={16} />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 border border-slate-700 text-slate-300 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-colors text-sm"
              >
                Sign in
              </Link>
            </motion.div>
            <motion.p variants={fadeIn} className="text-slate-600 text-xs mt-6">
              Free forever plan · No credit card required · Setup in 5 minutes
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ background: "#09090b" }} className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-sm font-bold text-white">BrandingOS</span>
            <p className="text-xs text-slate-600 mt-1">The creator OS built for India and beyond.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-slate-600">
            {["Privacy", "Terms", "Support", "Blog", "Changelog"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-slate-700">© 2025 BrandingOS</p>
        </div>
      </footer>

    </div>
  )
}
