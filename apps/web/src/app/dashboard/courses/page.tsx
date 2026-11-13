"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Users, Star, BookOpen, Video, MoreHorizontal, Play } from "lucide-react"
import { ShimmerCard, FadeUp, staggerContainer, staggerItem } from "@/components/ui/animations"

const COURSES = [
  {
    id: "1",
    title: "UI/UX Design Masterclass 2025",
    slug: "ui-ux-masterclass",
    students: 342,
    revenue: 1023558,
    lessons: 48,
    rating: 4.9,
    status: "published",
    gradient: "from-purple-600 to-indigo-600",
    tags: ["Design", "Figma", "Beginner"],
  },
  {
    id: "2",
    title: "Freelancing Blueprint: Land ₹1L/month",
    slug: "freelancing-blueprint",
    students: 189,
    revenue: 566811,
    lessons: 32,
    rating: 4.8,
    status: "published",
    gradient: "from-cyan-600 to-blue-600",
    tags: ["Business", "Freelance", "Advanced"],
  },
  {
    id: "3",
    title: "Personal Branding for Developers",
    slug: "dev-branding",
    students: 0,
    revenue: 0,
    lessons: 12,
    rating: 0,
    status: "draft",
    gradient: "from-amber-600 to-orange-600",
    tags: ["Branding", "Tech", "Intermediate"],
  },
]

export default function CoursesPage() {
  const totalStudents = COURSES.reduce((s, c) => s + c.students, 0)
  const totalRevenue  = COURSES.reduce((s, c) => s + c.revenue, 0)

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Courses & LMS</h1>
          <p className="text-white/40 text-sm mt-1">Create, sell, and manage online courses</p>
        </div>
        <Link href="/dashboard/courses/new" className="btn-aurora flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium">
          <Plus size={16} /> New Course
        </Link>
      </div>

      {/* Stats */}
      <FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Students",   value: totalStudents.toLocaleString(), icon: Users,     color: "text-purple-400" },
            { label: "Course Revenue",   value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`, icon: BookOpen, color: "text-emerald-400" },
            { label: "Courses Published",value: COURSES.filter((c) => c.status === "published").length.toString(), icon: Video, color: "text-cyan-400" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-white/40">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Course cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COURSES.map((c) => (
          <motion.div key={c.id} variants={staggerItem}>
            <ShimmerCard className="overflow-hidden h-full flex flex-col group">
              {/* Cover */}
              <div className={`h-36 bg-gradient-to-br ${c.gradient} relative flex items-center justify-center`}>
                <Play size={32} className="text-white/30" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/70">{t}</span>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "published" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-white/50 border border-white/10"}`}>
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm mb-3 leading-snug">{c.title}</h3>
                <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                  <span className="flex items-center gap-1"><Users size={11} />{c.students} students</span>
                  <span className="flex items-center gap-1"><Video size={11} />{c.lessons} lessons</span>
                  {c.rating > 0 && <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" />{c.rating}</span>}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-sm font-semibold text-emerald-400">
                    {c.revenue > 0 ? `₹${(c.revenue / 100).toLocaleString("en-IN")}` : "—"}
                  </p>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/courses/${c.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60">
                      Edit
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <MoreHorizontal size={14} className="text-white/40" />
                    </button>
                  </div>
                </div>
              </div>
            </ShimmerCard>
          </motion.div>
        ))}

        {/* New course CTA */}
        <motion.div variants={staggerItem}>
          <Link href="/dashboard/courses/new" className="block h-full min-h-[240px]">
            <div className="h-full rounded-2xl border border-dashed border-white/15 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-cyan-500/20 transition-colors flex items-center justify-center">
                <Plus size={20} className="text-white/30 group-hover:text-cyan-400 transition-colors" />
              </div>
              <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors">Create New Course</span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
