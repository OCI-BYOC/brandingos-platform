'use client'

import Link from 'next/link'
import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Dashboard',  href: '/dashboard'            },
  { label: 'Portfolio',  href: '/dashboard/portfolio'  },
  { label: 'Commerce',   href: '/dashboard/commerce'   },
  { label: 'Courses',    href: '/dashboard/courses'    },
  { label: 'Social',     href: '/dashboard/social'     },
  { label: 'Jobs',       href: '/dashboard/jobs'       },
  { label: 'Newsletter', href: '/dashboard/newsletter' },
  { label: 'Booking',    href: '/dashboard/booking'    },
]

interface NavbarProps {
  variant?: 'dashboard' | 'marketing'
}

export default function Navbar({ variant = 'dashboard' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  if (variant === 'marketing') {
    return (
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(6,6,15,0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 14px rgba(124,58,237,0.5)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>BrandingOS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'Pricing', 'Blog'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-sm transition-colors duration-150"
                style={{ color: 'rgba(148,163,184,0.8)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden md:inline-flex px-4 py-1.5 text-sm rounded-lg transition-all duration-150"
              style={{ color: 'rgba(148,163,184,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-1.5 text-sm font-semibold rounded-lg btn-aurora"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
    )
  }

  // Dashboard variant (top bar inside dashboard layout — Sidebar handles main nav)
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 border-b shrink-0"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,6,15,0.85)', backdropFilter: 'blur(20px)' }}
    >
      {/* Mobile logo */}
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>BrandingOS</span>
      </Link>

      <div className="hidden lg:block" /> {/* Spacer on desktop */}

      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" style={{ color: 'rgba(148,163,184,0.7)' }} />
        </button>
        <UserButton
          appearance={{
            elements: { avatarBox: 'w-8 h-8' },
          }}
        />
        {/* Mobile menu */}
        <button
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" style={{ color: 'rgba(148,163,184,0.8)' }} /> : <Menu className="w-4 h-4" style={{ color: 'rgba(148,163,184,0.8)' }} />}
        </button>
      </div>

      {/* Mobile nav sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-72 z-50 p-6 flex flex-col gap-2"
            style={{ background: 'rgba(10,6,24,0.97)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" style={{ color: 'rgba(148,163,184,0.7)' }} />
              </button>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{ color: 'rgba(203,213,225,0.8)' }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
