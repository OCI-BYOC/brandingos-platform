"use client"

import { useState, useCallback, KeyboardEvent } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, ArrowRight, ArrowLeft, Check, Plus, Trash2,
  BookOpen, Shirt, Brush, Dumbbell, Utensils, Code2, Heart, Sparkles,
  Eye, ExternalLink,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  description: string
  price: string
  type: "digital" | "physical" | "subscription"
}

interface StoreData {
  storeName: string
  sellCategory: string
  niche: string
  nicheCustom: string
  audienceDescription: string
  audienceAge: string
  audienceGoal: string
  products: Product[]
  pricingModel: string
  primaryCurrency: string
  themeStyle: string
  themeColor: string
  paymentProvider: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SELL_CATEGORIES = [
  { id: "courses",   label: "Courses & Training",    icon: BookOpen, description: "Video courses, workshops" },
  { id: "merch",     label: "Merchandise",           icon: Shirt,    description: "Physical branded goods" },
  { id: "art",       label: "Art & Design",          icon: Brush,    description: "Prints, templates, assets" },
  { id: "fitness",   label: "Fitness & Wellness",    icon: Dumbbell, description: "Programs, plans, coaching" },
  { id: "food",      label: "Food & Recipes",        icon: Utensils, description: "Recipe books, meal plans" },
  { id: "software",  label: "Software & Tools",      icon: Code2,    description: "SaaS, plugins, scripts" },
  { id: "coaching",  label: "Coaching & Consulting", icon: Heart,    description: "Sessions, memberships" },
  { id: "other",     label: "Something Else",        icon: Sparkles, description: "Build your own category" },
]

const NICHES: Record<string, string[]> = {
  courses:   ["Coding & Dev", "Design", "Marketing", "Personal Finance", "Language Learning", "Photography"],
  merch:     ["Streetwear", "Minimalist", "Pop Culture", "Sports", "Nature & Outdoors", "Abstract Art"],
  art:       ["Digital Art", "Illustrations", "UI Templates", "Stock Photos", "Motion Graphics", "Fonts"],
  fitness:   ["Weight Loss", "Strength Training", "Yoga & Mindfulness", "Nutrition", "Running", "Sports Performance"],
  food:      ["Vegan & Plant-Based", "Baking", "Meal Prep", "World Cuisine", "Healthy Eating", "Desserts"],
  software:  ["Productivity Tools", "Design Tools", "Developer Utilities", "AI Tools", "Analytics", "No-code"],
  coaching:  ["Business & Career", "Life Coaching", "Relationship Coaching", "Health & Wellness", "Financial"],
  other:     [],
}

const AUDIENCE_AGES = ["18–24", "25–34", "35–44", "45–54", "55+", "All ages"]
const AUDIENCE_GOALS = [
  "Learn a new skill", "Advance their career", "Start a business",
  "Improve health", "Save money", "Find creative outlet", "Build a community",
]

const PRICING_MODELS = [
  { id: "one-time",     label: "One-time purchase",  description: "Pay once, own forever" },
  { id: "subscription", label: "Subscription",       description: "Recurring monthly or yearly" },
  { id: "freemium",     label: "Free + Premium",     description: "Free tier with paid upgrades" },
  { id: "bundle",       label: "Bundle & save",      description: "Package deals and collections" },
  { id: "pay-what",     label: "Pay what you want",  description: "Flexible community pricing" },
]

const CURRENCIES = ["INR ₹", "USD $", "EUR €", "GBP £", "AED د.إ", "SGD S$"]

const THEME_STYLES = [
  { id: "clean",   label: "Clean & Minimal",   bg: "#FFFFFF", accent: "#7c3aed", text: "#0a0a0f", border: "#e5e7eb" },
  { id: "dark",    label: "Dark & Bold",       bg: "#09090b", accent: "#a78bfa", text: "#f4f4f5", border: "#27272a" },
  { id: "warm",    label: "Warm & Earthy",     bg: "#fdf8f0", accent: "#d97706", text: "#1c1917", border: "#e7d7bf" },
  { id: "vibrant", label: "Vibrant & Playful", bg: "#faf5ff", accent: "#7c3aed", text: "#1e1b4b", border: "#ddd6fe" },
]

const THEME_COLORS = ["#7c3aed", "#2563eb", "#059669", "#e11d48", "#d97706", "#0891b2"]

const PAYMENT_PROVIDERS = [
  { id: "razorpay", label: "Razorpay",     description: "India-first, UPI, cards, net banking" },
  { id: "stripe",   label: "Stripe",       description: "Global, 135+ currencies" },
  { id: "paypal",   label: "PayPal",       description: "140+ countries" },
  { id: "paytm",    label: "Paytm",        description: "India UPI & wallet" },
  { id: "skip",     label: "Skip for now", description: "Connect a payment provider later" },
]

const STEP_LABELS = ["Store Name", "What You Sell", "Your Niche", "Your Audience", "First Product", "Pricing", "Look & Feel", "Payments"]
const TOTAL_STEPS = STEP_LABELS.length

function emptyProduct(): Product {
  return { id: crypto.randomUUID(), name: "", description: "", price: "", type: "digital" }
}

// ─── Store Preview ─────────────────────────────────────────────────────────────

function StorePreview({ data }: { data: StoreData }) {
  const theme = THEME_STYLES.find(t => t.id === data.themeStyle) ?? THEME_STYLES[0]
  const accent = data.themeColor || theme.accent
  const storeName = data.storeName || "Your Store"
  const niche = data.nicheCustom || data.niche || data.sellCategory || "Creator"
  const products = data.products.filter(p => p.name)
  const currency = data.primaryCurrency?.split(" ")[1] ?? "₹"

  return (
    <div style={{ background: theme.bg, color: theme.text, fontFamily: "var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif)" }}
      className="w-full h-full overflow-y-auto text-[11px] leading-relaxed">
      <div style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}`, color: theme.text }} className="flex items-center justify-between px-5 py-3 sticky top-0 z-10">
        <span className="font-bold text-[13px]">{storeName}</span>
        <div className="flex gap-3 text-[10px] opacity-60"><span>Products</span><span>About</span><span>Contact</span></div>
        <div className="text-[10px] px-2 py-1 rounded font-semibold" style={{ background: accent, color: "#fff" }}>Cart</div>
      </div>
      <div className="px-5 pt-6 pb-4" style={{ background: `${accent}0a` }}>
        <div className="text-[9px] font-semibold tracking-widest uppercase opacity-50 mb-1">{niche}</div>
        <h1 className="text-[18px] font-bold leading-tight mb-2">{storeName}</h1>
        <p className="text-[10px] opacity-60 mb-3 max-w-[220px]">
          {data.audienceGoal ? `Helping you to ${data.audienceGoal.toLowerCase()}.` : "Discover our curated collection."}
        </p>
        <div className="inline-block text-[10px] px-3 py-1.5 rounded font-semibold" style={{ background: accent, color: "#fff" }}>Shop Now →</div>
      </div>
      <div className="px-5 py-4">
        <div className="text-[9px] font-bold tracking-widest uppercase opacity-40 mb-3">Products</div>
        {products.length === 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map(i => (
              <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: theme.border }}>
                <div className="h-14 flex items-center justify-center opacity-10 text-[20px]" style={{ background: `${accent}20` }}>📦</div>
                <div className="p-2">
                  <div className="w-16 h-2 rounded mb-1" style={{ background: theme.text, opacity: 0.15 }} />
                  <div className="w-8 h-1.5 rounded" style={{ background: accent, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="rounded-xl overflow-hidden border" style={{ borderColor: theme.border }}>
                <div className="h-12 flex items-center justify-center text-[18px]" style={{ background: `${accent}18` }}>
                  {p.type === "digital" ? "📱" : p.type === "subscription" ? "🔄" : "📦"}
                </div>
                <div className="p-2">
                  <div className="font-semibold text-[10px] leading-tight truncate">{p.name}</div>
                  {p.price && <div className="text-[9px] mt-0.5 font-bold" style={{ color: accent }}>{currency}{p.price}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-5 py-3 border-t text-center" style={{ borderColor: theme.border }}>
        <div className="text-[9px] opacity-30">Powered by BrandingOS · {storeName}</div>
      </div>
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT    = "w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 text-xl placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors"
const INPUT_SM = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors"
const INPUT_SM_INLINE = "bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors"
const STEP_NUM = "text-violet-500 text-sm font-semibold mb-1"
const STEP_H2  = "text-2xl font-bold text-slate-900 mb-2"
const STEP_SUB = "text-slate-500 text-sm"
const HINT     = "text-slate-400 text-xs"

function optionStyle(selected: boolean) {
  return { background: selected ? "#F5F3FF" : "#FFFFFF", borderColor: selected ? "#7C3AED" : "#E5E7EB" }
}
function iconStyle(selected: boolean) {
  return { background: selected ? "#EDE9FE" : "#F3F4F6" }
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepStoreName({ data, onChange, onNext }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void; onNext: () => void }) {
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && data.storeName.trim()) onNext() }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>01 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>What&apos;s your store name?</h2>
        <p className={STEP_SUB}>This will be your store&apos;s identity. Keep it memorable.</p>
      </div>
      <input autoFocus value={data.storeName} onChange={e => onChange("storeName", e.target.value)} onKeyDown={handleKey}
        placeholder="e.g. Pixel Drops, Fit Formula, MindStack…" className={INPUT} />
      <p className={HINT}>Press Enter to continue ↵</p>
    </div>
  )
}

function StepWhatYouSell({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>02 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>What do you sell?</h2>
        <p className={STEP_SUB}>Choose the best fit — you can always sell across multiple categories.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SELL_CATEGORIES.map(cat => {
          const Icon = cat.icon
          const selected = data.sellCategory === cat.id
          return (
            <button key={cat.id} onClick={() => onChange("sellCategory", cat.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:border-violet-300" style={optionStyle(selected)}>
              <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={iconStyle(selected)}>
                <Icon size={16} className={selected ? "text-violet-600" : "text-slate-400"} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${selected ? "text-violet-700" : "text-slate-700"}`}>{cat.label}</div>
                <div className="text-xs text-slate-400">{cat.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepNiche({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  const suggestions = NICHES[data.sellCategory] ?? []
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>03 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>Your specific niche.</h2>
        <p className={STEP_SUB}>The more specific you are, the better you&apos;ll connect with your ideal customer.</p>
      </div>
      {suggestions.length > 0 && (
        <div>
          <p className={`${HINT} mb-3`}>Quick options:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => { onChange("niche", s); onChange("nicheCustom", "") }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm transition-all hover:border-violet-300"
                style={optionStyle(data.niche === s && !data.nicheCustom)}>
                <Check size={12} className={data.niche === s && !data.nicheCustom ? "text-violet-500" : "text-transparent"} />
                <span className={data.niche === s && !data.nicheCustom ? "text-violet-700 font-semibold" : "text-slate-700"}>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="text-slate-600 text-xs font-medium mb-2 block">Or describe your own niche</label>
        <input autoFocus={suggestions.length === 0} value={data.nicheCustom} onChange={e => { onChange("nicheCustom", e.target.value); if (e.target.value) onChange("niche", "") }}
          placeholder="e.g. Minimalist interior design for small apartments" className={INPUT_SM} />
      </div>
    </div>
  )
}

function StepAudience({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>04 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>Who are you building for?</h2>
        <p className={STEP_SUB}>Understanding your audience helps us tailor everything.</p>
      </div>
      <div>
        <label className="text-slate-600 text-xs font-medium mb-2 block">Describe your ideal customer</label>
        <textarea autoFocus value={data.audienceDescription} onChange={e => onChange("audienceDescription", e.target.value)}
          placeholder="e.g. Ambitious 20-somethings who want to transition into tech but feel overwhelmed by where to start."
          rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors resize-none" />
      </div>
      <div>
        <label className="text-slate-600 text-xs font-medium mb-2 block">Age range</label>
        <div className="flex flex-wrap gap-2">
          {AUDIENCE_AGES.map(a => (
            <button key={a} onClick={() => onChange("audienceAge", a)}
              className="text-sm px-4 py-2 rounded-xl border transition-all" style={optionStyle(data.audienceAge === a)}>
              <span className={data.audienceAge === a ? "text-violet-700 font-semibold" : "text-slate-600"}>{a}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-slate-600 text-xs font-medium mb-2 block">Their primary goal</label>
        <div className="flex flex-col gap-1.5">
          {AUDIENCE_GOALS.map(g => (
            <button key={g} onClick={() => onChange("audienceGoal", g)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-left transition-all hover:border-violet-300" style={optionStyle(data.audienceGoal === g)}>
              <Check size={12} className={data.audienceGoal === g ? "text-violet-500" : "text-transparent"} />
              <span className={data.audienceGoal === g ? "text-violet-700 font-semibold" : "text-slate-600"}>{g}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepFirstProduct({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  const updateProduct = (id: string, field: keyof Product, value: string) =>
    onChange("products", data.products.map(p => p.id === id ? { ...p, [field]: value } : p))
  const addProduct = () => onChange("products", [...data.products, emptyProduct()])
  const removeProduct = (id: string) => onChange("products", data.products.filter(p => p.id !== id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>05 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>Add your first product.</h2>
        <p className={STEP_SUB}>Start with your best offer — you can add more after launch.</p>
      </div>
      <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
        {data.products.map((product, idx) => (
          <div key={product.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Product {idx + 1}</span>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {(["digital", "physical", "subscription"] as const).map(t => (
                    <button key={t} onClick={() => updateProduct(product.id, "type", t)}
                      className="text-[10px] font-semibold px-2 py-1 rounded-md border transition-all capitalize"
                      style={optionStyle(product.type === t)}>
                      <span className={product.type === t ? "text-violet-700" : "text-slate-500"}>{t}</span>
                    </button>
                  ))}
                </div>
                {data.products.length > 1 && (
                  <button onClick={() => removeProduct(product.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
            <input value={product.name} onChange={e => updateProduct(product.id, "name", e.target.value)}
              placeholder="Product name" className={`${INPUT_SM_INLINE} w-full`} />
            <textarea value={product.description} onChange={e => updateProduct(product.id, "description", e.target.value)}
              placeholder="What does it include? What transformation does it deliver?" rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors resize-none" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 bg-slate-100 px-2 py-2 rounded-lg">
                {data.primaryCurrency?.split(" ")[1] ?? "₹"}
              </span>
              <input value={product.price} onChange={e => updateProduct(product.id, "price", e.target.value)}
                placeholder="0.00" className={`flex-1 ${INPUT_SM_INLINE}`} />
            </div>
          </div>
        ))}
      </div>
      {data.products.length < 4 && (
        <button onClick={addProduct}
          className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 transition-colors px-4 py-2 rounded-xl border border-dashed border-violet-300 hover:border-violet-500 hover:bg-violet-50">
          <Plus size={16} /> Add another product
        </button>
      )}
    </div>
  )
}

function StepPricing({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>06 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>How will you charge?</h2>
        <p className={STEP_SUB}>Pick a pricing model that fits your offer and your audience.</p>
      </div>
      <div className="flex flex-col gap-2">
        {PRICING_MODELS.map(m => (
          <button key={m.id} onClick={() => onChange("pricingModel", m.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:border-violet-300" style={optionStyle(data.pricingModel === m.id)}>
            <div className="shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all"
              style={{ background: data.pricingModel === m.id ? "#7c3aed" : "transparent", borderColor: data.pricingModel === m.id ? "#7c3aed" : "#D1D5DB" }}>
              {data.pricingModel === m.id && <Check size={11} className="text-white" />}
            </div>
            <div>
              <div className={`text-sm font-semibold ${data.pricingModel === m.id ? "text-violet-700" : "text-slate-700"}`}>{m.label}</div>
              <div className="text-xs text-slate-400">{m.description}</div>
            </div>
          </button>
        ))}
      </div>
      <div>
        <label className="text-slate-600 text-xs font-medium mb-2 block">Primary currency</label>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map(c => (
            <button key={c} onClick={() => onChange("primaryCurrency", c)}
              className="text-sm font-mono px-4 py-2 rounded-xl border transition-all" style={optionStyle(data.primaryCurrency === c)}>
              <span className={data.primaryCurrency === c ? "text-violet-700 font-bold" : "text-slate-600"}>{c}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepLookAndFeel({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>07 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>Choose your store&apos;s look.</h2>
        <p className={STEP_SUB}>Every theme is fully customizable after launch.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {THEME_STYLES.map(t => {
          const selected = data.themeStyle === t.id
          return (
            <button key={t.id} onClick={() => onChange("themeStyle", t.id)}
              className="text-left rounded-xl border overflow-hidden transition-all"
              style={{ borderColor: selected ? "#7C3AED" : "#E5E7EB", boxShadow: selected ? "0 0 0 2px rgba(124,58,237,0.15)" : "none" }}>
              <div className="h-20 p-3 flex flex-col gap-1.5" style={{ background: t.bg }}>
                <div className="flex items-center justify-between">
                  <div className="w-8 h-1.5 rounded-full" style={{ background: t.text, opacity: 0.8 }} />
                  <div className="w-4 h-1.5 rounded-full" style={{ background: t.accent }} />
                </div>
                <div className="w-20 h-2 rounded" style={{ background: t.text, opacity: 0.9 }} />
                <div className="flex gap-1.5 mt-auto">
                  <div className="w-8 h-1.5 rounded" style={{ background: t.accent }} />
                  <div className="w-6 h-1.5 rounded" style={{ background: t.border }} />
                </div>
              </div>
              <div className="px-3 py-2 bg-white">
                <div className={`text-sm font-semibold ${selected ? "text-violet-700" : "text-slate-700"}`}>{t.label}</div>
              </div>
            </button>
          )
        })}
      </div>
      <div>
        <p className="text-slate-600 text-xs font-medium mb-3">Accent colour</p>
        <div className="flex gap-3">
          {THEME_COLORS.map(c => (
            <button key={c} onClick={() => onChange("themeColor", c)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{ background: c, borderColor: data.themeColor === c ? "white" : "transparent", boxShadow: data.themeColor === c ? `0 0 0 2px ${c}` : "none" }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StepPayments({ data, onChange }: { data: StoreData; onChange: (k: keyof StoreData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={STEP_NUM}>08 / {TOTAL_STEPS}</div>
        <h2 className={STEP_H2}>Set up payments.</h2>
        <p className={STEP_SUB}>Choose how customers will pay you. You can connect multiple providers.</p>
      </div>
      <div className="flex flex-col gap-2">
        {PAYMENT_PROVIDERS.map(p => (
          <button key={p.id} onClick={() => onChange("paymentProvider", p.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:border-violet-300" style={optionStyle(data.paymentProvider === p.id)}>
            <div className="shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all"
              style={{ background: data.paymentProvider === p.id ? "#7c3aed" : "transparent", borderColor: data.paymentProvider === p.id ? "#7c3aed" : "#D1D5DB" }}>
              {data.paymentProvider === p.id && <Check size={11} className="text-white" />}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${data.paymentProvider === p.id ? "text-violet-700" : "text-slate-700"}`}>{p.label}</div>
              <div className="text-xs text-slate-400">{p.description}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
        <p className="text-xs text-violet-700 font-medium">Your store is almost ready! 🎉</p>
        <p className="text-xs text-violet-600 mt-1">After launch, you can connect more payment methods, add products, and customize every detail from your store dashboard.</p>
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

const INITIAL_DATA: StoreData = {
  storeName: "", sellCategory: "", niche: "", nicheCustom: "",
  audienceDescription: "", audienceAge: "", audienceGoal: "",
  products: [emptyProduct()], pricingModel: "", primaryCurrency: "INR ₹",
  themeStyle: "clean", themeColor: "#7c3aed", paymentProvider: "",
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StoreNewPage() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState<StoreData>(INITIAL_DATA)
  const [showPreview, setShowPreview] = useState(false)

  const change = useCallback((key: keyof StoreData, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  const goNext = () => { if (step < TOTAL_STEPS - 1) { setDir(1); setStep(s => s + 1) } }
  const goBack = () => { if (step > 0) { setDir(-1); setStep(s => s - 1) } }
  const canAdvance = () => {
    if (step === 0) return data.storeName.trim().length > 0
    if (step === 1) return data.sellCategory.length > 0
    return true
  }

  const steps = [
    <StepStoreName      key="name"     data={data} onChange={change} onNext={goNext} />,
    <StepWhatYouSell    key="category" data={data} onChange={change} />,
    <StepNiche          key="niche"    data={data} onChange={change} />,
    <StepAudience       key="audience" data={data} onChange={change} />,
    <StepFirstProduct   key="product"  data={data} onChange={change} />,
    <StepPricing        key="pricing"  data={data} onChange={change} />,
    <StepLookAndFeel    key="look"     data={data} onChange={change} />,
    <StepPayments       key="payments" data={data} onChange={change} />,
  ]

  const progress = (step / (TOTAL_STEPS - 1)) * 100

  return (
    // Dialog overlay — backdrop + centered white card
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full max-w-5xl" style={{ height: "88vh" }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-900">BrandingOS</span>
            <span className="hidden sm:block text-xs text-slate-400">Store Builder</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div key={i} className="transition-all duration-300 rounded-full" style={{
                  width: i === step ? 20 : 6, height: 6,
                  background: i < step ? "#7c3aed" : i === step ? "#7c3aed" : "#E5E7EB",
                }} />
              ))}
            </div>
            <span className="text-xs text-slate-400">{step + 1} / {TOTAL_STEPS}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(v => !v)}
              className="md:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Eye size={14} /> Preview
            </button>
            <Link href="/dashboard/store"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X size={14} /> Exit
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 shrink-0 bg-slate-100">
          <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left — Question panel */}
          <div className={`flex flex-col overflow-hidden transition-all duration-300 border-r border-slate-100 ${showPreview ? "hidden" : "flex"} md:flex md:w-[55%]`}>
            <div className="flex-1 overflow-y-auto px-10 py-10">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  {steps[step]}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between px-10 py-5 shrink-0 border-t border-slate-100">
              <button onClick={goBack} disabled={step === 0}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 disabled:opacity-0 transition-all">
                <ArrowLeft size={16} /> Back
              </button>
              <div className="flex items-center gap-3">
                {step < TOTAL_STEPS - 1 && !canAdvance() && (
                  <span className="text-xs text-slate-400">{step === 0 ? "Enter your store name" : "Make a selection"}</span>
                )}
                {step < TOTAL_STEPS - 1 ? (
                  <button onClick={goNext} disabled={!canAdvance()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
                    style={{ background: "#7c3aed", boxShadow: canAdvance() ? "0 4px 16px rgba(124,58,237,0.3)" : "none" }}>
                    {step === TOTAL_STEPS - 2 ? "Finish" : "Continue"} <ArrowRight size={16} />
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: "#7c3aed", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                    <Sparkles size={16} /> Launch Store
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right — Live preview */}
          <div className={`flex-col overflow-hidden bg-slate-50 ${showPreview ? "flex flex-1" : "hidden"} md:flex md:flex-1`}>
            <div className="flex items-center justify-between px-6 py-3 shrink-0 bg-white border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2 ml-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400 font-mono">
                    {data.storeName ? data.storeName.toLowerCase().replace(/\s+/g, "") : "yourstore"}.brandingos.in
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Live preview</span>
                <ExternalLink size={12} className="text-slate-300" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={JSON.stringify({ storeName: data.storeName, theme: data.themeStyle, color: data.themeColor, prods: data.products.filter(p => p.name).length })}
                    initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="w-full h-full">
                    <StorePreview data={data} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
