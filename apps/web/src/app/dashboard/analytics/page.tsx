"use client"

import { motion } from "framer-motion"
import {
  TrendingUp, Eye, Users, IndianRupee, Globe,
  ArrowUpRight, ArrowDownRight, BarChart2, Activity,
} from "lucide-react"
import { FadeUp } from "@/components/ui/animations"

const VIEWS_DATA  = [820, 940, 760, 1100, 1340, 980, 1247, 1420, 1180, 1560, 1340, 1680, 1247, 1890]
const REV_DATA    = [0, 1999, 0, 4998, 2999, 0, 7997, 1999, 4998, 9996, 2999, 14994, 1999, 7997]
const DEVICE_DATA = [
  { label: "Mobile",  pct: 54, color: "#7c3aed" },
  { label: "Desktop", pct: 38, color: "#0891b2" },
  { label: "Tablet",  pct: 8,  color: "#059669" },
]

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100 / (data.length - 1)
  const points = data.map((v, i) => `${i * w},${100 - ((v - min) / range) * 90}`).join(" ")
  const id = `sl-${color.replace("#", "")}`
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-16">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill={`url(#${id})`} stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data) || 1
  return (
    <div className="flex items-end gap-0.5 h-16 w-full">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1"
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
          style={{
            height: `${(v / max) * 100}%`,
            background: v > 0 ? `${color}70` : "transparent",
            borderRadius: "3px 3px 0 0",
          }}
        />
      ))}
    </div>
  )
}

const STATS = [
  {
    label: "Portfolio Views",
    value: "1,247",
    change: "+18%",
    up: true,
    icon: Eye,
    color: "#7c3aed",
    iconBg: "bg-violet-50",
    sub: "vs last 30 days",
    data: [820, 940, 760, 1100, 1247],
  },
  {
    label: "Unique Visitors",
    value: "843",
    change: "+12%",
    up: true,
    icon: Users,
    color: "#0891b2",
    iconBg: "bg-cyan-50",
    sub: "vs last 30 days",
    data: [600, 710, 680, 800, 843],
  },
  {
    label: "Revenue (30d)",
    value: "₹47,983",
    change: "+34%",
    up: true,
    icon: IndianRupee,
    color: "#059669",
    iconBg: "bg-emerald-50",
    sub: "vs last 30 days",
    data: [20000, 30000, 25000, 40000, 47983],
  },
  {
    label: "Conversion Rate",
    value: "2.4%",
    change: "-0.3%",
    up: false,
    icon: TrendingUp,
    color: "#d97706",
    iconBg: "bg-amber-50",
    sub: "vs last 30 days",
    data: [3.1, 2.8, 2.9, 2.7, 2.4],
  },
]

const TOP_PAGES = [
  { path: "/alex-chen",         views: 743, pct: 60 },
  { path: "/alex-chen/store",   views: 312, pct: 25 },
  { path: "/alex-chen/courses", views: 124, pct: 10 },
  { path: "/alex-chen/contact", views:  68, pct: 5  },
]

const TOP_SOURCES = [
  { source: "Direct",        visits: 480, pct: 55, color: "#7c3aed" },
  { source: "LinkedIn",      visits: 210, pct: 24, color: "#0891b2" },
  { source: "Twitter / X",   visits:  98, pct: 11, color: "#d97706" },
  { source: "Google Search", visits:  88, pct: 10, color: "#059669" },
]

export default function AnalyticsPage() {
  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Last 30 days · All portfolios</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600">
          <Activity size={14} className="text-violet-500" />
          <span className="font-medium">Live</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>
      </div>

      {/* KPI cards */}
      <FadeUp>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? "stat-up" : "stat-down"}`}>
                  {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-400 mb-3">{s.label}</p>
              {/* Mini sparkline */}
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-7">
                {(() => {
                  const max = Math.max(...s.data)
                  const min = Math.min(...s.data)
                  const r = max - min || 1
                  const w = 100 / (s.data.length - 1)
                  const pts = s.data.map((v, i) => `${i * w},${48 - ((v - min) / r) * 44}`).join(" ")
                  return (
                    <>
                      <defs>
                        <linearGradient id={`kg${s.color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
                          <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polyline points={`0,50 ${pts} 100,50`} fill={`url(#kg${s.color.replace("#","")})`} stroke="none" />
                      <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  )
                })()}
              </svg>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900">Portfolio Views</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 14 days</p>
            </div>
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={11} />+18% vs last month
            </span>
          </div>
          <SparkLine data={VIEWS_DATA} color="#7c3aed" />
          <div className="flex justify-between text-xs text-slate-300 mt-2">
            <span>14 days ago</span><span>Today</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 14 days</p>
            </div>
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={11} />+34% vs last month
            </span>
          </div>
          <BarChart data={REV_DATA} color="#059669" />
          <div className="flex justify-between text-xs text-slate-300 mt-2">
            <span>14 days ago</span><span>Today</span>
          </div>
        </div>
      </div>

      {/* Tables + Device split */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Globe size={14} className="text-slate-400" />
            <h3 className="font-semibold text-sm text-slate-900">Top Pages</h3>
          </div>
          {TOP_PAGES.map((p) => (
            <div key={p.path} className="px-5 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs font-mono text-slate-600 flex-1 truncate">{p.path}</span>
                <span className="text-xs font-semibold text-slate-700 shrink-0">{p.views}</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-violet-400 transition-all" style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BarChart2 size={14} className="text-slate-400" />
            <h3 className="font-semibold text-sm text-slate-900">Traffic Sources</h3>
          </div>
          {TOP_SOURCES.map((s) => (
            <div key={s.source} className="px-5 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-sm text-slate-600 flex-1">{s.source}</span>
                <span className="text-xs font-semibold text-slate-700 shrink-0">{s.visits}</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Device breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-slate-900 mb-5">Device Breakdown</h3>
          {/* Donut chart SVG */}
          <div className="flex justify-center mb-5">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {(() => {
                let offset = 0
                return DEVICE_DATA.map((d) => {
                  const circumference = 2 * Math.PI * 38
                  const dash = (d.pct / 100) * circumference
                  const gap  = circumference - dash
                  const el = (
                    <circle
                      key={d.label}
                      cx="50" cy="50" r="38"
                      fill="none"
                      stroke={d.color}
                      strokeWidth="12"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="butt"
                      transform="rotate(-90 50 50)"
                    />
                  )
                  offset += dash
                  return el
                })
              })()}
              <text x="50" y="47" textAnchor="middle" className="text-xs" style={{ fontSize: "10px", fill: "#0f172a", fontWeight: 700 }}>843</text>
              <text x="50" y="58" textAnchor="middle" style={{ fontSize: "7px", fill: "#64748b" }}>visitors</text>
            </svg>
          </div>
          <div className="space-y-3">
            {DEVICE_DATA.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                <span className="text-sm text-slate-600 flex-1">{d.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8 text-right">{d.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
