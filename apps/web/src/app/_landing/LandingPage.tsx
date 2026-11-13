"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight, Sparkles, BarChart2, ShoppingBag, BookOpen,
  Briefcase, Check, Star, Zap,
} from "lucide-react"

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

const FEATURES = [
  { icon: Briefcase, title: "Portfolio Builder", desc: "Build stunning portfolios with AI-generated content, custom themes, and instant publishing on your own domain.", tags: ["Custom Themes", "SEO Ready", "AI Copy"], color: "bg-violet-50 text-violet-600" },
  { icon: ShoppingBag, title: "Creator Store", desc: "Sell digital downloads, physical products, and services globally — Razorpay for India, Stripe Connect worldwide.", tags: ["Digital + Physical", "INR + USD", "Instant Payout"], color: "bg-cyan-50 text-cyan-600" },
  { icon: BookOpen, title: "Courses & LMS", desc: "Build and sell online courses with video hosting, drip content, quizzes, certificates, and cohort management.", tags: ["Video Hosting", "Certificates", "Cohorts"], color: "bg-emerald-50 text-emerald-600" },
  { icon: BarChart2, title: "Analytics", desc: "Track portfolio views, store revenue, course enrollments, and AI content performance from one dashboard.", tags: ["Real-time", "Revenue Tracking", "Funnels"], color: "bg-amber-50 text-amber-600" },
]

const STEPS = [
  { n: "01", title: "Create Your Account", desc: "Sign up free — your first portfolio, store, and 50 AI credits are waiting." },
  { n: "02", title: "Build Your Brand", desc: "Use AI to generate your portfolio bio, choose a theme, and publish in under 5 minutes." },
  { n: "03", title: "Monetize", desc: "Add products, create courses, and start earning. Payments go directly to your bank." },
]

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "UI/UX Designer", quote: "I launched my portfolio and made my first ₹50k in a weekend. BrandingOS is unreal.", avatar: "PS" },
  { name: "Rahul Verma", role: "Full Stack Developer", quote: "The LMS feature is so clean. My first course sold out in 48 hours without any ads.", avatar: "RV" },
  { name: "Anjali Mehta", role: "Brand Consultant", quote: "Clients find me through my BrandingOS page every week. Best investment I've made.", avatar: "AM" },
]

const PLANS = [
  { name: "Free", price: "₹0", period: "forever", features: ["1 portfolio", "5 products", "50 AI credits/mo", "BrandingOS subdomain"], highlight: false },
  { name: "Pro", price: "₹499", period: "/month", features: ["3 portfolios", "50 products", "500 AI credits/mo", "Custom domain", "Analytics"], highlight: true },
  { name: "Growth", price: "₹1,499", period: "/month", features: ["10 portfolios", "Unlimited products", "2000 AI credits/mo", "LMS & courses", "Priority support"], highlight: false },
  { name: "Brand", price: "₹3,999", period: "/month", features: ["Unlimited everything", "10,000 AI credits/mo", "White-label", "Dedicated support", "API access"], highlight: false },
]

const STATS = [
  { value: "1,200+", label: "Creators" },
  { value: "3,400+", label: "Portfolios live" },
  { value: "₹2.8Cr+", label: "Revenue generated" },
  { value: "1,80,000+", label: "AI credits used" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight gradient-text">BrandingOS</span>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            {["Features", "Pricing", "How it works"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="hover:text-slate-900 transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">Sign In</Link>
            <Link href="/sign-up" className="btn-primary text-sm py-2 px-4 rounded-lg">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-100 blur-3xl opacity-70" />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
              <Sparkles size={12} /> AI-Native Creator Platform · Now in Beta
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              Build Your<br /><span className="gradient-text">Creator Brand</span><br />in Minutes
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Portfolio builder · Creator store · Courses & LMS · AI content · Analytics.<br />
              Everything a modern creator needs — in one platform.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
              <Link href="/sign-up" className="btn-primary px-6 py-3 text-sm rounded-xl">
                Start for Free <ArrowRight size={15} />
              </Link>
              <a href="#features" className="btn-outline px-6 py-3 text-sm rounded-xl">See Features</a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-slate-100">
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="badge badge-purple mb-4">Everything in one place</span>
            <h2 className="text-3xl md:text-4xl font-bold">One platform for your<br /><span className="gradient-text">entire creator stack</span></h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="card card-hover p-6 flex flex-col gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color}`}><f.icon size={18} /></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {f.tags.map((t) => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="badge badge-blue mb-4">Simple & fast</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-14">From zero to <span className="gradient-text">live in minutes</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 font-bold text-sm flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="badge badge-green mb-4">Loved by creators</span>
          <h2 className="text-3xl font-bold mb-12">Real results, real creators</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6 text-left">
                <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-xs font-bold flex items-center justify-center">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="badge badge-purple mb-4">Simple pricing</span>
          <h2 className="text-3xl font-bold mb-3">Grow at your own pace</h2>
          <p className="text-slate-500 text-sm mb-12">Start free, upgrade when you&apos;re ready.</p>
          <div className="grid md:grid-cols-4 gap-5 text-left">
            {PLANS.map((p) => (
              <div key={p.name} className={`card p-6 flex flex-col relative ${p.highlight ? "border-violet-300 ring-2 ring-violet-200" : ""}`}>
                {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-purple">Most popular</span>}
                <h3 className="font-bold text-slate-900 mb-1">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-xs text-slate-400">{p.period}</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check size={13} className="text-violet-500 mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className={`text-center text-sm py-2.5 rounded-xl font-semibold transition-colors ${p.highlight ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-violet-600 to-indigo-700 py-20 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <Zap size={28} className="mx-auto mb-5 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Ready to own your creator brand?</h2>
          <p className="text-violet-200 mb-8 text-sm">Join 1,200+ creators already building with BrandingOS. Free forever — upgrade when you need more.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors shadow-lg">
            Start for Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center">
        <p className="text-xs text-slate-400">© 2025 BrandingOS. Built for creators in India and beyond.</p>
      </footer>
    </div>
  )
}
