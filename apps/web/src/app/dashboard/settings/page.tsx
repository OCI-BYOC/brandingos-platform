"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Bell, Globe, Shield, CreditCard, Zap, Check, ExternalLink } from "lucide-react"
import { ShimmerCard, FadeUp } from "@/components/ui/animations"

const TABS = [
  { id: "profile",   label: "Profile",        icon: User },
  { id: "plan",      label: "Plan & Billing",  icon: CreditCard },
  { id: "domain",    label: "Domain",          icon: Globe },
  { id: "notifs",    label: "Notifications",   icon: Bell },
  { id: "security",  label: "Security",        icon: Shield },
]

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "/forever",
    features: ["1 portfolio", "5 products", "50 AI credits/mo", "BrandingOS subdomain"],
    color: "from-white/10 to-white/5",
    cta: "Current plan",
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    features: ["3 portfolios", "50 products", "500 AI credits/mo", "Custom domain", "Analytics"],
    color: "from-purple-600/30 to-indigo-600/20",
    cta: "Upgrade",
    current: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹1,499",
    period: "/month",
    features: ["10 portfolios", "Unlimited products", "2000 AI credits/mo", "LMS & courses", "Priority support"],
    color: "from-cyan-600/30 to-blue-600/20",
    cta: "Upgrade",
    current: false,
  },
  {
    id: "brand",
    name: "Brand",
    price: "₹3,999",
    period: "/month",
    features: ["Unlimited everything", "10,000 AI credits/mo", "White-label", "Dedicated support", "API access"],
    color: "from-amber-600/30 to-orange-600/20",
    cta: "Contact us",
    current: false,
  },
]

function ProfileTab() {
  const [saved, setSaved] = useState(false)
  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="space-y-6">
      <ShimmerCard className="p-6">
        <h3 className="font-semibold mb-5 text-sm text-white/70">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "First Name",    placeholder: "Alex",           value: "Alex" },
            { label: "Last Name",     placeholder: "Chen",           value: "Chen" },
            { label: "Display Name",  placeholder: "Alex Chen",      value: "Alex Chen" },
            { label: "Username",      placeholder: "alex-chen",      value: "alex-chen" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-white/40 mb-1.5">{f.label}</label>
              <input
                defaultValue={f.value}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-colors"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-xs text-white/40 mb-1.5">Bio</label>
            <textarea
              rows={3}
              defaultValue="UI/UX Designer & Brand Strategist helping startups build beautiful digital experiences."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-colors resize-none"
            />
          </div>
        </div>
      </ShimmerCard>

      <ShimmerCard className="p-6">
        <h3 className="font-semibold mb-5 text-sm text-white/70">Contact</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "Email",    value: "alex@example.com",    type: "email" },
            { label: "Website",  value: "https://alexchen.in",  type: "url"   },
            { label: "Twitter",  value: "@alexchendesign",      type: "text"  },
            { label: "LinkedIn", value: "linkedin.com/in/alex", type: "text"  },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-white/40 mb-1.5">{f.label}</label>
              <input
                defaultValue={f.value}
                type={f.type}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          ))}
        </div>
      </ShimmerCard>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-aurora flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium min-w-[120px] justify-center">
          {saved ? <><Check size={15} /> Saved!</> : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

function PlanTab() {
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((p) => (
          <div key={p.id} className={`rounded-2xl p-5 bg-gradient-to-br ${p.color} border ${p.current ? "border-purple-500/40" : "border-white/[0.07]"} flex flex-col`}>
            {p.current && <span className="text-xs text-purple-400 font-medium mb-2">Current</span>}
            <h3 className="font-bold text-lg mb-0.5">{p.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold">{p.price}</span>
              <span className="text-xs text-white/40">{p.period}</span>
            </div>
            <ul className="space-y-1.5 flex-1 mb-5">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                  <Check size={11} className="text-emerald-400 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button className={`text-xs py-2 rounded-lg font-medium transition-colors ${p.current ? "bg-white/10 text-white/40 cursor-default" : "bg-white/10 hover:bg-purple-500/30 text-white/70 hover:text-white"}`}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      <ShimmerCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Payment Method</h3>
            <p className="text-xs text-white/40 mt-1">Payments processed securely via Razorpay</p>
          </div>
          <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
            Manage <ExternalLink size={12} />
          </button>
        </div>
      </ShimmerCard>
    </div>
  )
}

function DomainTab() {
  return (
    <ShimmerCard className="p-6">
      <h3 className="font-semibold mb-1 text-sm">Custom Domain</h3>
      <p className="text-xs text-white/40 mb-6">Connect your own domain to your BrandingOS portfolio.</p>
      <div className="flex gap-3 mb-6">
        <input
          placeholder="yourname.com"
          className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
        <button className="btn-aurora px-5 py-2.5 rounded-xl text-sm font-medium">Connect</button>
      </div>
      <div className="bg-white/[0.03] rounded-xl p-4 text-xs text-white/40 space-y-2 border border-white/[0.05]">
        <p className="font-medium text-white/60">DNS Setup Instructions</p>
        <p>1. Add a <code className="text-purple-400">CNAME</code> record pointing to <code className="text-cyan-400">cname.brandingos.in</code></p>
        <p>2. Propagation may take up to 48 hours.</p>
        <p>3. SSL certificate is provisioned automatically.</p>
      </div>
    </ShimmerCard>
  )
}

function NotifsTab() {
  const [prefs, setPrefs] = useState({
    newSale: true, newStudent: true, weeklyDigest: true, productReview: false, aiCredit: true,
  })
  return (
    <ShimmerCard className="overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="font-semibold text-sm">Email Notifications</h3>
      </div>
      {Object.entries({
        newSale: "New sale or purchase",
        newStudent: "New course enrollment",
        weeklyDigest: "Weekly analytics digest",
        productReview: "Product reviews",
        aiCredit: "Low AI credits warning",
      }).map(([k, label]) => (
        <div key={k} className="px-6 py-4 border-b border-white/[0.03] last:border-0 flex items-center justify-between">
          <span className="text-sm text-white/70">{label}</span>
          <button
            onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k as keyof typeof p] }))}
            className={`w-11 h-6 rounded-full transition-colors relative ${prefs[k as keyof typeof prefs] ? "bg-purple-500" : "bg-white/15"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs[k as keyof typeof prefs] ? "left-6" : "left-1"}`} />
          </button>
        </div>
      ))}
    </ShimmerCard>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState("profile")

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-7 bg-white/[0.04] rounded-2xl p-1.5 w-fit border border-white/[0.06]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${tab === t.id ? "text-white" : "text-white/40 hover:text-white/70"}`}
          >
            {tab === t.id && (
              <motion.div layoutId="settings-tab" className="absolute inset-0 bg-white/10 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
            )}
            <t.icon size={14} className="relative z-10" />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <FadeUp key={tab}>
        {tab === "profile"  && <ProfileTab />}
        {tab === "plan"     && <PlanTab />}
        {tab === "domain"   && <DomainTab />}
        {tab === "notifs"   && <NotifsTab />}
        {tab === "security" && (
          <ShimmerCard className="p-6">
            <h3 className="font-semibold mb-4 text-sm">Security</h3>
            <p className="text-sm text-white/50">Authentication is managed by Clerk. <a href="#" className="text-purple-400 hover:underline">Open Clerk dashboard →</a></p>
          </ShimmerCard>
        )}
      </FadeUp>
    </div>
  )
}
