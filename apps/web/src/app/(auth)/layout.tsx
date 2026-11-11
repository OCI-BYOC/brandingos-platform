"use client"

import { motion } from "framer-motion"

const ORB_DATA = [
  { x: "10%", y: "15%", size: 500, color: "rgba(124,58,237,0.25)", delay: 0 },
  { x: "70%", y: "5%", size: 420, color: "rgba(59,130,246,0.2)", delay: 1.5 },
  { x: "60%", y: "60%", size: 380, color: "rgba(6,182,212,0.18)", delay: 3 },
  { x: "5%", y: "65%", size: 350, color: "rgba(167,139,250,0.15)", delay: 2 },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {ORB_DATA.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[120px]"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: orb.color,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, delay: orb.delay }}
          />
        ))}
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        <div className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          BrandingOS
        </div>
        <div className="space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Clear Mind.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Bold Brand.
            </span>
          </h2>
          <ul className="space-y-3 text-white/60">
            {[
              "AI-powered brand content",
              "Creator portfolio builder",
              "Full e-commerce store",
              "Analytics & insights",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-purple-400">✦</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-white/30 text-sm">© 2026 BrandingOS</p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        {children}
      </div>
    </div>
  )
}
