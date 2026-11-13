"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Eye, Edit2, Globe, Lock, Palette, MoreHorizontal } from "lucide-react"
import { ShimmerCard, staggerContainer, staggerItem } from "@/components/ui/animations"

const PORTFOLIOS = [
  {
    id: "1",
    slug: "alex-chen",
    title: "Alex Chen — Design Lead",
    theme: "Minimal",
    published: true,
    views: 3241,
    sections: 7,
    updatedAt: "2 days ago",
    bannerClass: "from-violet-100 to-indigo-100",
  },
  {
    id: "2",
    slug: "alex-creative",
    title: "Creative Director Portfolio",
    theme: "Modern",
    published: false,
    views: 0,
    sections: 4,
    updatedAt: "5 days ago",
    bannerClass: "from-cyan-100 to-blue-100",
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
        <Link href="/dashboard/portfolio/new" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
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
            <ShimmerCard className="overflow-hidden group">
              {/* Preview banner */}
              <div className={`h-32 bg-gradient-to-br ${p.bannerClass} flex items-center justify-center relative`}>
                <Palette size={32} className="text-slate-300" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.published ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                    {p.published ? <><Globe size={10} className="inline mr-1" />Live</> : <><Lock size={10} className="inline mr-1" />Draft</>}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-sm text-slate-900 mb-1 truncate">{p.title}</h3>
                <p className="text-xs text-slate-400 mb-4">Theme: {p.theme} · {p.sections} sections · {p.updatedAt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Eye size={12} /> {p.views.toLocaleString()} views
                  </div>
                  <div className="flex gap-2">
                    {p.published && (
                      <Link href={`/${p.slug}`} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="View live">
                        <Eye size={15} className="text-slate-400" />
                      </Link>
                    )}
                    <Link href={`/dashboard/portfolio/${p.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Edit">
                      <Edit2 size={15} className="text-slate-400" />
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreHorizontal size={15} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </ShimmerCard>
          </motion.div>
        ))}

        {/* New portfolio card */}
        <motion.div variants={staggerItem}>
          <Link href="/dashboard/portfolio/new">
            <div className="h-full min-h-[200px] rounded-2xl border border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-violet-100 transition-colors flex items-center justify-center">
                <Plus size={20} className="text-slate-300 group-hover:text-violet-500 transition-colors" />
              </div>
              <span className="text-sm text-slate-400 group-hover:text-slate-600 transition-colors">New Portfolio</span>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Tips */}
      <div className="card p-6">
        <h3 className="font-medium mb-3 text-sm text-slate-500">💡 Portfolio tips</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Add a custom domain to your portfolio from Settings → Domains</li>
          <li>• Use AI Generate to auto-write your bio and skills section in seconds</li>
          <li>• Enable &quot;Show on marketplace&quot; to get discovered by potential clients</li>
        </ul>
      </div>
    </div>
  )
}
