"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft, Save, Loader2, Store, Palette, ShoppingCart, Package,
  Users, CheckCircle2, Trash2, ToggleLeft, ToggleRight, ExternalLink,
  Plus, AlertTriangle, Image as ImageIcon, Globe, Tag, CreditCard,
  Truck, IndianRupee, Edit3,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ────────────────────────────────────────────────────────────────────

type Seller = {
  id: string
  slug: string
  name: string
  bio: string | null
  logo_url: string | null
  banner_url: string | null
  store_name: string
  store_tagline: string | null
  store_theme: string
  accent_color: string
  store_type: string | null
  categories: string | null
  audience: string | null
  currency_code: string
  pricing_model: string
  payment_provider: string
  fulfillment_provider: string
  is_active: boolean
}

type Product = {
  id: string
  title: string
  type: string
  price: number
  currency: string
  status: string
  coverImageUrl: string | null
  createdAt: string | null
}

type Tab = "profile" | "appearance" | "commerce" | "products" | "catalog"

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "profile",    label: "Profile",    Icon: Store       },
  { id: "appearance", label: "Appearance", Icon: Palette     },
  { id: "commerce",   label: "Commerce",   Icon: ShoppingCart},
  { id: "products",   label: "Products",   Icon: Package     },
  { id: "catalog",    label: "Catalog",    Icon: Users       },
]

const THEMES = [
  { id: "clean",   label: "Clean",   preview: "bg-white border-slate-200" },
  { id: "modern",  label: "Modern",  preview: "bg-slate-900 border-slate-700" },
  { id: "minimal", label: "Minimal", preview: "bg-stone-50 border-stone-200" },
  { id: "bold",    label: "Bold",    preview: "bg-violet-900 border-violet-700" },
]

const ACCENT_PRESETS = [
  "#7c3aed", "#0891b2", "#059669", "#dc2626",
  "#d97706", "#db2777", "#2563eb", "#0d9488",
]

const CURRENCIES = ["INR", "USD", "EUR", "GBP"]
const PRICING_MODELS = [
  { id: "one-time",     label: "One-time",     desc: "Pay once, own forever" },
  { id: "subscription", label: "Subscription", desc: "Recurring billing" },
  { id: "both",         label: "Both",         desc: "Mix of one-time and recurring" },
]
const PAYMENT_PROVIDERS = [
  { id: "razorpay", label: "Razorpay", desc: "Best for INR — UPI, cards, net banking" },
  { id: "stripe",   label: "Stripe",   desc: "Best for USD/EUR — global cards" },
  { id: "paypal",   label: "PayPal",   desc: "PayPal wallet + cards" },
]
const FULFILLMENT_OPTIONS = [
  { id: "manual",     label: "Manual",     desc: "You handle delivery yourself" },
  { id: "shiprocket", label: "Shiprocket", desc: "Auto-dispatch via Shiprocket" },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtPrice = (price: number, currency: string) => {
  const sym = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"
  return `${sym}${(price / 100).toLocaleString("en-IN")}`
}

// ─── Sub-panels ──────────────────────────────────────────────────────────────

function FieldRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = "text", readOnly }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; readOnly?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm disabled:opacity-50"
      style={{ cursor: readOnly ? "default" : undefined }}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm resize-none"
    />
  )
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab({ draft, setDraft }: { draft: Partial<Seller>; setDraft: (u: Partial<Seller>) => void }) {
  const u = (k: keyof Seller) => (v: string) => setDraft({ ...draft, [k]: v })
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Store name" hint="Shown on your public storefront">
          <Input value={draft.store_name ?? ""} onChange={u("store_name")} placeholder="e.g. Priya's Design Studio" />
        </FieldRow>
        <FieldRow label="Your name" hint="Creator name shown on products">
          <Input value={draft.name ?? ""} onChange={u("name")} placeholder="e.g. Priya Sharma" />
        </FieldRow>
      </div>
      <FieldRow label="Tagline" hint="One-liner under your store name">
        <Input value={draft.store_tagline ?? ""} onChange={u("store_tagline")} placeholder="e.g. Premium templates for modern creators" />
      </FieldRow>
      <FieldRow label="Bio" hint="Longer description shown on your store page">
        <Textarea value={draft.bio ?? ""} onChange={u("bio")} placeholder="Tell your story — why you create, what you sell, who you help…" rows={4} />
      </FieldRow>
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Logo URL" hint="Square image, min 200×200px">
          <div className="flex gap-2 items-center">
            {draft.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.logo_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
            )}
            <Input value={draft.logo_url ?? ""} onChange={u("logo_url")} placeholder="https://…/logo.png" type="url" />
          </div>
        </FieldRow>
        <FieldRow label="Banner URL" hint="Landscape image, min 1200×400px">
          <Input value={draft.banner_url ?? ""} onChange={u("banner_url")} placeholder="https://…/banner.jpg" type="url" />
        </FieldRow>
      </div>
      <FieldRow label="Store URL" hint="Your public store link — contact support to change">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <Globe size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-400">brandingos.com/</span>
          <span className="text-sm text-slate-700 font-medium">{draft.slug}</span>
          <Link href={`/store/${draft.slug}`} target="_blank" className="ml-auto text-violet-500 hover:text-violet-700">
            <ExternalLink size={13} />
          </Link>
        </div>
      </FieldRow>
    </div>
  )
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

