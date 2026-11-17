"use client"

import { useState, useCallback, KeyboardEvent } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, ArrowRight, ArrowLeft, Plus, Trash2, Check, Sparkles,
  FileDown, Headphones, Video, BookOpen, Wrench, Box, LayoutGrid,
  CreditCard, Globe, IndianRupee, DollarSign, Euro,
  ExternalLink, Eye, Zap, ShieldCheck, TrendingUp,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  type: string
  price: string
  description: string
  currency: string
}

interface StoreData {
  storeName: string
  storeTagline: string
  storeType: string
  categories: string[]
  audience: string[]
  products: Product[]
  currency: string
  pricingModel: string
  accentColor: string
  storeTheme: string
  storeSlug: string
  payments: string[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORE_TYPES = [
  { id: "digital",      label: "Digital Products",  icon: FileDown,    description: "Templates, files, presets, tools" },
  { id: "services",     label: "Services",           icon: Headphones,  description: "1:1 calls, reviews, consulting" },
  { id: "courses",      label: "Courses",            icon: Video,       description: "Video courses, cohorts, workshops" },
  { id: "ebooks",       label: "eBooks & Guides",    icon: BookOpen,    description: "PDFs, playbooks, tutorials" },
  { id: "tools",        label: "Tools & SaaS",       icon: Wrench,      description: "Mini-tools, scripts, extensions" },
  { id: "physical",     label: "Physical Products",  icon: Box,         description: "Merch, art prints, goods" },
  { id: "bundle",       label: "Bundles & Packs",    icon: LayoutGrid,  description: "Mix of formats in one offer" },
]

const CATEGORIES = [
  "Design", "Development", "Marketing", "Writing", "Photography",
  "Video", "Music", "Business", "Finance", "Education", "Fitness",
  "Cooking", "Productivity", "AI & Tech", "Personal Growth",
]

const AUDIENCES = [
  { id: "freelancers",  label: "Freelancers",  emoji: "💼" },
  { id: "startups",     label: "Startups",     emoji: "🚀" },
  { id: "students",     label: "Students",     emoji: "🎓" },
  { id: "creators",     label: "Creators",     emoji: "🎨" },
  { id: "businesses",   label: "Businesses",   emoji: "🏢" },
  { id: "developers",   label: "Developers",   emoji: "⌨️" },
  { id: "designers",    label: "Designers",    emoji: "✏️" },
  { id: "marketers",    label: "Marketers",    emoji: "📣" },
  { id: "general",      label: "Everyone",     emoji: "🌍" },
]

const CURRENCIES = [
  { id: "INR", label: "INR ₹", icon: IndianRupee, symbol: "₹" },
  { id: "USD", label: "USD $", icon: DollarSign,  symbol: "$" },
  { id: "EUR", label: "EUR €", icon: Euro,        symbol: "€" },
]

const PRICING_MODELS = [
  { id: "one-time",     label: "One-time",      description: "Pay once, own forever" },
  { id: "subscription", label: "Subscription",  description: "Monthly or yearly plans" },
  { id: "pwyw",         label: "Pay What You Want", description: "Let buyers choose" },
  { id: "free",         label: "Free + Paid",   description: "Free tier + premium" },
]

const STORE_THEMES = [
  { id: "clean",        label: "Clean",        description: "White & minimal",   bg: "#ffffff", card: "#f8fafc", border: "#e2e8f0", text: "#0f172a" },
  { id: "dark",         label: "Dark",         description: "Bold & editorial",  bg: "#09090b", card: "#18181b", border: "#27272a", text: "#fafafa" },
  { id: "warm",         label: "Warm",         description: "Soft & inviting",   bg: "#fffbf5", card: "#fef9f0", border: "#fde68a", text: "#1c1917" },
  { id: "vibrant",      label: "Vibrant",      description: "Colourful & bold",  bg: "#faf5ff", card: "#f3e8ff", border: "#ddd6fe", text: "#1e1b4b" },
]

const ACCENT_COLORS = [
  { id: "violet",  color: "#7c3aed", label: "Violet" },
  { id: "blue",    color: "#2563eb", label: "Blue"   },
  { id: "emerald", color: "#059669", label: "Emerald" },
  { id: "rose",    color: "#e11d48", label: "Rose"   },
  { id: "amber",   color: "#d97706", label: "Amber"  },
  { id: "slate",   color: "#1e293b", label: "Slate"  },
]

const PAYMENT_PROVIDERS = [
  { id: "razorpay", label: "Razorpay",    description: "Best for India (UPI, cards, wallets)",  flag: "🇮🇳" },
  { id: "stripe",   label: "Stripe",     description: "Global — 135+ currencies",              flag: "🌍" },
  { id: "paypal",   label: "PayPal",     description: "Widely trusted worldwide",              flag: "💙" },
]

const STEP_LABELS = [
  "Store Name",
  "What You Sell",
  "Your Niche",
  "Your Audience",
  "First Product",
  "Pricing Setup",
  "Store Look",
  "Payments",
]
const TOTAL = STEP_LABELS.length

function emptyProduct(currency: string): Product {
  return { id: crypto.randomUUID(), name: "", type: "digital", price: "", description: "", currency }
}

// ─── Live Store Preview ───────────────────────────────────────────────────────

function StorePreview({ data }: { data: StoreData }) {
  const theme   = STORE_THEMES.find(t => t.id === data.storeTheme) ?? STORE_THEMES[0]
  const accent  = data.accentColor || "#7c3aed"
  const name    = data.storeName   || "Your Store"
  const tagline = data.storeTagline || "The best products for the people who need them."
  const slug    = data.storeSlug    || "yourstore"
  const products = data.products.filter(p => p.name)
  const currency = CURRENCIES.find(c => c.id === data.currency) ?? CURRENCIES[0]

  return (
    <div
      className="w-full h-full overflow-y-auto text-[11px] leading-relaxed"
      style={{ background: theme.bg, color: theme.text, fontFamily: "var(--font-display, 'Space Grotesk', system-ui, sans-serif)" }}
    >
      {/* Store nav */}
      <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10" style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div className="font-bold text-[13px]">{name}</div>
        <div className="flex items-center gap-2">
          {data.categories.slice(0, 2).map(c => (
            <span key={c} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${accent}18`, color: accent }}>{c}</span>
          ))}
        </div>
        <div className="text-[10px] px-3 py-1 rounded-full font-semibold text-white" style={{ background: accent }}>
          Browse →
        </div>
      </div>

      {/* Store hero */}
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${accent}10, transparent)` }}>
        <div
          className="inline-block text-[8px] font-bold tracking-widest uppercase px-2 py-1 rounded-full mb-3"
          style={{ background: `${accent}18`, color: accent }}
        >
          {data.storeType ? STORE_TYPES.find(t => t.id === data.storeType)?.label : "Creator Store"}
        </div>
        <h1 className="text-[20px] font-bold leading-tight mb-2">{name}</h1>
        <p className="text-[11px] opacity-60 leading-relaxed max-w-[260px] mb-4">{tagline}</p>
        <div className="flex items-center gap-1.5 text-[9px] opacity-40">
          <Globe size={9} />
          <span>{slug}.brandingos.in</span>
        </div>
      </div>

      {/* Products grid */}
      <div className="px-5 pb-4">
        <div className="text-[9px] font-bold tracking-widest uppercase opacity-40 mb-3">
          {products.length > 0 ? `${products.length} Product${products.length > 1 ? "s" : ""}` : "Products"}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8 opacity-25">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-[10px]">Your products will appear here…</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {products.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ background: theme.card, border: `1px solid ${theme.border}` }}
              >
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-lg" style={{ background: `${accent}18` }}>
                  {STORE_TYPES.find(t => t.id === p.type)?.icon ? "📦" : "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[10px] truncate">{p.name}</div>
                  {p.description && <div className="text-[9px] opacity-50 line-clamp-1 mt-0.5">{p.description}</div>}
                </div>
                {p.price && (
                  <div className="shrink-0 font-bold text-[11px]" style={{ color: accent }}>
                    {currency.symbol}{p.price}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust signals */}
      <div className="px-5 py-4" style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="flex gap-3 flex-wrap">
          {[
            { icon: "🔒", label: "Secure checkout" },
            { icon: "⚡", label: "Instant delivery" },
            { icon: "✅", label: "Verified seller" },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-1.5 text-[9px] opacity-50">
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 text-center" style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="text-[9px] opacity-25">Powered by BrandingOS · {slug}.brandingos.in</div>
      </div>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepStoreName({ data, onChange, onNext }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void; onNext: () => void }) {
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && data.storeName.trim()) onNext() }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">01 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Name your store.</h2>
        <p className="text-slate-400 text-sm">This becomes your storefront URL and brand identity.</p>
      </div>
      <input
        autoFocus
        value={data.storeName}
        onChange={e => onChange("storeName", e.target.value)}
        onKeyDown={handleKey}
        placeholder="e.g. Alex's Design Kit"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-xl placeholder:text-slate-600 outline-none focus:border-cyan-500/60 transition-colors"
      />
      {data.storeName && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/4 border border-white/8">
          <Globe size={14} className="text-slate-500" />
          <span className="text-sm text-slate-400 font-mono">
            {data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "yourstore"}.brandingos.in
          </span>
          <span className="ml-auto text-xs text-emerald-400 font-semibold flex items-center gap-1"><Check size={11} /> Available</span>
        </div>
      )}
      <div>
        <label className="text-slate-400 text-xs font-medium mb-2 block">Store tagline <span className="text-slate-600">(optional)</span></label>
        <input
          value={data.storeTagline}
          onChange={e => onChange("storeTagline", e.target.value)}
          placeholder="The go-to resource for indie designers."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/60 transition-colors"
        />
      </div>
      <p className="text-slate-600 text-xs">Press Enter to continue ↵</p>
    </div>
  )
}

function StepStoreType({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">02 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">What do you sell?</h2>
        <p className="text-slate-400 text-sm">Pick the format that best describes your main offering.</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {STORE_TYPES.map(t => {
          const Icon = t.icon
          const selected = data.storeType === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange("storeType", t.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all"
              style={{
                background: selected ? "rgba(8,145,178,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: selected ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)",
              }}
            >
              <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: selected ? "rgba(8,145,178,0.25)" : "rgba(255,255,255,0.06)" }}>
                <Icon size={16} className={selected ? "text-cyan-300" : "text-slate-400"} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${selected ? "text-cyan-200" : "text-slate-300"}`}>{t.label}</div>
                <div className="text-xs text-slate-500">{t.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepNiche({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  const toggle = (c: string) => {
    const next = data.categories.includes(c) ? data.categories.filter(x => x !== c) : [...data.categories, c].slice(0, 4)
    onChange("categories", next)
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">03 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Your niche.</h2>
        <p className="text-slate-400 text-sm">Choose up to 4 categories that describe your store&apos;s focus.</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map(c => {
          const selected = data.categories.includes(c)
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              className="text-sm px-4 py-2 rounded-full border transition-all font-medium"
              style={{
                background: selected ? "rgba(8,145,178,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: selected ? "rgba(8,145,178,0.5)" : "rgba(255,255,255,0.1)",
                color: selected ? "#67e8f9" : "#94a3b8",
              }}
            >
              {selected && <Check size={12} className="inline mr-1.5" />}{c}
            </button>
          )
        })}
      </div>
      <p className="text-slate-600 text-xs">{data.categories.length}/4 selected · helps buyers find your store</p>
    </div>
  )
}

function StepAudience({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  const toggle = (a: string) => {
    const next = data.audience.includes(a) ? data.audience.filter(x => x !== a) : [...data.audience, a]
    onChange("audience", next)
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">04 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Who are you selling to?</h2>
        <p className="text-slate-400 text-sm">Select all that apply — this helps personalise your storefront copy.</p>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {AUDIENCES.map(a => {
          const selected = data.audience.includes(a.id)
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className="flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border transition-all"
              style={{
                background: selected ? "rgba(8,145,178,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: selected ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className={`text-xs font-medium ${selected ? "text-cyan-200" : "text-slate-400"}`}>{a.label}</span>
              {selected && <Check size={10} className="text-cyan-400" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepProducts({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  const updateProduct = (id: string, field: keyof Product, value: string) => {
    onChange("products", data.products.map(p => p.id === id ? { ...p, [field]: value } : p))
  }
  const add = () => onChange("products", [...data.products, emptyProduct(data.currency)])
  const remove = (id: string) => onChange("products", data.products.filter(p => p.id !== id))
  const currency = CURRENCIES.find(c => c.id === data.currency) ?? CURRENCIES[0]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">05 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Add your first product.</h2>
        <p className="text-slate-400 text-sm">Start with your best offer — you can add more after launch.</p>
      </div>
      <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
        {data.products.map((p, idx) => (
          <div key={p.id} className="bg-white/4 border border-white/8 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Product {idx + 1}</span>
              {data.products.length > 1 && (
                <button onClick={() => remove(p.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <input
              autoFocus={idx === 0}
              value={p.name}
              onChange={e => updateProduct(p.id, "name", e.target.value)}
              placeholder="Product name"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-colors"
            />
            <div className="flex gap-2">
              <select
                value={p.type}
                onChange={e => updateProduct(p.id, "type", e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 text-sm outline-none focus:border-cyan-500/50 transition-colors flex-1"
              >
                {STORE_TYPES.map(t => <option key={t.id} value={t.id} style={{ background: "#1a1a1a" }}>{t.label}</option>)}
              </select>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 gap-1 w-32">
                <span className="text-slate-500 text-sm">{currency.symbol}</span>
                <input
                  value={p.price}
                  onChange={e => updateProduct(p.id, "price", e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="0.00"
                  className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-600"
                />
              </div>
            </div>
            <textarea
              value={p.description}
              onChange={e => updateProduct(p.id, "description", e.target.value)}
              placeholder="What does this product include? (1–2 sentences)"
              rows={2}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-colors resize-none"
            />
          </div>
        ))}
      </div>
      {data.products.length < 6 && (
        <button
          onClick={add}
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-200 transition-colors px-4 py-2 rounded-xl border border-dashed border-cyan-500/25 hover:border-cyan-500/50"
        >
          <Plus size={16} /> Add another product
        </button>
      )}
    </div>
  )
}

function StepPricing({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">06 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Pricing strategy.</h2>
        <p className="text-slate-400 text-sm">Set your base currency and how you want to charge.</p>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-3 block">Base currency</label>
        <div className="flex gap-3">
          {CURRENCIES.map(c => {
            const Icon = c.icon
            const selected = data.currency === c.id
            return (
              <button
                key={c.id}
                onClick={() => onChange("currency", c.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border flex-1 justify-center transition-all"
                style={{
                  background: selected ? "rgba(8,145,178,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: selected ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)",
                }}
              >
                <Icon size={16} className={selected ? "text-cyan-300" : "text-slate-500"} />
                <span className={`text-sm font-semibold ${selected ? "text-cyan-200" : "text-slate-400"}`}>{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-3 block">Pricing model</label>
        <div className="grid grid-cols-2 gap-2.5">
          {PRICING_MODELS.map(m => {
            const selected = data.pricingModel === m.id
            return (
              <button
                key={m.id}
                onClick={() => onChange("pricingModel", m.id)}
                className="text-left px-4 py-3 rounded-xl border transition-all"
                style={{
                  background: selected ? "rgba(8,145,178,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: selected ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)",
                }}
              >
                <div className={`text-sm font-semibold ${selected ? "text-cyan-200" : "text-slate-300"}`}>{m.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.description}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StepStoreLook({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  const slugValue = data.storeSlug || data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">07 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">How should it look?</h2>
        <p className="text-slate-400 text-sm">Pick a theme and accent colour. Everything is tweakable later.</p>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-3 block">Store theme</label>
        <div className="grid grid-cols-2 gap-2.5">
          {STORE_THEMES.map(t => {
            const selected = data.storeTheme === t.id
            return (
              <button
                key={t.id}
                onClick={() => onChange("storeTheme", t.id)}
                className="text-left rounded-xl border overflow-hidden transition-all"
                style={{ borderColor: selected ? "rgba(8,145,178,0.6)" : "rgba(255,255,255,0.08)", boxShadow: selected ? "0 0 0 2px rgba(8,145,178,0.25)" : "none" }}
              >
                {/* Mini preview */}
                <div className="h-16 p-2.5 flex flex-col gap-1.5" style={{ background: t.bg }}>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-1.5 rounded-full" style={{ background: t.text, opacity: 0.8 }} />
                    <div className="w-4 h-1.5 rounded-full" style={{ background: data.accentColor || "#7c3aed" }} />
                  </div>
                  <div className="rounded-md p-1.5 flex gap-1" style={{ background: t.card, border: `1px solid ${t.border}` }}>
                    <div className="w-4 h-4 rounded" style={{ background: `${data.accentColor || "#7c3aed"}30` }} />
                    <div className="flex flex-col gap-0.5 justify-center">
                      <div className="w-12 h-1 rounded" style={{ background: t.text, opacity: 0.7 }} />
                      <div className="w-8 h-1 rounded" style={{ background: t.text, opacity: 0.3 }} />
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2" style={{ background: selected ? "rgba(8,145,178,0.1)" : "rgba(255,255,255,0.03)" }}>
                  <div className={`text-sm font-semibold ${selected ? "text-cyan-200" : "text-slate-300"}`}>{t.label}</div>
                  <div className="text-xs text-slate-500">{t.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-3 block">Accent colour</label>
        <div className="flex gap-3">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => onChange("accentColor", c.color)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                background: c.color,
                borderColor: data.accentColor === c.color ? "white" : "transparent",
                boxShadow: data.accentColor === c.color ? `0 0 0 1px ${c.color}` : "none",
              }}
              title={c.label}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-2 block">Store URL</label>
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-cyan-500/50 transition-colors">
          <span className="px-4 py-3 text-slate-500 text-sm border-r border-white/10 shrink-0 select-none">brandingos.in/</span>
          <input
            value={data.storeSlug || slugValue}
            onChange={e => onChange("storeSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder={slugValue || "yourstore"}
            className="flex-1 bg-transparent px-4 py-3 text-white text-sm placeholder:text-slate-600 outline-none"
          />
        </div>
      </div>
    </div>
  )
}

function StepPayments({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  const toggle = (id: string) => {
    const next = data.payments.includes(id) ? data.payments.filter(x => x !== id) : [...data.payments, id]
    onChange("payments", next)
  }
  const LAUNCH_FEATURES = [
    { icon: ShieldCheck, label: "SSL & security built-in" },
    { icon: Zap,         label: "Instant product delivery" },
    { icon: TrendingUp,  label: "Sales analytics from day 1" },
    { icon: CreditCard,  label: "Automated receipts & invoices" },
  ]
  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="text-cyan-400 text-sm font-semibold mb-1">08 / {TOTAL}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Accept payments.</h2>
        <p className="text-slate-400 text-sm">Choose your payment providers — connect them after setup.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {PAYMENT_PROVIDERS.map(pp => {
          const selected = data.payments.includes(pp.id)
          return (
            <button
              key={pp.id}
              onClick={() => toggle(pp.id)}
              className="flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all"
              style={{
                background: selected ? "rgba(8,145,178,0.1)" : "rgba(255,255,255,0.03)",
                borderColor: selected ? "rgba(8,145,178,0.4)" : "rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center text-lg"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)" }}
              >
                {pp.flag}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold ${selected ? "text-cyan-100" : "text-slate-300"}`}>{pp.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{pp.description}</div>
              </div>
              <div
                className="shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                style={{
                  background: selected ? "#0891b2" : "transparent",
                  borderColor: selected ? "#0891b2" : "rgba(255,255,255,0.2)",
                }}
              >
                {selected && <Check size={11} className="text-white" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* What you get */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 mb-3">Everything included at launch</p>
        <div className="grid grid-cols-2 gap-2">
          {LAUNCH_FEATURES.map(f => {
            const Icon = f.icon
            return (
              <div key={f.label} className="flex items-center gap-2 text-xs text-slate-400">
                <Icon size={13} className="text-cyan-400 shrink-0" />
                {f.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Slide variants ───────────────────────────────────────────────────────────

const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL: StoreData = {
  storeName:    "",
  storeTagline: "",
  storeType:    "",
  categories:   [],
  audience:     [],
  products:     [emptyProduct("INR")],
  currency:     "INR",
  pricingModel: "one-time",
  accentColor:  "#0891b2",
  storeTheme:   "clean",
  storeSlug:    "",
  payments:     ["razorpay"],
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StoreNewPage() {
  const [step, setStep]           = useState(0)
  const [dir,  setDir]            = useState(1)
  const [data, setData]           = useState<StoreData>(INITIAL)
  const [showPreview, setShowPreview] = useState(false)

  const change = useCallback((key: keyof StoreData, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value } as StoreData))
  }, [])

  const goNext = () => { if (step < TOTAL - 1) { setDir(1);  setStep(s => s + 1) } }
  const goBack = () => { if (step > 0)          { setDir(-1); setStep(s => s - 1) } }

  const canAdvance = () => {
    if (step === 0) return data.storeName.trim().length > 0
    if (step === 1) return data.storeType.length > 0
    return true
  }

  const steps = [
    <StepStoreName key="name"      data={data} onChange={change} onNext={goNext} />,
    <StepStoreType key="type"      data={data} onChange={change} />,
    <StepNiche     key="niche"     data={data} onChange={change} />,
    <StepAudience  key="audience"  data={data} onChange={change} />,
    <StepProducts  key="products"  data={data} onChange={change} />,
    <StepPricing   key="pricing"   data={data} onChange={change} />,
    <StepStoreLook key="look"      data={data} onChange={change} />,
    <StepPayments  key="payments"  data={data} onChange={change} />,
  ]

  const progress = (step / (TOTAL - 1)) * 100
  const slugDisplay = (data.storeSlug || data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "yourstore")

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#07070a" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-4">
          <span className="text-base font-bold text-white" style={{ fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}>
            BrandingOS
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Store Builder
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div
                key={i}
                className="transition-all duration-300 rounded-full"
                style={{
                  width:      i === step ? 20 : 6,
                  height:     6,
                  background: i < step ? "#0891b2" : i === step ? "#67e8f9" : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">{step + 1} / {TOTAL}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(v => !v)}
            className="md:hidden flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/8 transition-colors"
          >
            <Eye size={14} /> Preview
          </button>
          <Link
            href="/dashboard/store"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={14} /> Exit
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 shrink-0 bg-white/5">
        <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — Question panel */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${showPreview ? "hidden" : "flex"} md:flex md:w-[55%]`}
          style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex-1 overflow-y-auto px-10 py-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {steps[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav footer */}
          <div className="flex items-center justify-between px-10 py-5 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 disabled:opacity-0 transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-3">
              {step < TOTAL - 1 && !canAdvance() && (
                <span className="text-xs text-slate-600">
                  {step === 0 ? "Enter a store name" : "Make a selection"}
                </span>
              )}
              {step < TOTAL - 1 ? (
                <button
                  onClick={goNext}
                  disabled={!canAdvance()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
                  style={{
                    background: canAdvance() ? "#0891b2" : "rgba(8,145,178,0.3)",
                    color: "white",
                    boxShadow: canAdvance() ? "0 0 20px rgba(8,145,178,0.4)" : "none",
                  }}
                >
                  {step === TOTAL - 2 ? "Finish" : "Continue"} <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#0891b2", color: "white", boxShadow: "0 0 24px rgba(8,145,178,0.5)" }}
                >
                  <Sparkles size={16} /> Launch My Store
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right — Live store preview */}
        <div
          className={`flex-col overflow-hidden ${showPreview ? "flex flex-1" : "hidden"} md:flex md:flex-1`}
          style={{ background: "#0a0a0f" }}
        >
          <div className="flex items-center justify-between px-6 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="bg-white/6 border border-white/8 rounded-md px-3 py-1 flex items-center gap-2 ml-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 font-mono">{slugDisplay}.brandingos.in</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Live preview</span>
              <ExternalLink size={12} className="text-slate-700" />
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-6">
            <div
              className="w-full h-full rounded-2xl overflow-hidden border"
              style={{ borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}
            >
              <AnimatePresence mode="sync">
                <motion.div
                  key={JSON.stringify({
                    n: data.storeName, tl: data.storeTagline, ty: data.storeType,
                    c: data.categories.join(), a: data.accentColor, th: data.storeTheme,
                    p: data.products.filter(p => p.name).length, s: data.storeSlug,
                  })}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  <StorePreview data={data} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
