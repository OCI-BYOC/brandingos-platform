"use client"

import { motion } from "framer-motion"
import {
  FileText, Briefcase, ShoppingBag, Zap, Star, Eye,
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity,
  Package, BookOpen, CheckCircle2, Circle,
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  imageUrl: string
  tier: "free" | "pro" | "growth" | "brand"
  aiCredits: number
  aiCreditsTotal: number
  portfolioCount: number
  viewsLast30d: number
  recentEvents: Array<{ id: string; eventType: string; path: string | null; occurredAt: Date }>
}

interface Props {
  user: User
}

/* ─── Mini sparkline ────────────────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100 / (data.length - 1)
  const pts = data.map((v, i) => `${i * w},${40 - ((v - min) / range) * 36}`).join(" ")
  const fill = `0,42 ${pts} 100,42`
  return (
    <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="w-full h-10">
      <defs>
        <linearGradient id={`sg${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={fill} fill={`url(#sg${color.replace("#", "")})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Revenue area chart ─────────────────────────────────────────────────── */
function RevenueChart({ data }: { data: number[] }) {
  const max = Math.max(...data) || 1
  const w = 100 / (data.length - 1)
  const pts = data.map((v, i) => `${i * w},${80 - (v / max) * 70}`).join(" ")
  return (
    <svg viewBox="0 0 100 82" preserveAspectRatio="none" className="w-full h-20">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,82 ${pts} 100,82`} fill="url(#revGrad)" stroke="none" />
      <polyline points={pts} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {data.length > 0 && (() => {
        const lastX = (data.length - 1) * w
        const lastY = 80 - (data[data.length - 1] / max) * 70
        return <circle cx={lastX} cy={lastY} r="3" fill="#7c3aed" />
      })()}
    </svg>
  )
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { icon: FileText,    label: "New Content",   href: "/dashboard/content/new",   color: "bg-violet-50 text-violet-600 group-hover:bg-violet-100", border: "group-hover:border-violet-200" },
  { icon: Briefcase,   label: "New Portfolio", href: "/dashboard/portfolio/new", color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",  border: "group-hover:border-indigo-200" },
  { icon: ShoppingBag, label: "Add Product",   href: "/dashboard/store/new",     color: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100",        border: "group-hover:border-cyan-200" },
  { icon: Zap,         label: "AI Generate",   href: "/dashboard/content/ai",    color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",     border: "group-hover:border-amber-200" },
  { icon: Star,        label: "Upgrade Plan",  href: "/dashboard/billing",       color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100",        border: "group-hover:border-pink-200" },
  { icon: Eye,         label: "View Public",   href: "/",                        color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100", border: "group-hover:border-emerald-200" },
]

const REVENUE_DATA = [4000, 6500, 5200, 8800, 7400, 11000, 9500, 14200, 12000, 16800, 14500, 19600]
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const ACTIVITY_EVENTS = [
  { icon: Eye,         label: "Portfolio view",        sub: "alex-chen.brandingos.in",  time: "2m ago",  color: "bg-violet-50 text-violet-500" },
  { icon: ShoppingBag, label: "New sale",              sub: "UI Design System · ₹1,999", time: "18m ago", color: "bg-emerald-50 text-emerald-500" },
  { icon: BookOpen,    label: "Course enrollment",     sub: "UI/UX Masterclass 2025",   time: "1h ago",  color: "bg-cyan-50 text-cyan-500" },
  { icon: Eye,         label: "Portfolio view",        sub: "alex-chen.brandingos.in",  time: "2h ago",  color: "bg-violet-50 text-violet-500" },
  { icon: Zap,         label: "AI content generated",  sub: "Bio + skills section",     time: "3h ago",  color: "bg-amber-50 text-amber-500" },
  { icon: ShoppingBag, label: "New sale",              sub: "Brand Template · ₹2,999",  time: "5h ago",  color: "bg-emerald-50 text-emerald-500" },
  { icon: TrendingUp,  label: "Weekly report ready",   sub: "34% growth vs last week",  time: "1d ago",  color: "bg-indigo-50 text-indigo-500" },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const item       = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }

export default function DashboardClient({ user }: Props) {
  const displayName = user.firstName || user.email.split("@")[0]
  const tierLabel   = user.tier.charAt(0).toUpperCase() + user.tier.slice(1)
  const creditPct   = Math.round((user.aiCredits / user.aiCreditsTotal) * 100)

  /* KPI cards with sparkline data */
  const kpi = [
    {
      label:   "Portfolio Views",
      value:   user.viewsLast30d.toLocaleString(),
      change:  "+18%",
      up:      true,
      sub:     "last 30 days",
      color:   "#7c3aed",
      data:    [820, 940, 760, 1100, 1340, 980, 1247, 1420, 1180, 1560, 1340, 1680],
      icon:    Eye,
    },
    {
      label:   "AI Credits",
      value:   `${user.aiCredits}/${user.aiCreditsTotal}`,
      change:  `${creditPct}%`,
      up:      creditPct > 50,
      sub:     "this month",
      color:   "#0891b2",
      data:    [50, 48, 46, 44, 42, 40, 38, 35, 33, 31, user.aiCredits, user.aiCredits],
      icon:    Zap,
    },
    {
      label:   "Portfolios",
      value:   user.portfolioCount.toString(),
      change:  "+1",
      up:      true,
      sub:     "published",
      color:   "#059669",
      data:    [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, user.portfolioCount, user.portfolioCount],
      icon:    Briefcase,
    },
    {
      label:   "Current Plan",
      value:   tierLabel,
      change:  user.tier === "free" ? "Upgrade" : "Active",
      up:      user.tier !== "free",
      sub:     user.tier === "free" ? "Start earning more" : "Renews monthly",
      color:   "#d97706",
      data:    [3, 4, 4, 5, 5, 5, 6, 7, 7, 8, 8, 9],
      icon:    Star,
    },
  ]

  const checklist = [
    { label: "Create your account",        done: true },
    { label: "Build your first portfolio", done: user.portfolioCount > 0 },
    { label: "Generate AI content",        done: user.aiCredits < user.aiCreditsTotal },
    { label: "Launch your creator store",  done: false },
    { label: "Connect a custom domain",    done: false },
  ]

  return (
    <div className="px-6 py-8 max-w-[1400px]">
      {/* ─── Welcome banner ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(130deg, #7c3aed 0%, #4f46e5 60%, #0891b2 100%)" }}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)" }} />
        <div className="relative px-7 py-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold text-white mb-1">Hey {displayName}! 👋</h1>
            <p className="text-violet-200 text-sm">Here&apos;s what&apos;s happening with your brand today.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{user.viewsLast30d.toLocaleString()}</p>
              <p className="text-xs text-violet-300">Views today</p>
            </div>
            <div className="w-px h-10 bg-white/20 self-center" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{user.aiCredits}</p>
              <p className="text-xs text-violet-300">AI credits left</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── KPI cards with sparklines ───────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      >
        {kpi.map((k) => (
          <motion.div key={k.label} variants={item} className="card p-4 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">{k.label}</span>
                <span className="text-2xl font-bold text-slate-900 mt-0.5 leading-none">{k.value}</span>
                <span className="text-xs text-slate-400 mt-1">{k.sub}</span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center`} style={{ background: `${k.color}15` }}>
                  <k.icon size={14} style={{ color: k.color }} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${k.up ? "stat-up" : "stat-down"}`}>
                  {k.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{k.change}
                </span>
              </div>
            </div>
            <Sparkline data={k.data} color={k.color} />
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Main 2-column layout ────────────────────────────────────── */}
      <div className="grid xl:grid-cols-[1fr_320px] gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Revenue chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-slate-900">Revenue Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Monthly earnings, last 12 months</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <ArrowUpRight size={14} />
                <span>+34% vs last year</span>
              </div>
            </div>
            <RevenueChart data={REVENUE_DATA} />
            <div className="flex justify-between text-[10px] text-slate-300 mt-1 font-medium">
              {MONTH_LABELS.map((m) => <span key={m}>{m}</span>)}
            </div>
          </motion.div>

          {/* Quick actions */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} /> Quick Actions
            </h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {QUICK_ACTIONS.map((a) => (
                <motion.div key={a.label} variants={item}>
                  <Link
                    href={a.href}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 ${a.border} hover:shadow-sm transition-all group`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${a.color}`}>
                      <a.icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {a.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">Get started checklist</h2>
              <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
                {checklist.filter((c) => c.done).length}/{checklist.length} done
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${(checklist.filter((c) => c.done).length / checklist.length) * 100}%` }}
              />
            </div>

            <ul className="space-y-3">
              {checklist.map((step) => (
                <li key={step.label} className="flex items-center gap-3">
                  {step.done ? (
                    <CheckCircle2 size={18} className="text-violet-500 shrink-0" />
                  ) : (
                    <Circle size={18} className="text-slate-200 shrink-0" />
                  )}
                  <span className={`text-sm ${step.done ? "line-through text-slate-300" : "text-slate-600 font-medium"}`}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right column — activity feed */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="card overflow-hidden h-fit"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-slate-400" />
              <h2 className="font-semibold text-slate-900 text-sm">Recent Activity</h2>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="divide-y divide-slate-50">
            {ACTIVITY_EVENTS.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                className="px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${e.color}`}>
                    <e.icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{e.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{e.sub}</p>
                  </div>
                  <span className="text-[10px] text-slate-300 shrink-0 mt-0.5">{e.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-slate-100">
            <Link href="/dashboard/analytics" className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors flex items-center gap-1">
              View all analytics <Package size={11} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
