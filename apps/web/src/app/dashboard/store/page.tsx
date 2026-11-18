"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {
  Plus, Package, TrendingUp, ShoppingBag, Download, IndianRupee,
  MoreHorizontal, ArrowUpRight, Store, Sparkles, Zap, Star, Settings2,
} from "lucide-react"
import { FadeUp, staggerContainer, staggerItem } from "@/components/ui/animations"

type DashboardProduct = {
  id: string
  title: string
  type: string
  price: number
  currency: string
  status: string
  coverImageUrl: string | null
  createdAt: string | Date | null
}

const REVENUE_BARS = [30, 55, 40, 70, 50, 80, 45, 65, 75, 90, 55, 85]

const PRODUCT_GRADIENTS = [
  { gradient: "from-violet-100 to-pink-100",   iconColor: "text-violet-500" },
  { gradient: "from-blue-100 to-cyan-100",      iconColor: "text-blue-500"   },
  { gradient: "from-emerald-100 to-teal-100",   iconColor: "text-emerald-500"},
  { gradient: "from-rose-100 to-orange-100",    iconColor: "text-rose-500"   },
  { gradient: "from-amber-100 to-yellow-100",   iconColor: "text-amber-500"  },
]

// ─── Empty state ──────────────────────────────────────────────────────────────

function StoreEmptyState() {
  const FEATURES = [
    { icon: "⚡", label: "Instant setup",        description: "Live in under 5 minutes" },
    { icon: "🌍", label: "Global payments",       description: "Razorpay, Stripe & more" },
    { icon: "📦", label: "Digital + services",    description: "Files, calls, subscriptions" },
    { icon: "📊", label: "Built-in analytics",    description: "Track every rupee earned" },
  ]

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}>
            Creator Store
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sell digital products and services globally</p>
        </div>
      </div>

      {/* Hero empty state */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50/30 px-10 py-14 text-center mb-8"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 20px 60px rgba(124,58,237,0.04)" }}>

          {/* Decoration blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />

          {/* Icon */}
          <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200">
              <Store size={32} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}>
            Your store is one step away.
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed mb-8">
            Answer a few questions about what you sell, who you sell to, and how you want your store to look — we&apos;ll set everything up for you.
          </p>

          <Link
            href="/dashboard/store/new"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
            }}
          >
            <Zap size={16} /> Set up my store — it&apos;s free
          </Link>

          <p className="text-xs text-slate-400 mt-4">Takes about 3 minutes · No credit card needed</p>
        </div>
      </FadeUp>

      {/* Feature highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {FEATURES.map(f => (
          <div key={f.label} className="card p-5 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-sm font-semibold text-slate-800">{f.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{f.description}</p>
          </div>
        ))}
      </div>

      {/* Social proof strip */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-4">
        <div className="flex -space-x-2">
          {["from-violet-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-rose-400 to-pink-500", "from-amber-400 to-orange-500"].map((g, i) => (
            <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 border-white flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {["S", "A", "R", "P"][i]}
            </div>
          ))}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Join 2,400+ creators earning on BrandingOS</p>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
            <span className="text-xs text-slate-400 ml-1">4.9 / 5 from 310 reviews</span>
          </div>
        </div>
        <Link href="/dashboard/store/new" className="shrink-0 text-sm text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1">
          Get started <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  )
}

// ─── Active store view ────────────────────────────────────────────────────────

