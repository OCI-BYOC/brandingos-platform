"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Briefcase, ShoppingBag, BookOpen, BarChart2, Zap, Globe,
  ArrowRight, Check, Star, Users, TrendingUp, Sparkles,
  Palette, Package, GraduationCap, LineChart, ChevronRight,
} from "lucide-react"
import { BlurText, GradientText, FadeUp, CountUp, AuroraBackground, ShimmerCard, staggerContainer, staggerItem } from "@/components/ui/animations"

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Palette,
    title: "Portfolio Builder",
    desc: "Build stunning portfolios with AI-generated content, custom themes, and instant publishing on your own domain.",
    gradient: "from-purple-500 to-indigo-600",
    tags: ["Custom Themes", "SEO Ready", "AI Copy"],
  },
  {
    icon: Package,
    title: "Creator Store",
    desc: "Sell digital downloads, physical products, and Printful merch globally — Razorpay for India, Stripe Connect worldwide.",
    gradient: "from-cyan-500 to-blue-600",
    tags: ["Digital + Physical", "INR + USD", "Instant Payout"],
  },
  {
    icon: GraduationCap,
    title: "Courses & LMS",
    desc: "Build and sell online courses with video hosting, drip content, cohorts, certificates, and an affiliate program.",
    gradient: "from-emerald-500 to-teal-600",
    tags: ["Video Hosting", "Certificates", "Cohorts"],
  },
  {
    icon: LineChart,
    title: "Analytics",
    desc: "Track portfolio views, store revenue, course enrollments, and AI spend in a single unified dashboard.",
    gradient: "from-amber-500 to-orange-600",
    tags: ["Real-time", "Revenue Tracking", "AI Spend"],
  },
]

const STEPS = [
  { n: "01", title: "Create Your Account", desc: "Sign up free — your first portfolio, store, and 50 AI credits are waiting." },
  { n: "02", title: "Build Your Brand", desc: "Use AI to generate your portfolio bio, choose a theme, and publish in under 5 minutes." },
  { n: "03", title: "Monetize", desc: "Add products, create courses, and start earning. Payments go directly to your bank." },
]

const PRICING = [
  {
    tier: "Free",
    price: "₹0",
    per: "forever",
    desc: "Start building your brand",
    color: "border-white/10",
    features: ["1 Portfolio", "5 AI credits/mo", "Basic analytics", "BrandingOS subdomain"],
    cta: "Get Started",
    ctaStyle: "border border-white/20 hover:border-white/40",
  },
  {
    tier: "Pro",
    price: "₹499",
    per: "per month",
    desc: "For serious creators",
    color: "border-purple-500/50",
    features: ["3 Portfolios", "200 AI credits/mo", "Creator Store", "Custom domain", "Full analytics"],
    cta: "Start Free Trial",
    ctaStyle: "btn-aurora",
    popular: true,
  },
  {
    tier: "Growth",
    price: "₹1,499",
    per: "per month",
    desc: "For growing creators",
    color: "border-cyan-500/40",
    features: ["Unlimited Portfolios", "500 AI credits/mo", "Courses & LMS", "Priority support", "Affiliate program"],
    cta: "Start Free Trial",
    ctaStyle: "border border-cyan-500/50 hover:border-cyan-500 text-cyan-400",
  },
  {
    tier: "Brand",
    price: "₹3,999",
    per: "per month",
    desc: "For teams and agencies",
    color: "border-white/10",
    features: ["Everything in Growth", "2,000 AI credits/mo", "Team accounts", "White-label option", "Dedicated support"],
    cta: "Contact Sales",
    ctaStyle: "border border-white/20 hover:border-white/40",
  },
]

