"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import {
  ArrowRight, Sparkles, BarChart2, ShoppingBag, BookOpen,
  Briefcase, Check, Star, Zap, TrendingUp, Users, IndianRupee,
  Globe, Shield, Palette,
} from "lucide-react"

/* ─── Animation presets ─────────────────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }
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

/* ─── Data ──────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Briefcase,
    title: "Portfolio Builder",
    desc: "Build stunning portfolios with AI-generated content, custom themes, and instant publishing on your own domain.",
    tags: ["Custom Themes", "SEO Ready", "AI Copy"],
    gradient: "from-violet-50 to-indigo-50",
    iconBg: "bg-violet-100 text-violet-600",
    accent: "#7c3aed",
  },
  {
    icon: ShoppingBag,
    title: "Creator Store",
    desc: "Sell digital downloads, physical products, and services globally — Razorpay for India, Stripe Connect worldwide.",
    tags: ["Digital + Physical", "INR + USD", "Instant Payout"],
    gradient: "from-cyan-50 to-blue-50",
    iconBg: "bg-cyan-100 text-cyan-600",
    accent: "#0891b2",
  },
  {
    icon: BookOpen,
    title: "Courses & LMS",
    desc: "Build and sell online courses with video hosting, drip content, quizzes, certificates, and cohort management.",
    tags: ["Video Hosting", "Certificates", "Cohorts"],
    gradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100 text-emerald-600",
    accent: "#059669",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    desc: "Track portfolio views, store revenue, course enrollments, and AI content performance from one dashboard.",
    tags: ["Real-time", "Revenue Tracking", "Funnels"],
    gradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100 text-amber-600",
    accent: "#d97706",
  },
]

const STEPS = [
  {
    n: "01",
    icon: Sparkles,
    title: "Create Your Account",
    desc: "Sign up free in 30 seconds — your first portfolio, store, and 50 AI credits are waiting.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    n: "02",
    icon: Palette,
    title: "Build Your Brand",
    desc: "Use AI to generate your portfolio bio, choose a theme, and publish your page in under 5 minutes.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Monetize & Grow",
    desc: "Add products, create courses, and start earning. Payments go directly to your bank account.",
    color: "bg-emerald-50 text-emerald-600",
  },
]

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "UI/UX Designer, Bangalore",
    quote: "I launched my portfolio and made my first ₹50k in a weekend. BrandingOS completely changed how I work with clients.",
    avatar: "PS",
    metric: "₹50K in 72 hours",
    stars: 5,
    gradient: "from-violet-400 to-indigo-500",
  },
  {
    name: "Rahul Verma",
    role: "Full Stack Developer, Pune",
    quote: "The LMS feature is so clean. My first course sold out in 48 hours without any ads. The analytics showed exactly who bought.",
    avatar: "RV",
    metric: "342 students enrolled",
    stars: 5,
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    name: "Anjali Mehta",
    role: "Brand Consultant, Mumbai",
    quote: "Clients find me through my BrandingOS page every single week. It's the best investment I've made for my freelance career.",
    avatar: "AM",
    metric: "12 inbound leads/month",
    stars: 5,
    gradient: "from-emerald-400 to-teal-500",
  },
]

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["1 portfolio", "5 products", "50 AI credits/mo", "BrandingOS subdomain"],
    highlight: false,
    cta: "Get started free",
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    features: ["3 portfolios", "50 products", "500 AI credits/mo", "Custom domain", "Analytics"],
    highlight: true,
    cta: "Start Pro",
  },
  {
    name: "Growth",
    price: "₹1,499",
    period: "/month",
    features: ["10 portfolios", "Unlimited products", "2000 AI credits/mo", "LMS & courses", "Priority support"],
    highlight: false,
    cta: "Start Growth",
  },
  {
    name: "Brand",
    price: "₹3,999",
    period: "/month",
    features: ["Unlimited everything", "10,000 AI credits/mo", "White-label", "Dedicated support", "API access"],
    highlight: false,
    cta: "Contact sales",
  },
]

const STATS = [
  { value: 1200,   suffix: "+",  prefix: "",   label: "Creators building" },
  { value: 3400,   suffix: "+",  prefix: "",   label: "Portfolios live" },
  { value: 2,      suffix: ".8Cr+", prefix: "₹", label: "Revenue generated" },
  { value: 180000, suffix: "+",  prefix: "",   label: "AI credits used" },
]

const LOGOS = [
  "Razorpay", "Stripe", "YouTube", "Instagram", "LinkedIn", "Twitter / X",
  "Notion", "Figma", "Loom", "Typeform",
]

/* ─── Dashboard preview component ──────────────────────────────────────── */
function DashboardPreview() {
  const kpiData = [
    { color: "#7c3aed", bars: [4, 6, 5, 8, 7, 9, 8, 10] },
    { color: "#0891b2", bars: [5, 7, 6, 9, 8, 10, 9, 11] },
    { color: "#059669", bars: [3, 5, 4, 7, 6, 8, 7, 9] },
    { color: "#d97706", bars: [7, 6, 8, 5, 7, 6, 8, 7] },
  ]
  const linePoints = "0,42 9,36 18,40 27,28 36,22 45,18 54,20 63,13 72,16 81,8 90,10 100,5"

  return (
    <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
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

      {/* App UI */}
      <div className="flex h-72 overflow-hidden">
        {/* Sidebar */}
        <div className="w-40 bg-white border-r border-slate-100 flex flex-col p-2 shrink-0">
          <div className="px-2 py-2 mb-2">
            <div className="h-4 w-20 rounded-md" style={{ background: "linear-gradient(90deg,#7c3aed,#0891b2)" }} />
          </div>
          {["Overview", "Portfolio", "Store", "Courses", "Analytics"].map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 ${i === 0 ? "bg-violet-50" : ""}`}
            >
              <div className={`w-3 h-3 rounded shrink-0 ${i === 0 ? "bg-violet-400" : "bg-slate-100"}`} />
              <div className={`h-2 rounded-full ${i === 0 ? "bg-violet-200 w-12" : "bg-slate-100 w-10"}`} />
            </div>
          ))}
          <div className="mt-auto mx-1 bg-violet-50 rounded-lg p-2">
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-10 bg-violet-300 rounded-full" />
              <div className="h-1.5 w-6 bg-violet-200 rounded-full" />
            </div>
            <div className="h-1 bg-violet-100 rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-violet-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 bg-slate-50/60 p-3 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-32 bg-slate-700 rounded-full opacity-80" />
            <div className="flex gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-white border border-slate-200" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {kpiData.map((kpi, i) => (
              <div key={i} className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm">
                <div className="w-5 h-5 rounded mb-1.5" style={{ background: `${kpi.color}18` }}>
                  <div className="w-full h-full rounded flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: kpi.color }} />
                  </div>
                </div>
                <div className="h-2.5 w-9 rounded-full mb-0.5" style={{ background: "#0f172a", opacity: 0.7 }} />
                <div className="h-1.5 w-7 bg-slate-100 rounded-full mb-1.5" />
                <div className="flex items-end gap-0.5 h-4">
                  {kpi.bars.map((h, j) => (
                    <div key={j} className="flex-1 rounded-t-sm" style={{ height: `${h * 10}%`, backgroundColor: `${kpi.color}55` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm">
              <div className="h-2 w-20 bg-slate-200 rounded-full mb-2" />
              <svg viewBox="0 0 100 50" className="w-full h-12">
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points={`0,50 ${linePoints} 100,50`}
                  fill="url(#lg1)"
                  stroke="none"
                />
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm">
              <div className="h-2 w-16 bg-slate-200 rounded-full mb-2" />
              <div className="flex items-end gap-0.5 h-12">
                {[30, 55, 40, 70, 50, 80, 45, 65, 75, 90, 55, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{ height: `${h}%`, backgroundColor: "#05966960" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ─── Nav ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight gradient-text">BrandingOS</span>
          <div className="hidden md:flex items-center gap-7 text-sm text-slate-500">
            {[["Features", "#features"], ["Pricing", "#pricing"], ["How it works", "#how-it-works"]].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-slate-900 transition-colors font-medium">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">Sign in</Link>
            <Link href="/sign-up" className="btn-primary text-sm py-2 px-4 rounded-xl">Start for free →</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-100 blur-[80px] opacity-60 animate-glow-pulse" />
          <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-cyan-100 blur-[80px] opacity-50 animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-[200px] -translate-x-1/2 rounded-full bg-indigo-50 blur-[60px] opacity-70" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12">
          <motion.div variants={stagger} initial="hidden" animate="show" className="text-center">
            {/* Pill badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
              <Sparkles size={12} className="text-violet-500" />
              AI-Native Creator Platform · Now in Beta
              <span className="ml-1 w-1.5 h-1.5 rounded-full bg-violet-400 inline-block animate-pulse" />
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={fadeUp} className="text-display text-slate-900 mb-6 max-w-4xl mx-auto">
              Build Your{" "}
              <span className="gradient-text">Creator Brand</span>
              <br />That Actually Earns
            </motion.h1>

            {/* Sub */}
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Portfolio · Store · Courses · AI Content · Analytics — the complete creator OS, built for Indian creators going global.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center mb-6">
              <Link href="/sign-up" className="btn-primary px-8 py-3.5 text-base rounded-xl shadow-lg shadow-violet-200">
                Get Started Free <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn-outline px-8 py-3.5 text-base rounded-xl">
                See Features
              </a>
            </motion.div>

            <motion.p variants={fadeIn} className="text-xs text-slate-400">
              No credit card required · Free forever plan · Setup in 5 minutes
            </motion.p>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-16 max-w-5xl mx-auto"
            style={{ perspective: "1200px" }}
          >
            {/* Glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-200/40 via-indigo-100/20 to-cyan-200/30 blur-2xl rounded-3xl" />
            <div className="relative animate-float">
              <DashboardPreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats bar ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">
                  <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-sm text-slate-400 mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Logo marquee ──────────────────────────────────────────────── */}
      <section className="py-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-5 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Integrates with the tools you already use</p>
        </div>
        <div className="flex gap-14 items-center animate-marquee whitespace-nowrap">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span key={i} className="text-slate-300 font-semibold text-sm tracking-wider shrink-0 hover:text-slate-400 transition-colors cursor-default">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 badge badge-purple mb-5">
              <Zap size={11} /> Everything in one place
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-display-sm text-slate-900 mb-4">
              One platform for your<br /><span className="gradient-text">entire creator stack</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-slate-500 max-w-xl mx-auto">
              Stop juggling 7 different tools. BrandingOS is the only platform built to let creators build, sell, and grow — all in one place.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="feature-card flex flex-col"
              >
                {/* Gradient header area */}
                <div className={`bg-gradient-to-br ${f.gradient} p-6 pb-4`}>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${f.iconBg} shadow-sm mb-4`}>
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{f.title}</h3>
                </div>
                {/* Content */}
                <div className="p-6 pt-4 flex flex-col flex-1">
                  <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">{f.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 bg-slate-50/80">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="badge badge-blue mb-5 inline-flex">Simple &amp; fast</motion.div>
            <motion.h2 variants={fadeUp} className="text-display-sm text-slate-900 mb-16">
              From zero to <span className="gradient-text">live in minutes</span>
            </motion.h2>
            <motion.div variants={staggerS} className="grid md:grid-cols-3 gap-10 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-10 left-[21%] right-[21%] h-px bg-gradient-to-r from-violet-200 via-cyan-200 to-emerald-200" />

              {STEPS.map((s) => (
                <motion.div key={s.n} variants={fadeUp} className="text-center relative">
                  <div className={`w-14 h-14 rounded-2xl ${s.color} font-bold text-lg flex items-center justify-center mx-auto mb-5 shadow-sm relative z-10`}>
                    <s.icon size={22} />
                  </div>
                  <div className="text-xs font-bold text-slate-300 mb-2 tracking-widest uppercase">{s.n}</div>
                  <h3 className="font-bold text-slate-900 mb-3 text-base">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="badge badge-green mb-5 inline-flex">
              <Star size={10} className="fill-emerald-500 text-emerald-500" /> Loved by creators
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-display-sm text-slate-900 mb-14">
              Real results, real creators
            </motion.h2>
            <motion.div variants={staggerS} className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <motion.div key={t.name} variants={fadeUp} className="card card-hover p-7 text-left relative overflow-hidden">
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.gradient}`} />

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>

                  {/* Metric highlight */}
                  <div className="bg-slate-50 rounded-xl px-3 py-2 mb-5 inline-block">
                    <span className="text-xs font-bold text-slate-900">{t.metric}</span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} text-white text-xs font-bold flex items-center justify-center shadow-sm`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="badge badge-purple mb-5 inline-flex">Simple pricing</motion.div>
            <motion.h2 variants={fadeUp} className="text-display-sm text-slate-900 mb-3">
              Grow at your own pace
            </motion.h2>
            <motion.p variants={fadeIn} className="text-slate-500 mb-14">Start free — upgrade when you&apos;re ready. No lock-in.</motion.p>

            <motion.div variants={staggerS} className="grid md:grid-cols-4 gap-5 text-left">
              {PLANS.map((p) => (
                <motion.div
                  key={p.name}
                  variants={fadeUp}
                  className={`card p-6 flex flex-col relative ${p.highlight ? "border-violet-300 ring-2 ring-violet-200 shadow-lg shadow-violet-100" : ""}`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge badge-purple text-[10px] px-3 shadow-sm">
                      ✦ Most popular
                    </span>
                  )}
                  <h3 className="font-bold text-slate-900 mb-1 text-base">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-black text-slate-900">{p.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{p.period}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={13} className="text-violet-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sign-up"
                    className={`text-center text-sm py-2.5 rounded-xl font-semibold transition-all ${
                      p.highlight
                        ? "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Trust bar ────────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-5 items-center">
            {[
              { icon: Shield, text: "Bank-grade security" },
              { icon: Globe, text: "Payments in INR + USD" },
              { icon: Zap, text: "99.9% uptime SLA" },
              { icon: Users, text: "Dedicated creator support" },
              { icon: TrendingUp, text: "Real-time analytics" },
              { icon: IndianRupee, text: "Instant payouts" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Icon size={13} className="text-violet-400" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
        {/* Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-7 backdrop-blur-sm border border-white/20">
            <Zap size={24} className="text-yellow-300" />
          </div>
          <h2 className="text-display-sm mb-5 leading-tight">Ready to own your<br />creator brand?</h2>
          <p className="text-violet-200 mb-10 text-base leading-relaxed">
            Join 1,200+ creators already building with BrandingOS.<br />Free forever — upgrade when you need more.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl hover:bg-violet-50 transition-colors shadow-xl shadow-black/20 text-base"
            >
              Start for Free <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm text-base"
            >
              Explore features
            </a>
          </div>
          <p className="text-violet-300 text-xs mt-6">No credit card · Setup in 5 min · Cancel anytime</p>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-lg font-bold gradient-text">BrandingOS</span>
            <p className="text-xs text-slate-400 mt-1">The creator OS built for India and beyond.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-slate-400">
            {["Privacy", "Terms", "Support", "Blog", "Changelog"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-600 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-slate-300">© 2025 BrandingOS</p>
        </div>
      </footer>
    </div>
  )
}
