"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Eye, Edit2, Globe, Lock, MoreHorizontal, TrendingUp, ExternalLink } from "lucide-react"
import { staggerContainer, staggerItem } from "@/components/ui/animations"

const PORTFOLIOS = [
  {
    id: "1",
    slug: "alex-chen",
    title: "Alex Chen — Design Lead",
    theme: "Minimal",
    published: true,
    views: 3241,
    viewsChange: "+18%",
    sections: 7,
    updatedAt: "2 days ago",
    gradient: "from-violet-500 via-indigo-500 to-purple-600",
  },
  {
    id: "2",
    slug: "alex-creative",
    title: "Creative Director Portfolio",
    theme: "Modern",
    published: false,
    views: 0,
    viewsChange: "—",
    sections: 4,
    updatedAt: "5 days ago",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
  },
]

export default function PortfolioPage() {
  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolios</h1>
          <p className="text-slate-400 text-sm mt-1">Build and manage your professional presence</p>
        </div>
        <Link href="/dashboard/portfolio/new" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm shadow-md shadow-violet-200">
          <Plus size={16} /> New Portfolio
        </Link>
      </div>

      {/* Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
      >
        {PORTFOLIOS.map((p) => (
          <motion.div key={p.id} variants={staggerItem}>
            <div className="card card-hover overflow-hidden group">
              {/* Preview banner — rich gradient with mini preview */}
              <div className={`h-40 bg-gradient-to-br ${p.gradient} relative overflow-hidden`}>
                {/* Mini portfolio mockup */}
                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-3">
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white/40" />
                    <div className="flex flex-col gap-1 justify-center">
                      <div className="h-1.5 w-16 bg-white/50 rounded-full" />
                      <div className="h-1 w-10 bg-white/30 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-white/30 rounded-full" />
                    <div className="h-1.5 w-4/5 bg-white/20 rounded-full" />
                    <div className="h-1.5 w-3/5 bg-white/20 rounded-full" />
                  </div>
                  <div className="flex gap-1.5 mt-2.5">
                    {["Design", "Figma", "React"].map((t) => (
                      <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/20 text-white/80">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
                    p.published
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-white/80 text-slate-500 border border-slate-200"
                  }`}>
                    {p.published ? <><Globe size={8} />Live</> : <><Lock size={8} />Draft</>}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {p.published && (
                    <Link href={`/${p.slug}`} className="flex items-center gap-1.5 bg-white/90 text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg">
                      <ExternalLink size={12} /> View Live
                    </Link>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-bold text-sm text-slate-900 mb-1 truncate">{p.title}</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Theme: {p.theme} · {p.sections} sections · Updated {p.updatedAt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Eye size={12} />
                      <span className="font-medium">{p.views.toLocaleString()}</span>
                    </div>
                    {p.published && (
                      <div className="flex items-center gap-1 text-xs text-emerald-500">
                        <TrendingUp size={10} />
                        <span className="font-medium">{p.viewsChange}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {p.published && (
                      <Link href={`/${p.slug}`} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="View live">
                        <Eye size={14} className="text-slate-400" />
                      </Link>
                    )}
                    <Link href={`/dashboard/portfolio/${p.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Edit">
                      <Edit2 size={14} className="text-slate-400" />
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreHorizontal size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* New portfolio CTA */}
        <motion.div variants={staggerItem}>
          <Link href="/dashboard/portfolio/new">
            <div className="h-full min-h-[240px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/40 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-violet-100 transition-colors flex items-center justify-center shadow-sm">
                <Plus size={22} className="text-slate-300 group-hover:text-violet-500 transition-colors" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-700 transition-colors block">New Portfolio</span>
                <span className="text-xs text-slate-300 group-hover:text-slate-500 transition-colors">Create your next page</span>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Tips card */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-6">
        <h3 className="font-semibold text-sm text-violet-900 mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-violet-500" /> Portfolio growth tips
        </h3>
        <ul className="space-y-2 text-sm text-violet-700/70">
          <li className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">→</span>
            Add a custom domain from Settings → Domains to look more professional
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">→</span>
            Use AI Generate to auto-write your bio and skills section in seconds
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">→</span>
            Enable &quot;Show on marketplace&quot; to get discovered by potential clients
          </li>
        </ul>
      </div>
    </div>
  )
}