const TESTIMONIALS = [
  { name: "Rahul Sharma", role: "Designer & Educator", avatar: "RS", quote: "Launched my portfolio and first course in one weekend. Already ₹40k in revenue.", stars: 5 },
  { name: "Priya Nair", role: "Full-Stack Developer", avatar: "PN", quote: "The AI content generation alone saves me 3 hours a week. Worth every rupee.", stars: 5 },
  { name: "Arjun Mehta", role: "Marketing Consultant", avatar: "AM", quote: "BrandingOS replaced 4 separate tools. My store, portfolio, and courses — all in one place.", stars: 5 },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06060f] text-white overflow-x-hidden">

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-xl bg-[#06060f]/80"
      >
        <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          BrandingOS
        </span>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#how" className="hover:text-white transition-colors">How it works</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/sign-up" className="btn-aurora text-sm px-5 py-2 rounded-full">
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">
        <AuroraBackground className="absolute inset-0" />

        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8"
        >
          <Sparkles size={12} />
          AI-Native Creator Platform · Now in Beta
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6 max-w-5xl">
          <BlurText text="Build Your" className="block" delay={0.1} />
          <span className="block mt-1">
            <GradientText>Creator Brand</GradientText>
          </span>
          <BlurText text="in Minutes" className="block mt-1" delay={0.3} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed"
        >
          Portfolio builder · Creator store · Courses & LMS · AI content · Analytics.
          Everything a modern creator needs — in one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link href="/sign-up" className="btn-aurora px-8 py-3.5 rounded-full text-base flex items-center gap-2 shadow-xl shadow-purple-500/20">
            Start for Free <ArrowRight size={18} />
          </Link>
          <Link href="#features" className="px-8 py-3.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all text-base">
            See Features
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-10 text-center"
        >
          {[
            { label: "Creators", value: 1200, suffix: "+" },
            { label: "Portfolios live", value: 3400, suffix: "+" },
            { label: "Revenue generated", value: 2800000, suffix: "₹+" },
            { label: "AI credits used", value: 180000, suffix: "+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-28 px-6">
        <FadeUp className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-medium mb-4">
            <Zap size={12} /> Everything in one place
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            One platform for your<br />
            <GradientText>entire creator stack</GradientText>
          </h2>
        </FadeUp>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <ShimmerCard key={f.title} delay={i * 0.1} className="p-8 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                    {t}
                  </span>
                ))}
              </div>
            </ShimmerCard>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-28 px-6 bg-white/[0.015]">
        <FadeUp className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            From zero to <GradientText>live in minutes</GradientText>
          </h2>
        </FadeUp>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.15} className="text-center">
              <div className="text-6xl font-black text-white/5 mb-4">{s.n}</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 -mt-10 relative z-10">
                <span className="text-sm font-bold">{i + 1}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6">
        <FadeUp className="text-center mb-16">
          <h2 className="text-4xl font-bold">Loved by creators</h2>
        </FadeUp>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ShimmerCard key={t.name} delay={i * 0.1} className="p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </ShimmerCard>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6 bg-white/[0.015]">
        <FadeUp className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-medium mb-4">
            <TrendingUp size={12} /> Simple, transparent pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Start free,<br /><GradientText>scale as you grow</GradientText>
          </h2>
        </FadeUp>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5">
          {PRICING.map((p, i) => (
            <ShimmerCard key={p.tier} delay={i * 0.08} className={`p-6 relative border ${p.color}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-cyan-500">
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <h3 className="font-semibold text-lg">{p.tier}</h3>
                <p className="text-white/40 text-xs mt-1">{p.desc}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black">{p.price}</span>
                <span className="text-white/40 text-sm ml-2">{p.per}</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className={`w-full text-center block py-2.5 rounded-xl text-sm font-medium transition-all ${p.ctaStyle}`}>
                {p.cta}
              </Link>
            </ShimmerCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <AuroraBackground className="absolute inset-0 opacity-50" />
        <FadeUp>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to own your<br />
            <GradientText>professional narrative?</GradientText>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Join 1,200+ creators building their brand on BrandingOS. No credit card required.
          </p>
          <Link href="/sign-up" className="btn-aurora px-10 py-4 rounded-full text-lg inline-flex items-center gap-2 shadow-2xl shadow-purple-500/30">
            Start Building Free <ArrowRight size={20} />
          </Link>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            BrandingOS
          </span>
          <div className="flex flex-wrap gap-6 text-sm text-white/40">
            {["Features", "Pricing", "Blog", "Careers", "Terms", "Privacy"].map((l) => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <p className="text-white/30 text-sm">© 2025 BrandingOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
