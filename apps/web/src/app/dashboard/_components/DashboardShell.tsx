"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { UserButton } from "@clerk/nextjs"
import {
  LayoutDashboard, Briefcase, ShoppingBag, BookOpen,
  BarChart2, Settings, Zap, ChevronRight,
} from "lucide-react"

const NAV = [
  { icon: LayoutDashboard, label: "Overview",   href: "/dashboard" },
  { icon: Briefcase,       label: "Portfolio",  href: "/dashboard/portfolio" },
  { icon: ShoppingBag,     label: "Store",      href: "/dashboard/store" },
  { icon: BookOpen,        label: "Courses",    href: "/dashboard/courses" },
  { icon: BarChart2,       label: "Analytics",  href: "/dashboard/analytics" },
  { icon: Settings,        label: "Settings",   href: "/dashboard/settings" },
]

interface Props {
  user: { firstName: string; email: string; imageUrl: string }
  children: React.ReactNode
}

export default function DashboardShell({ user, children }: Props) {
  const path = usePathname()
  const displayName = user.firstName || user.email.split("@")[0]

  return (
    <div className="min-h-screen bg-[#06060f] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/[0.06] flex flex-col py-6 px-3 sticky top-0 h-screen">
        <Link href="/" className="mb-8 px-3">
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            BrandingOS
          </span>
        </Link>

        <nav className="flex-1 space-y-0.5">
          {NAV.map((nav) => {
            const active = path === nav.href || (nav.href !== "/dashboard" && path.startsWith(nav.href))
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${active ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-white/8 border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <nav.icon size={17} className={`relative z-10 transition-colors ${active ? "text-purple-400" : ""}`} />
                <span className="relative z-10">{nav.label}</span>
                {active && <ChevronRight size={14} className="relative z-10 ml-auto text-white/30" />}
              </Link>
            )
          })}
        </nav>

        {/* AI Credits pill */}
        <div className="mx-2 mb-4 p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={13} className="text-purple-400" />
            <span className="text-xs font-medium text-white/70">AI Credits</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
          </div>
          <p className="text-xs text-white/40 mt-1.5">31 / 50 remaining</p>
        </div>

        <div className="flex items-center gap-3 px-3 pt-4 border-t border-white/[0.06]">
          <UserButton />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-white/35 truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
