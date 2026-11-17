"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Briefcase, FileText, Mail, Mic, ExternalLink, ChevronRight } from "lucide-react"
import Link from "next/link"

type Stage = "bookmarked" | "applied" | "screening" | "interview" | "offer" | "closed"

interface Application {
  id: string
  title: string
  company: string
  location: string
  stage: Stage
  aiMatchScore?: number
  appliedAt?: string
  salary?: string
  isRemote?: boolean
}

const STAGES: { key: Stage; label: string; color: string; bg: string }[] = [
  { key: "bookmarked", label: "Bookmarked", color: "text-slate-500",  bg: "bg-slate-100" },
  { key: "applied",    label: "Applied",    color: "text-blue-600",   bg: "bg-blue-50"  },
  { key: "screening",  label: "Screening",  color: "text-amber-600",  bg: "bg-amber-50" },
  { key: "interview",  label: "Interview",  color: "text-violet-600", bg: "bg-violet-50"},
  { key: "offer",      label: "Offer",      color: "text-green-600",  bg: "bg-green-50" },
  { key: "closed",     label: "Closed",     color: "text-red-500",    bg: "bg-red-50"   },
]

const MOCK: Application[] = [
  { id: "1", title: "Senior Product Designer", company: "Razorpay",    location: "Bangalore", stage: "interview", aiMatchScore: 92, appliedAt: "Nov 12", salary: "₹28–35L", isRemote: false },
  { id: "2", title: "Brand Strategist",         company: "Swiggy",     location: "Remote",    stage: "applied",   aiMatchScore: 85, appliedAt: "Nov 14", salary: "₹20–26L", isRemote: true  },
  { id: "3", title: "UX Lead",                  company: "Meesho",     location: "Bangalore", stage: "screening", aiMatchScore: 78, appliedAt: "Nov 10", salary: "₹22–30L", isRemote: false },
  { id: "4", title: "Design Director",          company: "CRED",       location: "Bangalore", stage: "bookmarked",aiMatchScore: 95, salary: "₹40–50L",  isRemote: false },
  { id: "5", title: "Head of Design",           company: "PhonePe",    location: "Remote",    stage: "offer",     aiMatchScore: 88, appliedAt: "Nov 8",  salary: "₹45–55L", isRemote: true  },
  { id: "6", title: "Visual Designer",          company: "Zomato",     location: "Delhi",     stage: "closed",    aiMatchScore: 60, appliedAt: "Oct 30", isRemote: false },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "bg-green-50 text-green-700" : score >= 70 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
  return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${color}`}>{score}% match</span>
}

export default function JobsClient() {
  const [activeStage, setActiveStage] = useState<Stage | "all">("all")

  const filtered = activeStage === "all" ? MOCK : MOCK.filter((a) => a.stage === activeStage)
  const counts = STAGES.reduce((acc, s) => ({ ...acc, [s.key]: MOCK.filter((a) => a.stage === s.key).length }), {} as Record<Stage, number>)

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Track applications, prep interviews, and land your next role.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> Add Application
        </button>
      </div>

      {/* Pipeline stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {STAGES.map((s) => (
          <motion.button
            key={s.key}
            variants={item}
            onClick={() => setActiveStage(activeStage === s.key ? "all" : s.key)}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center ${
              activeStage === s.key
                ? `${s.bg} border-current ${s.color} ring-1 ring-current`
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <span className={`text-2xl font-bold ${activeStage === s.key ? s.color : "text-slate-900"}`}>{counts[s.key]}</span>
            <span className={`text-[11px] font-medium mt-0.5 ${activeStage === s.key ? s.color : "text-slate-500"}`}>{s.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Application list */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            {activeStage === "all" ? `All applications (${MOCK.length})` : `${STAGES.find(s => s.key === activeStage)?.label} (${filtered.length})`}
          </span>
          <button onClick={() => setActiveStage("all")} className={`text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors ${activeStage === "all" ? "hidden" : ""}`}>
            Clear filter
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.map((app) => {
            const stage = STAGES.find((s) => s.key === app.stage)!
            return (
              <div key={app.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group">
                {/* Company avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0 text-violet-700 font-bold text-sm">
                  {app.company[0]}
                </div>

                {/* Job info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 truncate">{app.title}</span>
                    {app.aiMatchScore && <ScoreBadge score={app.aiMatchScore} />}
                    {app.isRemote && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">Remote</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="font-medium text-slate-600">{app.company}</span>
                    <span>·</span>
                    <span>{app.location}</span>
                    {app.salary && <><span>·</span><span className="font-mono text-slate-500">{app.salary}</span></>}
                    {app.appliedAt && <><span>·</span><span>Applied {app.appliedAt}</span></>}
                  </div>
                </div>

                {/* Stage badge */}
                <span className={`hidden md:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full ${stage.bg} ${stage.color}`}>
                  {stage.label}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button title="Cover letter" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors">
                    <FileText size={14} />
                  </button>
                  <button title="Cold email" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors">
                    <Mail size={14} />
                  </button>
                  <button title="Interview prep" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors">
                    <Mic size={14} />
                  </button>
                  <button title="Open listing" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>

                <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors shrink-0" />
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Briefcase size={32} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm text-slate-400">No applications in this stage yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: FileText, label: "Build Resume",      sub: "LaTeX-powered resume builder",    href: "/dashboard/jobs/resume",    color: "from-violet-500 to-indigo-600" },
          { icon: Mic,      label: "Interview Prep",    sub: "AI-generated practice questions", href: "/dashboard/jobs/interview",  color: "from-amber-500 to-orange-500"  },
          { icon: Mail,     label: "Cold Outreach",     sub: "AI-drafted personalised emails",  href: "/dashboard/jobs/outreach",   color: "from-blue-500 to-cyan-500"     },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-4 p-4 bg-white border border-slate-100 hover:border-violet-200 hover:shadow-md rounded-xl transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
              <action.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-900">{action.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{action.sub}</p>
            </div>
            <ChevronRight size={14} className="ml-auto text-slate-200 group-hover:text-violet-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
