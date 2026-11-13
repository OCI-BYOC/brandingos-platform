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
    iconClass: "from-violet-100 to-pink-100",
  },
  {
    id: "2",
    title: "Brand Identity Template Pack",
    type: "digital",
    price: 2999,
    sales: 23,
    revenue: 68977,
    status: "active",
    iconClass: "from-blue-100 to-cyan-100",
  },
  {
    id: "3",
    title: "Portfolio Review — 1 Hour Call",
    type: "service",
    price: 4999,
    sales: 8,
    revenue: 39992,
    status: "active",
    iconClass: "from-emerald-100 to-teal-100",
  },
]

const totalRevenue = PRODUCTS.reduce((s, p) => s + p.revenue, 0)
const totalSales   = PRODUCTS.reduce((s, p) => s + p.sales, 0)

export default function StorePage() {
  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Creator Store</h1>
          <p className="text-slate-400 text-sm mt-1">Sell digital products and services globally</p>
        </div>
        <Link href="/dashboard/store/new" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`, icon: IndianRupee, iconClass: "bg-emerald-50 text-emerald-600" },
            { label: "Total Sales",   value: totalSales.toString(),                              icon: ShoppingBag, iconClass: "bg-violet-50 text-violet-600" },
            { label: "Products Live", value: PRODUCTS.length.toString(),                         icon: Package,     iconClass: "bg-cyan-50 text-cyan-600"    },
          ].map((s) => (
            <div key={s.label} className="card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconClass}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Products table */}
      <ShimmerCard className="overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-slate-900">Products</h2>
          <span className="text-xs text-slate-400">{PRODUCTS.length} items</span>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          {PRODUCTS.map((p) => (
            <motion.div
              key={p.id}
              variants={staggerItem}
              className="px-6 py-4 border-b border-slate-50 last:border-0 flex items-center gap-4 hover:bg-slate-50 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.iconClass} flex items-center justify-center shrink-0`}>
                <Download size={16} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{p.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{p.type} · ₹{p.price}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-emerald-600">₹{(p.revenue / 100).toLocaleString("en-IN")}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.sales} sales</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                {p.status}
              </span>
              <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all">
                <MoreHorizontal size={15} className="text-slate-400" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </ShimmerCard>

      {/* Payout info */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <TrendingUp size={18} className="text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">Next payout: ₹2,02,922</p>
          <p className="text-xs text-slate-400 mt-0.5">Auto-deposited to your bank account on the 1st via Razorpay</p>
        </div>
        <button className="text-sm text-violet-600 hover:text-violet-700 transition-colors font-medium">View payouts →</button>
      </div>
    </div>
  )
}
