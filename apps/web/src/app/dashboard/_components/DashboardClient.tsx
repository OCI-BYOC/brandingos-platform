"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart2,
  Settings,
  ShoppingBag,
  Zap,
  Eye,
  Star,
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

const QUICK_ACTIONS = [
  { icon: FileText,    label: "New Content",   href: "/dashboard/content/new",   color: "bg-violet-50 text-violet-600" },
  { icon: Briefcase,   label: "New Portfolio", href: "/dashboard/portfolio/new", color: "bg-indigo-50 text-indigo-600" },
  { icon: ShoppingBag, label: "Add Product",   href: "/dashboard/store/new",     color: "bg-cyan-50 text-cyan-600" },
  { icon: Zap,         label: "AI Generate",   href: "/dashboard/content/ai",    color: "bg-amber-50 text-amber-600" },
  { icon: Star,        label: "Upgrade Plan",  href: "/dashboard/billing",       color: "bg-pink-50 text-pink-600" },
  { icon: Eye,         label: "View Store",    href: "/",                        color: "bg-emerald-50 text-emerald-600" },
]

function makeStats(user: User) {
  return [
    { label: "Profile Views",  value: user.viewsLast30d.toLocaleString(),                                      sub: "last 30 days" },
    { label: "AI Credits",     value: `${user.aiCredits}/${user.aiCreditsTotal}`,                              sub: "this month" },
    { label: "Portfolios",     value: user.portfolioCount.toString(),                                          sub: "published" },
    { label: "Plan",           value: user.tier.charAt(0).toUpperCase() + user.tier.slice(1),                 sub: "current tier" },
  ]
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function DashboardClient({ user }: Props) {
  const stats = makeStats(user)
  const displayName = user.firstName || user.email.split("@")[0]

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Here&apos;s what&apos;s happening with your brand.</p>
      </div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="card p-4"
          >
            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-300 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">Quick Actions</h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {QUICK_ACTIONS.map((action) => (
            <motion.div key={action.label} variants={item}>
              <Link
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon size={16} />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Onboarding checklist */}
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 mb-4 text-sm">Get started checklist</h2>
        <ul className="space-y-3 text-sm">
          {[
            { label: "Create your account",          done: true },
            { label: "Build your first portfolio",   done: user.portfolioCount > 0 },
            { label: "Generate AI content",          done: user.aiCredits < user.aiCreditsTotal },
            { label: "Launch your creator store",    done: false },
            { label: "Connect a custom domain",      done: false },
          ].map((step) => (
            <li key={step.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${step.done ? "bg-violet-500 border-violet-500" : "border-slate-200"}`}>
                {step.done && <span className="text-xs text-white">✓</span>}
              </div>
              <span className={step.done ? "line-through text-slate-300" : "text-slate-600"}>{step.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