function ActiveStore({ products }: { products: DashboardProduct[] }) {
  const activeProducts = products.filter(p => p.status === "active")
  const productsLive   = activeProducts.length

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}>
            Creator Store
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sell digital products and services globally</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/store/settings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors">
            <Settings2 size={15} /> Settings
          </Link>
          <Link
            href="/dashboard/store/product/new"
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm shadow-md shadow-violet-200"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats — revenue/sales are ₹0 until orders are wired */}
      <FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: "₹0",                   icon: IndianRupee, iconClass: "bg-emerald-50 text-emerald-600", change: "—",      sub: "orders coming soon", accentColor: "#059669" },
            { label: "Total Sales",   value: "0",                    icon: ShoppingBag, iconClass: "bg-violet-50 text-violet-600",  change: "—",      sub: "orders coming soon", accentColor: "#7c3aed" },
            { label: "Products Live", value: productsLive.toString(), icon: Package,     iconClass: "bg-violet-50 text-violet-600", change: "Active", sub: "in your store",      accentColor: "#7c3aed" },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconClass}`}>
                  <s.icon size={18} />
                </div>
                <span className="stat-up text-xs font-semibold flex items-center gap-0.5">
                  <ArrowUpRight size={10} /> {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label} · <span className="text-slate-300">{s.sub}</span></p>
              <div className="flex items-end gap-0.5 h-6 mt-3">
                {REVENUE_BARS.slice(0, 8).map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: `${s.accentColor}35` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Products table */}
      <div className="card overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Products</h2>
            <p className="text-xs text-slate-400 mt-0.5">{products.length} item{products.length !== 1 ? "s" : ""}</p>
          </div>
          {productsLive > 0 && <span className="badge badge-green text-[10px]">{productsLive} live</span>}
        </div>

        {products.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            <Package size={32} className="mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-medium">No products yet.</p>
            <p className="text-xs mt-1">Add your first product to start selling.</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            {products.map((p, idx) => {
              const style = PRODUCT_GRADIENTS[idx % PRODUCT_GRADIENTS.length]
              const statusColor =
                p.status === "active"   ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                p.status === "archived" ? "bg-slate-50 border-slate-200 text-slate-500"       :
                                          "bg-amber-50 border-amber-200 text-amber-600"
              return (
                <motion.div
                  key={p.id}
                  variants={staggerItem}
                  className="px-6 py-4 border-b border-slate-50 last:border-0 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="w-6 text-xs font-bold text-slate-200 shrink-0 text-center">{idx + 1}</div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shrink-0 overflow-hidden`}>
                    {p.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Download size={16} className={style.iconColor} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">
                      {p.type} · {p.currency === "INR" ? "₹" : "$"}{(p.price / 100).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border shrink-0 capitalize ${statusColor}`}>
                    {p.status}
                  </span>
                  <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all">
                    <MoreHorizontal size={15} className="text-slate-400" />
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Payout info */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
          <TrendingUp size={20} className="text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-emerald-900">Payouts coming soon</p>
          <p className="text-xs text-emerald-700/60 mt-0.5">Auto-deposited to your bank account on the 1st via Razorpay</p>
        </div>
        <button className="text-sm text-emerald-700 hover:text-emerald-900 transition-colors font-semibold flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
          View payouts <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StorePage() {
  const [hasStore, setHasStore] = useState<boolean | null>(null)
  const [storeProducts, setStoreProducts] = useState<DashboardProduct[]>([])

  useEffect(() => {
    // Fetch seller status and products in parallel
    Promise.all([
      fetch("/api/seller/me").then(r => r.json()).catch(() => ({ seller: null })),
      fetch("/api/seller/products").then(r => r.json()).catch(() => ({ products: [] })),
    ]).then(([sellerData, productsData]: [{ seller: { is_active?: boolean } | null }, { products: DashboardProduct[] }]) => {
      setHasStore(!!(sellerData.seller?.is_active))
      setStoreProducts(productsData.products ?? [])
    }).catch(() => setHasStore(false))
  }, [])

  // Loading skeleton — matches the card shape
  if (hasStore === null) {
    return (
      <div className="px-8 py-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded-xl mb-4" />
        <div className="h-4 w-72 bg-slate-100 rounded-lg mb-10" />
        <div className="h-64 bg-slate-100 rounded-3xl" />
      </div>
    )
  }

  return hasStore ? <ActiveStore products={storeProducts} /> : <StoreEmptyState />
}
