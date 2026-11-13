"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Package, TrendingUp, ShoppingBag, Download, IndianRupee, MoreHorizontal, ArrowUpRight } from "lucide-react"
import { FadeUp, staggerContainer, staggerItem } from "@/components/ui/animations"

const PRODUCTS = [
  {
    id: "1",
    title: "UI Design System — Figma Kit",
    type: "digital",
    price: 1999,
    sales: 47,
    revenue: 93953,
    status: "active",
    change: "+12%",
    gradient: "from-violet-100 to-pink-100",
    iconColor: "text-violet-500",
  },
  {
    id: "2",
    title: "Brand Identity Template Pack",
    type: "digital",
    price: 2999,
    sales: 23,
    revenue: 68977,
    status: "active",
    change: "+8%",
    gradient: "from-blue-100 to-cyan-100",
    iconColor: "text-blue-500",
  },
  {
    id: "3",
    title: "Portfolio Review — 1 Hour Call",
    type: "service",
    price: 4999,
    sales: 8,
    revenue: 39992,
    status: "active",
    change: "+3%",
    gradient: "from-emerald-100 to-teal-100",
    iconColor: "text-emerald-500",
  },
]

const totalRevenue = PRODUCTS.reduce((s, p) => s + p.revenue, 0)
const totalSales   = PRODUCTS.reduce((s, p) => s + p.sales, 0)

const REVENUE_BARS = [30, 55, 40, 70, 50, 80, 45, 65, 75, 90, 55, 85]

export default function StorePage() {
  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Creator Store</h1>
          <p className="text-slate-400 text-sm mt-1">Sell digital products and services globally</p>
        </div>
        <Link href="/dashboard/store/new" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm shadow-md shadow-violet-200">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Revenue",
              value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`,
              icon: IndianRupee,
              iconClass: "bg-emerald-50 text-emerald-600",
              change: "+34%",
              sub: "vs last month",
              accentColor: "#059669",
            },
            {
              label: "Total Sales",
              value: totalSales.toString(),
              icon: ShoppingBag,
              iconClass: "bg-violet-50 text-violet-600",
              change: "+18%",
              sub: "vs last month",
              accentColor: "#7c3aed",
            },
            {
              label: "Products Live",
              value: PRODUCTS.length.toString(),
              icon: Package,
              iconClass: "bg-cyan-50 text-cyan-600",
              change: "Active",
              sub: "all selling",
              accentColor: "#0891b2",
            },
          ].map((s) => (
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

              {/* Mini bar chart */}
              <div className="flex items-end gap-0.5 h-6 mt-3">
                {REVENUE_BARS.slice(0, 8).map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{ height: `${h}%`, backgroundColor: `${s.accentColor}35` }}
                  />
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
            <p className="text-xs text-slate-400 mt-0.5">{PRODUCTS.length} items · all active</p>
          </div>
          <span className="badge badge-green text-[10px]">
            All selling
          </span>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          {PRODUCTS.map((p, idx) => (
            <motion.div
              key={p.id}
              variants={staggerItem}
              className="px-6 py-4 border-b border-slate-50 last:border-0 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group"
            >
              {/* Rank */}
              <div className="w-6 text-xs font-bold text-slate-200 shrink-0 text-center">{idx + 1}</div>

              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0`}>
                <Download size={16} className={p.iconColor} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{p.type} · ₹{p.price.toLocaleString("en-IN")}</p>
              </div>

              {/* Revenue sparkline */}
              <div className="w-16 h-7 hidden md:block">
                <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-full">
                  <polyline
                    points="0,55 14,45 28,50 42,30 57,20 71,25 85,15 100,8"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Revenue */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-emerald-600">₹{(p.revenue / 100).toLocaleString("en-IN")}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.sales} sales</p>
              </div>

              {/* Change badge */}
              <span className="stat-up text-xs flex items-center gap-0.5 shrink-0">
                <ArrowUpRight size={10} /> {p.change}
              </span>

              {/* Status */}
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0 capitalize">
                {p.status}
              </span>

              <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all">
                <MoreHorizontal size={15} className="text-slate-400" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Payout info */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
          <TrendingUp size={20} className="text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-emerald-900">Next payout: ₹2,02,922</p>
          <p className="text-xs text-emerald-700/60 mt-0.5">Auto-deposited to your bank account on the 1st via Razorpay</p>
        </div>
        <button className="text-sm text-emerald-700 hover:text-emerald-900 transition-colors font-semibold flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
          View payouts <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  )
}
