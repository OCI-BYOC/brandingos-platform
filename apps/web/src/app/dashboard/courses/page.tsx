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
    gradient: "from-violet-500 to-indigo-600",
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
    gradient: "from-cyan-500 to-blue-600",
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
    gradient: "from-amber-500 to-orange-500",
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
          <h1 className="text-2xl font-bold text-slate-900">Courses & LMS</h1>
          <p className="text-slate-400 text-sm mt-1">Create, sell, and manage online courses</p>
        </div>
        <Link href="/dashboard/courses/new" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
          <Plus size={16} /> New Course
        </Link>
      </div>

      {/* Stats */}
      <FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Students",    value: totalStudents.toLocaleString(),                                              icon: Users,     iconClass: "bg-violet-50 text-violet-600" },
            { label: "Course Revenue",    value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`,                        icon: BookOpen,  iconClass: "bg-emerald-50 text-emerald-600" },
            { label: "Published Courses", value: COURSES.filter((c) => c.status === "published").length.toString(),         icon: Video,     iconClass: "bg-cyan-50 text-cyan-600" },
          ].map((s) => (
            <div key={s.label} className="card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconClass}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{s.value}</p>
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
              {/* Cover — keep vivid gradient on course thumbnails */}
              <div className={`h-36 bg-gradient-to-br ${c.gradient} relative flex items-center justify-center`}>
                <Play size={32} className="text-white/40" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/80">{t}</span>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "published" ? "bg-white/20 text-white border border-white/30" : "bg-black/20 text-white/70 border border-white/10"}`}>
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm text-slate-900 mb-3 leading-snug">{c.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><Users size={11} />{c.students} students</span>
                  <span className="flex items-center gap-1"><Video size={11} />{c.lessons} lessons</span>
                  {c.rating > 0 && <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" />{c.rating}</span>}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-sm font-semibold text-emerald-600">
                    {c.revenue > 0 ? `₹${(c.revenue / 100).toLocaleString("en-IN")}` : "—"}
                  </p>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/courses/${c.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
                      Edit
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreHorizontal size={14} className="text-slate-400" />
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
            <div className="h-full rounded-2xl border border-dashed border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-cyan-100 transition-colors flex items-center justify-center">
                <Plus size={20} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </div>
              <span className="text-sm text-slate-400 group-hover:text-slate-600 transition-colors">Create New Course</span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
