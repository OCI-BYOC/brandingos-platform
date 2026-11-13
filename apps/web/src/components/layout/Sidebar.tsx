'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Globe, ShoppingBag, BookOpen, Calendar,
  Share2, Mail, Briefcase, BarChart2, Settings,
  ChevronLeft, ChevronRight, Zap, Crown,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Brand',
    items: [
      { label: 'Dashboard',  href: '/dashboard',            icon: LayoutDashboard },
      { label: 'Portfolio',  href: '/dashboard/portfolio',  icon: Globe },
    ],
  },
  {
    label: 'Monetise',
    items: [
      { label: 'Commerce',   href: '/dashboard/commerce',   icon: ShoppingBag },
      { label: 'Courses',    href: '/dashboard/courses',    icon: BookOpen },
      { label: 'Booking',    href: '/dashboard/booking',    icon: Calendar },
    ],
  },
  {
    label: 'Grow',
    items: [
      { label: 'Social',     href: '/dashboard/social',     icon: Share2 },
      { label: 'Newsletter', href: '/dashboard/newsletter', icon: Mail },
      { label: 'Jobs',       href: '/dashboard/jobs',       icon: Briefcase },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Analytics',  href: '/dashboard/analytics',  icon: BarChart2 },
    ],
  },
]

const TIER_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  free:   { text: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  pro:    { text: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.2)'   },
  growth: { text: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
  brand:  { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
}

interface SidebarProps {
  tier?: string
  aiCredits?: number
  aiCreditsTotal?: number
}

export default function Sidebar({ tier = 'free', aiCredits = 50, aiCreditsTotal = 50 }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const tierColors = TIER_COLORS[tier] ?? TIER_COLORS.free
  const creditsPercent = Math.min(100, Math.round((aiCredits / aiCreditsTotal) * 100))

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex flex-col shrink-0 border-r relative z-20"
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        background: 'rgba(10,6,24,0.85)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 14px rgba(124,58,237,0.5)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                BrandingOS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-1"
                  style={{ color: 'rgba(100,116,139,0.6)' }}
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl text-sm transition-all duration-150 group relative overflow-hidden"
                    style={{
                      background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: active ? '#c4b5fd' : 'rgba(148,163,184,0.7)',
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
                      />
                    )}
                    <item.icon className="w-4 h-4 shrink-0 relative z-10" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative z-10 whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom area */}
      <div className="border-t p-2 space-y-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {/* AI Credits gauge */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 py-2 mb-1"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" style={{ color: '#06b6d4' }} />
                  <span className="text-[11px]" style={{ color: 'rgba(100,116,139,0.8)' }}>AI Credits</span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: 'rgba(203,213,225,0.9)' }}>
                  {aiCredits}/{aiCreditsTotal}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${creditsPercent}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-3 px-2 py-2 rounded-xl text-sm transition-all duration-150"
          style={{ color: 'rgba(148,163,184,0.6)' }}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden">
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Tier badge */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 py-1.5 rounded-xl mx-0 flex items-center gap-2"
              style={{ background: tierColors.bg, border: `1px solid ${tierColors.border}` }}
            >
              <Crown className="w-3.5 h-3.5 shrink-0" style={{ color: tierColors.text }} />
              <span className="text-xs font-semibold capitalize" style={{ color: tierColors.text }}>
                {tier} Plan
              </span>
              {tier === 'free' && (
                <Link href="/pricing" className="ml-auto text-[10px] font-semibold" style={{ color: '#7c3aed' }}>
                  Upgrade
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full border flex items-center justify-center transition-all hover:scale-110 z-30"
        style={{ background: '#06060f', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(148,163,184,0.7)' }}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  )
}
