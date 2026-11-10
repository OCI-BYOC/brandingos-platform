'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, Brain, TrendingUp, Layers } from 'lucide-react'

const features = [
  { icon: Brain, label: 'AI Content Engine', desc: 'Writes in your voice — not like a robot' },
  { icon: Layers, label: 'Portfolio & Site', desc: 'Go live in minutes, look like you spent months' },
  { icon: TrendingUp, label: 'Commerce & Courses', desc: 'Sell what you know, own what you earn' },
  { icon: Zap, label: 'Real-time Analytics', desc: 'Know exactly what lands and what doesn\'t' },
]

const Orb = ({
  size,
  color,
  style,
  duration = 18,
  delay = 0,
  path,
}: {
  size: number
  color: string
  style: React.CSSProperties
  duration?: number
  delay?: number
  path: number[][]
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${size * 0.12}px)`,
      ...style,
    }}
    animate={{
      x: path.map((p) => p[0]),
      y: path.map((p) => p[1]),
      scale: path.map((_, i) => (i % 2 === 0 ? 1 : 1.12)),
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
      times: path.map((_, i) => i / (path.length - 1)),
    }}
  />
)

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden flex"
      style={{ background: 'linear-gradient(145deg, #06060f 0%, #0a0618 50%, #06060f 100%)' }}
    >
      {/* ── Background orbs ── */}
      <Orb
        size={700}
        color="rgba(124, 58, 237, 0.28)"
        style={{ top: '-180px', left: '-200px' }}
        duration={22}
        path={[[0,0],[60,-50],[30,40],[-20,20],[0,0]]}
      />
      <Orb
        size={550}
        color="rgba(6, 182, 212, 0.22)"
        style={{ bottom: '-120px', right: '-150px' }}
        duration={19}
        delay={3}
        path={[[0,0],[-50,40],[30,-30],[-10,10],[0,0]]}
      />
      <Orb
        size={320}
        color="rgba(236, 72, 153, 0.15)"
        style={{ top: '30%', right: '10%' }}
        duration={14}
        delay={6}
        path={[[0,0],[40,-60],[-20,30],[10,-10],[0,0]]}
      />
      <Orb
        size={250}
        color="rgba(99, 102, 241, 0.2)"
        style={{ bottom: '20%', left: '15%' }}
        duration={16}
        delay={2}
        path={[[0,0],[-30,50],[20,-30],[-10,10],[0,0]]}
      />

      {/* Subtle noise grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* ── Left panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[46%] flex-col justify-between p-14 relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(6,182,212,0.2)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ color: 'rgba(255,255,255,0.92)' }}
          >
            BrandingOS
          </span>
        </Link>

        {/* Hero copy */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <h1
              className="text-5xl xl:text-[3.25rem] font-bold leading-[1.06] tracking-tight mb-6"
              style={{ letterSpacing: '-1px' }}
            >
              <span
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e2d9f3 60%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Clear Mind.
              </span>
              <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Bold Brand.
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-base leading-relaxed max-w-[22rem] mb-10"
            style={{ color: 'rgba(148,163,184,0.9)' }}
          >
            Build the professional presence that works for you — not the other way around. Powered by AI, owned by you.
          </motion.p>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                variants={fadeUp}
                whileHover={{ x: 6, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="flex items-center gap-4 cursor-default group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'rgba(124, 58, 237, 0.12)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <f.icon
                    className="w-4.5 h-4.5 transition-colors duration-300"
                    style={{ color: i % 2 === 0 ? '#a78bfa' : '#67e8f9' }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'rgba(241,245,249,0.9)' }}>
                    {f.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.9)' }}>
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="glass-card rounded-2xl p-5"
          style={{ boxShadow: '0 0 0 1px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.04)' }}
        >
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 20 20"
                className="w-3.5 h-3.5 fill-current"
                style={{ color: '#fbbf24' }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(203,213,225,0.85)' }}>
            &ldquo;Went from 8K to 47K followers in 4 months. The AI content engine writes in my voice perfectly.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              AC
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'rgba(241,245,249,0.9)' }}>
                Alex Chen
              </p>
              <p className="text-xs" style={{ color: 'rgba(100,116,139,0.8)' }}>
                Senior Engineer → Creator
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right panel: glass card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10"
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 0 20px rgba(124,58,237,0.5)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">BrandingOS</span>
          </div>

          <div
            className="glass-card rounded-3xl p-8 sm:p-10"
            style={{
              boxShadow:
                '0 0 0 1px rgba(124,58,237,0.12), 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {children}
          </div>

          <p
            className="text-center text-xs mt-4"
            style={{ color: 'rgba(100,116,139,0.6)' }}
          >
            Protected by Clerk · End-to-end encrypted
          </p>
        </div>
      </motion.div>
    </div>
  )
}
