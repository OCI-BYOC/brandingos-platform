"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Package, TrendingUp, ShoppingBag, Download, IndianRupee, MoreHorizontal } from "lucide-react"
import { ShimmerCard, FadeUp, staggerContainer, staggerItem } from "@/components/ui/animations"

const PRODUCTS = [
  {
    id: "1",
    title: "UI Design System — Figma Kit",
    type: "digital",
    price: 1999,
    sales: 47,
    revenue: 93953,
    status: "active",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "2",
    title: "Brand Identity Template Pack",
    type: "digital",
    price: 2999,
    sales: 23,
    revenue: 68977,
    status: "active",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "3",
    title: "Portfolio Review — 1 Hour Call",
    type: "digital",
    price: 4999,
    sales: 8,
    revenue: 39992,
    status: "active",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
]

const totalRevenue = PRODUCTS.reduce((s, p) => s + p.revenue, 0)
const totalSales   = PRODUCTS.reduce((s, p) => s + p.sales, 0)

export default function StorePage() {
  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Creator Store</h1>
          <p className="text-white/40 text-sm mt-1">Sell digital products and services globally</p>
        </div>
        <Link href="/dashboard/store/new" className="btn-aurora flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-emerald-400" },
            { label: "Total Sales",   value: totalSales.toString(),                              icon: ShoppingBag, color: "text-purple-400" },
            { label: "Products Live", value: PRODUCTS.length.toString(),                         icon: Package,     color: "text-cyan-400"   },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-white/40">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Products table */}
      <ShimmerCard className="overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="font-semibold text-sm">Products</h2>
          <span className="text-xs text-white/40">{PRODUCTS.length} items</span>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          {PRODUCTS.map((p) => (
            <motion.div
              key={p.id}
              variants={staggerItem}
              className="px-6 py-4 border-b border-white/[0.04] last:border-0 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0`}>
                <Download size={16} className="text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <p className="text-xs text-white/40 mt-0.5 capitalize">{p.type} · ₹{p.price}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-emerald-400">₹{(p.revenue / 100).toLocaleString("en-IN")}</p>
                <p className="text-xs text-white/40 mt-0.5">{p.sales} sales</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {p.status}
              </span>
              <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all">
                <MoreHorizontal size={15} className="text-white/50" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </ShimmerCard>

      {/* Payout info */}
      <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
          <TrendingUp size={18} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Next payout: ₹2,02,922</p>
          <p className="text-xs text-white/40 mt-0.5">Auto-deposited to your bank account on the 1st via Razorpay</p>
        </div>
        <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">View payouts →</button>
      </div>
    </div>
  )
}
