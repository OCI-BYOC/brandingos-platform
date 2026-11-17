"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useRef, useEffect } from "react"

// ─── Blur Text (React Bits style) ────────────────────────────────────────────
export function BlurText({
  text,
  className = "",
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(" ")
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(12px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: "easeOut" }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// ─── Gradient Text ────────────────────────────────────────────────────────────
export function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`gradient-text ${className}`}>{children}</span>
  )
}

// ─── Fade Up (scroll-triggered) ───────────────────────────────────────────────
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Count Up ─────────────────────────────────────────────────────────────────
export function CountUp({
  to,
  suffix = "",
  className = "",
}: {
  to: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 20 })

  useEffect(() => {
    if (inView) mv.set(to)
  }, [inView, mv, to])

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix
    })
  }, [spring, suffix])

  return <span ref={ref} className={className}>0{suffix}</span>
}

// ─── Light soft-orb background ───────────────────────────────────────────────
export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-100 opacity-70 blur-[120px]" />
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-100 opacity-50 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-indigo-100 opacity-50 blur-[120px]" />
    </div>
  )
}

// ─── Stagger container ────────────────────────────────────────────────────────
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
}

// ─── Shimmer Card (light) ─────────────────────────────────────────────────────
export function ShimmerCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  )
}
