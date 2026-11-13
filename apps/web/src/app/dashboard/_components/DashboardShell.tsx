"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Briefcase, ShoppingBag, BookOpen,
  BarChart2, Settings, Zap, LogOut, Bell,
} from "lucide-react"

const NAV = [
  { icon: LayoutDashboard, label: "Overview",   href: "/dashboard" },
  { icon: Briefcase,       label: "Portfolio",  href: "/dashboard/portfolio" },
  { icon: ShoppingBag,     label: "Store",      href: "/dashboard/store" },
  { icon: BookOpen,        label: "Courses",    href: "/dashboard/courses" },
  { icon: BarChart2,       label: "Analytics",  href: "/dashboard/analytics" },
  { icon: Settings,        label: "Settings",   href: "/dashboard/settings" },
]

interface Props { children: React.ReactNode }

export default function DashboardShell({ children }: Props) {
  const path = usePathname()

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <Link href="/dashboard" className="text-lg font-bold gradient-text tracking-tight">BrandingOS</Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = path === item.href || (item.href !== "/dashboard" && path.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group">
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-violet-50 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <item.icon
                  size={16}
                  className={`relative z-10 transition-colors ${active ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"}`}
                />
                <span className={`relative z-10 font-medium transition-colors ${active ? "text-violet-700" : "text-slate-600 group-hover:text-slate-900"}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* AI Credits */}
        <div className="px-4 pb-4">
          <div className="bg-violet-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-violet-700 flex items-center gap-1.5">
                <Zap size={11} /> AI Credits
              </span>
              <span className="text-xs text-violet-500 font-medium">31 / 50</span>
            </div>
            <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: "62%" }} />
            </div>
            <Link href="/dashboard/settings?tab=plan" className="mt-3 block text-center text-xs text-violet-600 hover:text-violet-800 font-semibold transition-colors">
              Upgrade for more →
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-100 p-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">Alex Chen</p>
            <p className="text-[10px] text-slate-400 truncate">Free plan</p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <LogOut size={13} className="text-slate-400" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-slate-900">
              {NAV.find((n) => path === n.href || (n.href !== "/dashboard" && path.startsWith(n.href)))?.label ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors relative">
              <Bell size={16} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-xs font-bold flex items-center justify-center cursor-pointer">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
