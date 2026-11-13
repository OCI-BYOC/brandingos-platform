"use client"

import { motion } from "framer-motion"
import { TrendingUp, Eye, Users, IndianRupee, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ShimmerCard, FadeUp, GradientText } from "@/components/ui/animations"

// ─── Dummy chart data ─────────────────────────────────────────────────────────
const VIEWS_DATA = [820, 940, 760, 1100, 1340, 980, 1247, 1420, 1180, 1560, 1340, 1680, 1247, 1890]
const REV_DATA   = [0, 1999, 0, 4998, 2999, 0, 7997, 1999, 4998, 9996, 2999, 14994, 1999, 7997]

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100 / (data.length - 1)
  const points = data.map((v, i) => `${i * w},${100 - ((v - min) / range) * 90}`).join(" ")
  return (
    <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" className="w-full h-14">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,100 ${points} 100,100`} fill={`${color}18`} stroke="none" />
    </svg>
  )
}

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data) || 1
  return (
    <div className="flex items-end gap-1 h-14 w-full">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
          style={{ height: `${(v / max) * 100}%`, background: v > 0 ? `${color}70` : "transparent", borderRadius: "2px 2px 0 0" }}
        />
      ))}
    </div>
  )
}

const STATS = [
  { label: "Portfolio Views",    value: "1,247",   change: "+18%", up: true,  icon: Eye,          color: "#7c3aed" },
  { label: "Unique Visitors",    value: "843",      change: "+12%", up: true,  icon: Users,        color: "#06b6d4" },
  { label: "Revenue (30d)",      value: "₹47,983", change: "+34%", up: true,  icon: IndianRupee,  color: "#10b981" },
  { label: "Conversion Rate",    value: "2.4%",     change: "-0.3%", up: false, icon: TrendingUp,   color: "#f59e0b" },
]

const TOP_PAGES = [
  { path: "/alex-chen",           views: 743, pct: 60 },
  { path: "/alex-chen/store",     views: 312, pct: 25 },
  { path: "/alex-chen/courses",   views: 124, pct: 10 },
  { path: "/alex-chen/contact",   views:  68, pct: 5  },
]

const TOP_SOURCES = [
  { source: "Direct",             visits: 480, pct: 55 },
  { source: "LinkedIn",           visits: 210, pct: 24 },
  { source: "Twitter / X",        visits:  98, pct: 11 },
  { source: "Google Search",      visits:  88, pct: 10 },
]

export default function AnalyticsPage() {
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Last 30 days · All portfolios</p>
      </div>

      {/* KPI cards */}
      <FadeUp>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon size={16} style={{ color: s.color }} />
                <span className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                  {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{s.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{s.value}</p>
              <p className="text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <ShimmerCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm">Portfolio Views</h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1"><ArrowUpRight size={12} />+18% vs last month</span>
          </div>
          <SparkLine data={VIEWS_DATA} color="#7c3aed" />
          <div className="flex justify-between text-xs text-white/30 mt-2">
            <span>14 days ago</span><span>Today</span>
          </div>
        </ShimmerCard>

        <ShimmerCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm">Revenue</h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1"><ArrowUpRight size={12} />+34% vs last month</span>
          </div>
          <BarChart data={REV_DATA} color="#10b981" />
          <div className="flex justify-between text-xs text-white/30 mt-2">
            <span>14 days ago</span><span>Today</span>
          </div>
        </ShimmerCard>
      </div>

      {/* Tables row */}
      <div className="grid md:grid-cols-2 gap-5">
        <ShimmerCard className="overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="font-semibold text-sm">Top Pages</h3>
          </div>
          {TOP_PAGES.map((p) => (
            <div key={p.path} className="px-6 py-3 border-b border-white/[0.03] last:border-0 flex items-center gap-4">
              <Globe size={14} className="text-white/30 shrink-0" />
              <span className="text-sm font-mono text-white/70 flex-1 truncate">{p.path}</span>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${p.pct}%` }} />
                </div>
                <span className="text-xs text-white/40 w-8 text-right">{p.views}</span>
              </div>
            </div>
          ))}
        </ShimmerCard>

        <ShimmerCard className="overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="font-semibold text-sm">Traffic Sources</h3>
          </div>
          {TOP_SOURCES.map((s) => (
            <div key={s.source} className="px-6 py-3 border-b border-white/[0.03] last:border-0 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-sm text-white/70 flex-1">{s.source}</span>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-xs text-white/40 w-8 text-right">{s.visits}</span>
              </div>
            </div>
          ))}
        </ShimmerCard>
      </div>
    </div>
  )
}
