"use client"

import { motion } from "framer-motion"
import { UserButton } from "@clerk/nextjs"
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

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Briefcase, label: "Portfolio", href: "/dashboard/portfolio" },
  { icon: FileText, label: "Content", href: "/dashboard/content" },
  { icon: ShoppingBag, label: "Store", href: "/dashboard/store" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const QUICK_ACTIONS = [
  { icon: FileText, label: "New Content", href: "/dashboard/content/new", color: "from-purple-500 to-indigo-600" },
  { icon: Briefcase, label: "New Portfolio", href: "/dashboard/portfolio/new", color: "from-blue-500 to-cyan-600" },
  { icon: ShoppingBag, label: "Add Product", href: "/dashboard/store/new", color: "from-cyan-500 to-teal-600" },
  { icon: Zap, label: "AI Generate", href: "/dashboard/content/ai", color: "from-amber-500 to-orange-600" },
  { icon: Star, label: "Upgrade Plan", href: "/dashboard/billing", color: "from-pink-500 to-rose-600" },
  { icon: Eye, label: "View Store", href: `${process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:3001"}/${undefined}/store`, color: "from-violet-500 to-purple-600" },
]

function makeStats(user: User) {
  return [
    { label: "Profile Views", value: user.viewsLast30d.toLocaleString(), sub: "last 30 days" },
    { label: "AI Credits", value: `${user.aiCredits}/${user.aiCreditsTotal}`, sub: "this month" },
    { label: "Portfolios", value: user.portfolioCount.toString(), sub: "published" },
    { label: "Plan", value: user.tier.charAt(0).toUpperCase() + user.tier.slice(1), sub: "current tier" },
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
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/10 flex flex-col py-6 px-4">
        <div className="mb-8 px-2">
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            BrandingOS
          </span>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              <nav.icon size={18} />
              {nav.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 px-2 pt-4 border-t border-white/10">
          <UserButton />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-white/50 text-sm mt-1">Here&apos;s what&apos;s happening with your brand.</p>
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
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <p className="text-xs text-white/50 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-white/30 mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Quick Actions</h2>
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
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon size={18} />
                  </div>
                  <span className="text-sm font-medium group-hover:text-white text-white/80">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Onboarding checklist */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Get started checklist</h2>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Create your account", done: true },
              { label: "Build your first portfolio", done: user.portfolioCount > 0 },
              { label: "Generate AI content", done: user.aiCredits < user.aiCreditsTotal },
              { label: "Launch your creator store", done: false },
              { label: "Connect a custom domain", done: false },
            ].map((step) => (
              <li key={step.label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${step.done ? "bg-purple-500 border-purple-500" : "border-white/20"}`}>
                  {step.done && <span className="text-xs">✓</span>}
                </div>
                <span className={step.done ? "line-through text-white/30" : "text-white/70"}>{step.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
