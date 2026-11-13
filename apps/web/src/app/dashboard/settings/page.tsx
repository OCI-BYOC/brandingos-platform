"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Bell, Globe, Shield, CreditCard, Zap, Check, ExternalLink } from "lucide-react"
import { ShimmerCard, FadeUp } from "@/components/ui/animations"

const TABS = [
  { id: "profile",  label: "Profile",       icon: User },
  { id: "plan",     label: "Plan & Billing", icon: CreditCard },
  { id: "domain",   label: "Domain",         icon: Globe },
  { id: "notifs",   label: "Notifications",  icon: Bell },
  { id: "security", label: "Security",       icon: Shield },
]

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "/forever",
    features: ["1 portfolio", "5 products", "50 AI credits/mo", "BrandingOS subdomain"],
    highlight: false,
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    features: ["3 portfolios", "50 products", "500 AI credits/mo", "Custom domain", "Analytics"],
    highlight: true,
    current: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹1,499",
    period: "/month",
    features: ["10 portfolios", "Unlimited products", "2000 AI credits/mo", "LMS & courses", "Priority support"],
    highlight: false,
    current: false,
  },
  {
    id: "brand",
    name: "Brand",
    price: "₹3,999",
    period: "/month",
    features: ["Unlimited everything", "10,000 AI credits/mo", "White-label", "Dedicated support", "API access"],
    highlight: false,
    current: false,
  },
]

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"

function ProfileTab() {
  const [saved, setSaved] = useState(false)
  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="space-y-6">
      <ShimmerCard className="p-6">
        <h3 className="font-semibold mb-5 text-sm text-slate-500">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "First Name",   placeholder: "Alex",      value: "Alex" },
            { label: "Last Name",    placeholder: "Chen",      value: "Chen" },
            { label: "Display Name", placeholder: "Alex Chen", value: "Alex Chen" },
            { label: "Username",     placeholder: "alex-chen", value: "alex-chen" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">{f.label}</label>
              <input defaultValue={f.value} placeholder={f.placeholder} className={inputClass} />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Bio</label>
            <textarea
              rows={3}
              defaultValue="UI/UX Designer & Brand Strategist helping startups build beautiful digital experiences."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </ShimmerCard>

      <ShimmerCard className="p-6">
        <h3 className="font-semibold mb-5 text-sm text-slate-500">Contact</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "Email",    value: "alex@example.com",    type: "email" },
            { label: "Website",  value: "https://alexchen.in",  type: "url"   },
            { label: "Twitter",  value: "@alexchendesign",      type: "text"  },
            { label: "LinkedIn", value: "linkedin.com/in/alex", type: "text"  },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-slate-500 mb-1.5 font-medium">{f.label}</label>
              <input defaultValue={f.value} type={f.type} className={inputClass} />
            </div>
          ))}
        </div>
      </ShimmerCard>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm min-w-[120px] justify-center">
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
          <div key={p.id} className={`card p-5 flex flex-col relative ${p.highlight ? "border-violet-300 ring-2 ring-violet-100" : ""}`}>
            {p.current && <span className="text-xs text-violet-600 font-semibold mb-2">Current plan</span>}
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-purple">Most popular</span>}
            <h3 className="font-bold text-slate-900 mb-1">{p.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-slate-900">{p.price}</span>
              <span className="text-xs text-slate-400">{p.period}</span>
            </div>
            <ul className="space-y-1.5 flex-1 mb-5">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                  <Check size={11} className="text-emerald-500 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button className={`text-xs py-2 rounded-lg font-semibold transition-colors ${p.current ? "bg-slate-100 text-slate-400 cursor-default" : p.highlight ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              {p.current ? "Current plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>

      <ShimmerCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Payment Method</h3>
            <p className="text-xs text-slate-400 mt-1">Payments processed securely via Razorpay</p>
          </div>
          <button className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors font-medium">
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
      <h3 className="font-semibold mb-1 text-sm text-slate-900">Custom Domain</h3>
      <p className="text-xs text-slate-400 mb-6">Connect your own domain to your BrandingOS portfolio.</p>
      <div className="flex gap-3 mb-6">
        <input placeholder="yourname.com" className={`${inputClass} flex-1`} />
        <button className="btn-primary px-5 py-2.5 rounded-xl text-sm">Connect</button>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-2 border border-slate-100">
        <p className="font-semibold text-slate-700">DNS Setup Instructions</p>
        <p>1. Add a <code className="text-violet-600 bg-violet-50 px-1 rounded">CNAME</code> record pointing to <code className="text-cyan-600 bg-cyan-50 px-1 rounded">cname.brandingos.in</code></p>
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
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-sm text-slate-900">Email Notifications</h3>
      </div>
      {Object.entries({
        newSale:       "New sale or purchase",
        newStudent:    "New course enrollment",
        weeklyDigest:  "Weekly analytics digest",
        productReview: "Product reviews",
        aiCredit:      "Low AI credits warning",
      }).map(([k, label]) => (
        <div key={k} className="px-6 py-4 border-b border-slate-50 last:border-0 flex items-center justify-between">
          <span className="text-sm text-slate-600">{label}</span>
          <button
            onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k as keyof typeof p] }))}
            className={`w-11 h-6 rounded-full transition-colors relative ${prefs[k as keyof typeof prefs] ? "bg-violet-500" : "bg-slate-200"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${prefs[k as keyof typeof prefs] ? "left-6" : "left-1"}`} />
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
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-7 bg-slate-50 rounded-2xl p-1.5 w-fit border border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${tab === t.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          >
            {tab === t.id && (
              <motion.div layoutId="settings-tab" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
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
            <h3 className="font-semibold mb-4 text-sm text-slate-900">Security</h3>
            <p className="text-sm text-slate-500">Authentication is managed by Clerk. <a href="#" className="text-violet-600 hover:underline">Open Clerk dashboard →</a></p>
          </ShimmerCard>
        )}
      </FadeUp>
    </div>
  )
}
