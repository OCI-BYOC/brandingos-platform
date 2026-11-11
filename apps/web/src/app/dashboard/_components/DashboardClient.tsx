'use client'

import { motion } from 'framer-motion'
import {
  Zap, Brain, TrendingUp, Layers, FileText, Users,
  Eye, BarChart2, ArrowRight, Bell, Settings, LogOut,
  Plus, Sparkles, Globe, BookOpen, ShoppingBag,
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

type UserProps = {
  id: string
  firstName: string
  lastName: string
  email: string
  imageUrl: string
  tier?: string
  aiCredits?: number
}

const makeStats = (aiCredits: number, tier: string) => [
  { label: 'Profile Views', value: '—', icon: Eye, color: '#7c3aed', glow: 'rgba(124,58,237,0.3)' },
  { label: 'AI Credits Left', value: String(aiCredits), icon: Zap, color: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
  { label: 'Content Pieces', value: '0', icon: FileText, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  { label: 'Plan', value: tier.charAt(0).toUpperCase() + tier.slice(1), icon: Users, color: '#f472b6', glow: 'rgba(244,114,182,0.3)' },
]

const quickActions = [
  {
    icon: Brain,
    title: 'Generate Content',
    desc: 'Write posts in your voice with AI',
    href: '/dashboard/content/new',
    color: '#7c3aed',
    badge: 'AI',
  },
  {
    icon: Globe,
    title: 'Build Your Portfolio',
    desc: 'Go live in minutes',
    href: '/dashboard/portfolio',
    color: '#06b6d4',
  },
  {
    icon: BookOpen,
    title: 'Create a Course',
    desc: 'Sell what you know',
    href: '/dashboard/courses/new',
    color: '#a78bfa',
  },
  {
    icon: ShoppingBag,
    title: 'Set Up Commerce',
    desc: 'Products, services & more',
    href: '/dashboard/commerce',
    color: '#f472b6',
  },
  {
    icon: BarChart2,
    title: 'View Analytics',
    desc: 'See what lands with your audience',
    href: '/dashboard/analytics',
    color: '#34d399',
  },
  {
    icon: Sparkles,
    title: 'Brand Settings',
    desc: 'Colors, fonts & your identity',
    href: '/dashboard/brand',
    color: '#fbbf24',
  },
]

const navItems = [
  { icon: Layers, label: 'Overview', href: '/dashboard', active: true },
  { icon: Brain, label: 'Content', href: '/dashboard/content' },
  { icon: Globe, label: 'Portfolio', href: '/dashboard/portfolio' },
  { icon: BookOpen, label: 'Courses', href: '/dashboard/courses' },
  { icon: ShoppingBag, label: 'Commerce', href: '/dashboard/commerce' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function DashboardClient({ user }: { user: UserProps }) {
  const displayName = user.firstName || user.email.split('@')[0]
  const stats = makeStats(user.aiCredits ?? 50, user.tier ?? 'free')

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(145deg, #06060f 0%, #0a0618 50%, #06060f 100%)' }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[220px] shrink-0 border-r py-6 px-4 relative z-10"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,6,24,0.7)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 mb-8 px-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
            BrandingOS
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group"
              style={{
                background: item.active ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: item.active ? '#c4b5fd' : 'rgba(148,163,184,0.7)',
              }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="space-y-0.5 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150" style={{ color: 'rgba(148,163,184,0.6)' }}>
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 border-b shrink-0 relative z-10"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,6,15,0.8)', backdropFilter: 'blur(20px)' }}
        >
          <div>
            <h1 className="text-sm font-semibold" style={{ color: 'rgba(241,245,249,0.9)' }}>
              Overview
            </h1>
            <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
              Your brand, at a glance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Bell className="w-4 h-4" style={{ color: 'rgba(148,163,184,0.7)' }} />
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-8">

            {/* Welcome */}
            <motion.div variants={fadeUp}>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e2d9f3 60%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Good to see you, {displayName} 👋
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(100,116,139,0.8)' }}>
                Your brand is live. Here&apos;s what&apos;s happening.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(15,12,30,0.55)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: `0 0 24px ${stat.glow}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${stat.color}22`, border: `1px solid ${stat.color}33` }}
                    >
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'rgba(241,245,249,0.95)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.8)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Quick actions */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'rgba(241,245,249,0.8)' }}>
                  Quick Actions
                </h3>
                <span className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>
                  What do you want to build today?
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <motion.div
                    key={action.title}
                    whileHover={{ y: -3, scale: 1.015 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  >
                    <Link
                      href={action.href}
                      className="flex items-start gap-4 p-4 rounded-2xl group transition-all duration-200"
                      style={{
                        background: 'rgba(15,12,30,0.55)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                        style={{ background: `${action.color}18`, border: `1px solid ${action.color}30` }}
                      >
                        <action.icon className="w-4.5 h-4.5" style={{ color: action.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold" style={{ color: 'rgba(241,245,249,0.9)' }}>
                            {action.title}
                          </p>
                          {action.badge && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                              style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}
                            >
                              {action.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.8)' }}>
                          {action.desc}
                        </p>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: 'rgba(148,163,184,0.5)' }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Onboarding checklist */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(124,58,237,0.06)',
                border: '1px solid rgba(124,58,237,0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: '#a78bfa' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'rgba(241,245,249,0.9)' }}>
                    Set up your brand
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
                    Complete these to unlock the full platform
                  </p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Add your profile photo & bio', done: !!user.imageUrl },
                  { label: 'Pick your brand colors & fonts', done: false },
                  { label: 'Create your first content piece', done: false },
                  { label: 'Publish your portfolio page', done: false },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: step.done ? '#7c3aed' : 'rgba(255,255,255,0.15)',
                        background: step.done ? 'rgba(124,58,237,0.3)' : 'transparent',
                      }}
                    >
                      {step.done && (
                        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: step.done ? 'rgba(148,163,184,0.5)' : 'rgba(203,213,225,0.8)', textDecoration: step.done ? 'line-through' : 'none' }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </main>
      </div>
    </div>
  )
}
