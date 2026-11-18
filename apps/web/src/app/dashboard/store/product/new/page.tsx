"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Loader2, Package, Zap, Shirt, ImagePlus, Tag,
  IndianRupee, FileText, ToggleLeft, CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"
import { FadeUp } from "@/components/ui/animations"

type ProductType = "digital" | "physical"
type ProductStatus = "draft" | "active"

const CURRENCIES = ["INR", "USD", "EUR", "GBP"]

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState("")
  const [type, setType] = useState<ProductType>("digital")
  const [price, setPrice] = useState("")
  const [compareAtPrice, setCompareAtPrice] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [description, setDescription] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [status, setStatus] = useState<ProductStatus>("draft")

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"

  const handleSubmit = async (e: React.FormEvent, launchStatus?: ProductStatus) => {
    e.preventDefault()
    if (!title.trim() || !price) return
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, type, price: Number(price), currency,
          description: description || undefined,
          status: launchStatus ?? status,
          coverImageUrl: coverImageUrl || undefined,
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
          stockQuantity: stockQuantity ? Number(stockQuantity) : undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { message?: string }).message ?? "Failed to create product")
      }
      setSuccess(true)
      setTimeout(() => router.push("/dashboard/store"), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <p className="text-lg font-semibold text-slate-900">Product created!</p>
          <p className="text-sm text-slate-400">Redirecting to your store…</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="px-8 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/store" className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}>
            New Product
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Add a product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FadeUp>
          <div className="space-y-5">

            {/* Type toggle */}
            <div className="card p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">Product type</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: "digital",  label: "Digital",  desc: "File, link, or access",  Icon: Zap  },
                  { id: "physical", label: "Physical", desc: "Shipped to customer",     Icon: Shirt },
                ] as const).map(({ id, label, desc, Icon }) => (
                  <button key={id} type="button" onClick={() => setType(id)}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
                    style={{ borderColor: type === id ? "#7c3aed" : "#E5E7EB", background: type === id ? "#F5F3FF" : "#fff" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: type === id ? "#EDE9FE" : "#F3F4F6" }}>
                      <Icon size={18} className={type === id ? "text-violet-600" : "text-slate-400"} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${type === id ? "text-violet-700" : "text-slate-700"}`}>{label}</p>
                      <p className="text-xs text-slate-400">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="card p-5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <Package size={15} className="text-slate-400" /> Product name <span className="text-red-400">*</span>
              </label>
              <input
                autoFocus required value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Ultimate Canva Template Pack, 1-on-1 Coaching Call…"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm"
              />
            </div>

            {/* Description */}
            <div className="card p-5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <FileText size={15} className="text-slate-400" /> Description
              </label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)} rows={4}
                placeholder="What does this product include? What transformation or value does it deliver?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm resize-none"
              />
            </div>

            {/* Pricing */}
            <div className="card p-5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <IndianRupee size={15} className="text-slate-400" /> Pricing <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3 mb-3">
                {/* Currency */}
                <div className="flex gap-1.5">
                  {CURRENCIES.map(c => (
                    <button key={c} type="button" onClick={() => setCurrency(c)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg border transition-all"
                      style={{ borderColor: currency === c ? "#7c3aed" : "#E5E7EB", background: currency === c ? "#F5F3FF" : "#fff", color: currency === c ? "#7c3aed" : "#6B7280" }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Price <span className="text-red-400">*</span></p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">{currencySymbol}</span>
                    <input
                      required type="number" min="0" step="0.01" value={price}
                      onChange={e => setPrice(e.target.value)} placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-slate-900 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Compare-at price <span className="text-slate-300">(optional)</span></p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">{currencySymbol}</span>
                    <input
                      type="number" min="0" step="0.01" value={compareAtPrice}
                      onChange={e => setCompareAtPrice(e.target.value)} placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-slate-900 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Shown as strikethrough to show discount</p>
                </div>
              </div>
            </div>

            {/* Cover image */}
            <div className="card p-5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <ImagePlus size={15} className="text-slate-400" /> Cover image URL <span className="text-slate-300 font-normal">(optional)</span>
              </label>
              <input
                type="url" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="https://your-image-url.com/cover.jpg"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm"
              />
              {coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImageUrl} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-xl border border-slate-200" onError={e => (e.currentTarget.style.display = "none")} />
              )}
            </div>

            {/* Stock (physical only) */}
            {type === "physical" && (
              <div className="card p-5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                  <Tag size={15} className="text-slate-400" /> Stock quantity <span className="text-slate-300 font-normal">(leave blank for unlimited)</span>
                </label>
                <input
                  type="number" min="0" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-colors text-sm"
                />
              </div>
            )}

            {/* Status */}
            <div className="card p-5">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <ToggleLeft size={15} className="text-slate-400" /> Visibility
              </p>
              <div className="flex gap-3">
                {([
                  { id: "draft",  label: "Save as draft",  desc: "Not visible in store yet" },
                  { id: "active", label: "Publish now",    desc: "Live in your store immediately" },
                ] as const).map(({ id, label, desc }) => (
                  <button key={id} type="button" onClick={() => setStatus(id)}
                    className="flex-1 p-3 rounded-xl border-2 text-left transition-all"
                    style={{ borderColor: status === id ? "#7c3aed" : "#E5E7EB", background: status === id ? "#F5F3FF" : "#fff" }}>
                    <p className={`text-sm font-semibold ${status === id ? "text-violet-700" : "text-slate-700"}`}>{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 pb-8">
              <Link href="/dashboard/store" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                Cancel
              </Link>
              <button
                type="submit" disabled={saving || !title.trim() || !price}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                {saving ? "Saving…" : status === "active" ? "Create & Publish" : "Save Draft"}
              </button>
            </div>

          </div>
        </FadeUp>
      </form>
    </div>
  )
}