function AppearanceTab({ draft, setDraft }: { draft: Partial<Seller>; setDraft: (u: Partial<Seller>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Store theme</p>
        <div className="grid grid-cols-4 gap-3">
          {THEMES.map(t => (
            <button key={t.id} type="button" onClick={() => setDraft({ ...draft, store_theme: t.id })}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
              style={{ borderColor: draft.store_theme === t.id ? "#7c3aed" : "#E5E7EB", background: draft.store_theme === t.id ? "#F5F3FF" : "#fff" }}>
              <div className={`w-full h-10 rounded-lg border ${t.preview}`} />
              <span className={`text-xs font-semibold ${draft.store_theme === t.id ? "text-violet-700" : "text-slate-500"}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Accent color</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {ACCENT_PRESETS.map(c => (
            <button key={c} type="button" onClick={() => setDraft({ ...draft, accent_color: c })}
              className="w-9 h-9 rounded-xl border-2 transition-all"
              style={{ background: c, borderColor: draft.accent_color === c ? "#1e293b" : "transparent", transform: draft.accent_color === c ? "scale(1.15)" : "scale(1)" }}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={draft.accent_color ?? "#7c3aed"}
              onChange={e => setDraft({ ...draft, accent_color: e.target.value })}
              className="w-9 h-9 rounded-xl border-2 border-slate-200 cursor-pointer overflow-hidden opacity-0 absolute inset-0"
            />
            <div className="w-9 h-9 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center pointer-events-none"
              style={{ background: ACCENT_PRESETS.includes(draft.accent_color ?? "") ? undefined : draft.accent_color }}>
              <span className="text-xs text-slate-400 font-bold">+</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div className="w-8 h-8 rounded-lg" style={{ background: draft.accent_color }} />
          <div>
            <p className="text-sm font-semibold text-slate-700">Preview</p>
            <p className="text-xs text-slate-400">{draft.accent_color}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg text-white font-semibold" style={{ background: draft.accent_color }}>
              Buy now
            </button>
            <span className="text-xs font-semibold" style={{ color: draft.accent_color }}>Learn more →</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Commerce Tab ─────────────────────────────────────────────────────────────

function CommerceTab({ draft, setDraft }: { draft: Partial<Seller>; setDraft: (u: Partial<Seller>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">Default currency</p>
        <p className="text-xs text-slate-400 mb-3">Products you create will default to this currency</p>
        <div className="flex gap-2">
          {CURRENCIES.map(c => (
            <button key={c} type="button" onClick={() => setDraft({ ...draft, currency_code: c.toLowerCase() })}
              className="px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all"
              style={{
                borderColor: draft.currency_code?.toUpperCase() === c ? "#7c3aed" : "#E5E7EB",
                background: draft.currency_code?.toUpperCase() === c ? "#F5F3FF" : "#fff",
                color: draft.currency_code?.toUpperCase() === c ? "#7c3aed" : "#6B7280",
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Pricing model</p>
        <div className="space-y-2">
          {PRICING_MODELS.map(m => (
            <button key={m.id} type="button" onClick={() => setDraft({ ...draft, pricing_model: m.id })}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
              style={{ borderColor: draft.pricing_model === m.id ? "#7c3aed" : "#E5E7EB", background: draft.pricing_model === m.id ? "#F5F3FF" : "#fff" }}>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: draft.pricing_model === m.id ? "#7c3aed" : "#D1D5DB" }}>
                {draft.pricing_model === m.id && <div className="w-2 h-2 rounded-full bg-violet-600" />}
              </div>
              <div>
                <p className={`text-sm font-semibold ${draft.pricing_model === m.id ? "text-violet-700" : "text-slate-700"}`}>{m.label}</p>
                <p className="text-xs text-slate-400">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Payment provider</p>
        <div className="space-y-2">
          {PAYMENT_PROVIDERS.map(p => (
            <button key={p.id} type="button" onClick={() => setDraft({ ...draft, payment_provider: p.id })}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
              style={{ borderColor: draft.payment_provider === p.id ? "#7c3aed" : "#E5E7EB", background: draft.payment_provider === p.id ? "#F5F3FF" : "#fff" }}>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: draft.payment_provider === p.id ? "#7c3aed" : "#D1D5DB" }}>
                {draft.payment_provider === p.id && <div className="w-2 h-2 rounded-full bg-violet-600" />}
              </div>
              <div>
                <p className={`text-sm font-semibold ${draft.payment_provider === p.id ? "text-violet-700" : "text-slate-700"}`}>{p.label}</p>
                <p className="text-xs text-slate-400">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Fulfillment</p>
        <div className="space-y-2">
          {FULFILLMENT_OPTIONS.map(f => (
            <button key={f.id} type="button" onClick={() => setDraft({ ...draft, fulfillment_provider: f.id })}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
              style={{ borderColor: draft.fulfillment_provider === f.id ? "#7c3aed" : "#E5E7EB", background: draft.fulfillment_provider === f.id ? "#F5F3FF" : "#fff" }}>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: draft.fulfillment_provider === f.id ? "#7c3aed" : "#D1D5DB" }}>
                {draft.fulfillment_provider === f.id && <div className="w-2 h-2 rounded-full bg-violet-600" />}
              </div>
              <div>
                <p className={`text-sm font-semibold ${draft.fulfillment_provider === f.id ? "text-violet-700" : "text-slate-700"}`}>{f.label}</p>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/seller/products")
      .then(r => r.json())
      .then((d: { products: Product[] }) => setItems(d.products ?? []))
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "draft" : "active"
    setToggling(id)
    try {
      const res = await fetch(`/api/seller/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) setItems(prev => prev.map(p => p.id === id ? { ...p, status: next } : p))
    } finally {
      setToggling(null)
    }
  }

  const deleteProduct = async (id: string) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/seller/products/${id}`, { method: "DELETE" })
      if (res.ok) setItems(prev => prev.filter(p => p.id !== id))
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  if (loading) return (
    <div className="space-y-3 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">{items.length} product{items.length !== 1 ? "s" : ""}</p>
          <p className="text-xs text-slate-400">{items.filter(p => p.status === "active").length} published</p>
        </div>
        <Link href="/dashboard/store/product/new"
          className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-3 py-2 rounded-xl transition-colors">
          <Plus size={14} /> Add product
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Package size={32} className="mx-auto mb-3 text-slate-200" />
          <p className="text-sm font-medium">No products yet</p>
          <Link href="/dashboard/store/product/new" className="text-xs text-violet-500 hover:text-violet-700 mt-1 inline-block">
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 transition-colors">
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                {p.coverImageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.coverImageUrl} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                  : <Package size={16} className="text-slate-300" />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                  {p.type} · {fmtPrice(p.price, p.currency)}
                </p>
              </div>

              {/* Status badge */}
              <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 capitalize font-medium ${
                p.status === "active" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-amber-50 border-amber-200 text-amber-600"
              }`}>{p.status}</span>

              {/* Toggle */}
              <button onClick={() => toggleStatus(p.id, p.status)} disabled={toggling === p.id}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 shrink-0">
                {toggling === p.id
                  ? <Loader2 size={16} className="animate-spin" />
                  : p.status === "active" ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />
                }
              </button>

              {/* Delete */}
              {confirmDelete === p.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id}
                    className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
                    {deleting === p.id ? "…" : "Delete"}
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(p.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors shrink-0">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Catalog Tab ──────────────────────────────────────────────────────────────

const STORE_TYPES = [
  "Digital Products", "Coaching & Consulting", "Creative Services",
  "Online Courses", "Physical Goods", "Subscriptions", "Events & Workshops", "Other",
]

function CatalogTab({ draft, setDraft }: { draft: Partial<Seller>; setDraft: (u: Partial<Seller>) => void }) {
  const categories = (draft.categories ?? "").split(",").map(c => c.trim()).filter(Boolean)
  const [catInput, setCatInput] = useState("")

  const addCategory = (cat: string) => {
    const trimmed = cat.trim()
    if (!trimmed || categories.includes(trimmed)) return
    setDraft({ ...draft, categories: [...categories, trimmed].join(", ") })
    setCatInput("")
  }

  const removeCategory = (cat: string) => {
    setDraft({ ...draft, categories: categories.filter(c => c !== cat).join(", ") })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Store type</p>
        <div className="flex flex-wrap gap-2">
          {STORE_TYPES.map(t => (
            <button key={t} type="button" onClick={() => setDraft({ ...draft, store_type: t })}
              className="text-sm px-3 py-1.5 rounded-xl border transition-all"
              style={{
                borderColor: draft.store_type === t ? "#7c3aed" : "#E5E7EB",
                background: draft.store_type === t ? "#F5F3FF" : "#fff",
                color: draft.store_type === t ? "#7c3aed" : "#6B7280",
                fontWeight: draft.store_type === t ? 600 : 400,
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">Product categories / SKUs</p>
        <p className="text-xs text-slate-400 mb-3">Tags shown on your storefront to help buyers filter products</p>
        <div className="flex gap-2 mb-3">
          <input
            value={catInput}
            onChange={e => setCatInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCategory(catInput) } }}
            placeholder="e.g. Templates, Canva, Branding…"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm"
          />
          <button type="button" onClick={() => addCategory(catInput)}
            className="px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold text-sm rounded-xl border border-violet-200 transition-colors">
            Add
          </button>
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <span key={cat} className="flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full">
                <Tag size={11} /> {cat}
                <button onClick={() => removeCategory(cat)} className="text-violet-400 hover:text-violet-700 ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1">
          <Users size={14} className="text-slate-400" /> Target audience
        </label>
        <p className="text-xs text-slate-400 mb-3">Who are you selling to? This helps personalize your store copy.</p>
        <Textarea
          value={draft.audience ?? ""}
          onChange={v => setDraft({ ...draft, audience: v })}
          placeholder="e.g. Freelance graphic designers aged 20–35 who want to save time on client projects"
          rows={3}
        />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StoreSettingsPage() {
  const [seller, setSeller] = useState<Seller | null>(null)
  const [draft, setDraft] = useState<Partial<Seller>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("profile")

  useEffect(() => {
    fetch("/api/seller/me")
      .then(r => r.json())
      .then((d: { seller: Seller | null }) => {
        if (d.seller) {
          setSeller(d.seller)
          setDraft(d.seller)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const isDirty = useCallback(() => {
    if (!seller) return false
    return Object.keys(draft).some(k => draft[k as keyof Seller] !== seller[k as keyof Seller])
  }, [draft, seller])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/seller/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as { message?: string }).message ?? "Save failed")
      setSeller({ ...seller!, ...draft })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="px-8 py-8 animate-pulse">
      <div className="h-8 w-48 bg-slate-100 rounded-xl mb-4" />
      <div className="flex gap-2 mb-8">
        {[1,2,3,4,5].map(i => <div key={i} className="h-9 w-24 bg-slate-100 rounded-xl" />)}
      </div>
      <div className="h-64 bg-slate-100 rounded-2xl" />
    </div>
  )

  if (!seller) return (
    <div className="px-8 py-8 text-center">
      <AlertTriangle size={32} className="mx-auto text-amber-400 mb-3" />
      <p className="text-slate-600 font-medium">No store found</p>
      <Link href="/dashboard/store/new" className="text-sm text-violet-600 hover:underline mt-1 block">Set up your store →</Link>
    </div>
  )

  return (
    <div className="px-8 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/store" className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}>
            Store Settings
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{seller.store_name}</p>
        </div>

        {/* Save button */}
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <CheckCircle2 size={15} /> Saved
            </motion.div>
          ) : (
            <motion.button key="save" onClick={save} disabled={saving || !isDirty()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: isDirty() ? "0 4px 16px rgba(124,58,237,0.3)" : "none" }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving…" : "Save changes"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle size={15} /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? "#fff" : "transparent",
              color: activeTab === tab.id ? "#7c3aed" : "#64748b",
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>
            <tab.Icon size={13} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }} className="card p-6">
          {activeTab === "profile"    && <ProfileTab    draft={draft} setDraft={setDraft} />}
          {activeTab === "appearance" && <AppearanceTab draft={draft} setDraft={setDraft} />}
          {activeTab === "commerce"   && <CommerceTab   draft={draft} setDraft={setDraft} />}
          {activeTab === "products"   && <ProductsTab />}
          {activeTab === "catalog"    && <CatalogTab    draft={draft} setDraft={setDraft} />}
        </motion.div>
      </AnimatePresence>

      {/* Floating save hint when dirty */}
      <AnimatePresence>
        {isDirty() && activeTab !== "products" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50">
            <span>You have unsaved changes</span>
            <button onClick={save} disabled={saving}
              className="text-violet-300 hover:text-white font-semibold flex items-center gap-1 transition-colors">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              Save now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pb-24" />
    </div>
  )
}
