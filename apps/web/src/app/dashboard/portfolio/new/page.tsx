"use client"

import { useState, useCallback, KeyboardEvent } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, ArrowRight, ArrowLeft, Check, Plus, Trash2,
  Code2, PenTool, Camera, Megaphone, Handshake, Video, FileText, Sparkles,
  ChevronUp, ChevronDown, Eye, ExternalLink,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string
  title: string
  description: string
  tags: string
  url: string
}

interface Section {
  id: string
  label: string
  description: string
  icon: string
  enabled: boolean
  order: number
}

interface PortfolioData {
  name: string
  professionCategory: string
  professionTitle: string
  tagline: string
  bio: string
  skillInput: string
  skills: string[]
  projects: Project[]
  sections: Section[]
  theme: "minimal" | "bold" | "creative" | "professional"
  accentColor: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFESSIONS = [
  { id: "developer", label: "Developer", icon: Code2, description: "Web, Mobile, Backend" },
  { id: "designer", label: "Designer", icon: PenTool, description: "UI/UX, Brand, Motion" },
  { id: "photographer", label: "Photographer", icon: Camera, description: "Photo & Visual" },
  { id: "marketer", label: "Marketer", icon: Megaphone, description: "Growth, Content, Brand" },
  { id: "consultant", label: "Consultant", icon: Handshake, description: "Strategy, Advisory" },
  { id: "creator", label: "Creator", icon: Video, description: "Video, Social, Content" },
  { id: "writer", label: "Writer", icon: FileText, description: "Copy, Journalism, Docs" },
  { id: "other", label: "Other", icon: Sparkles, description: "Something unique" },
]

const DEFAULT_SECTIONS_FOR_PROFESSION: Record<string, string[]> = {
  developer: ["about", "skills", "projects", "experience", "contact"],
  designer: ["about", "projects", "skills", "testimonials", "contact"],
  photographer: ["about", "projects", "testimonials", "contact"],
  marketer: ["about", "skills", "experience", "services", "contact"],
  consultant: ["about", "services", "experience", "testimonials", "contact"],
  creator: ["about", "projects", "articles", "contact"],
  writer: ["about", "articles", "projects", "contact"],
  other: ["about", "skills", "projects", "contact"],
}

function buildSections(professionId: string): Section[] {
  const enabled = DEFAULT_SECTIONS_FOR_PROFESSION[professionId] ?? DEFAULT_SECTIONS_FOR_PROFESSION.other
  const all: Array<Omit<Section, "enabled" | "order">> = [
    { id: "about",        label: "About",       description: "Your story & introduction", icon: "👤" },
    { id: "skills",       label: "Skills",       description: "What you are great at",     icon: "⚡" },
    { id: "projects",     label: "Projects",     description: "Your best work",            icon: "💼" },
    { id: "experience",   label: "Experience",   description: "Work history",              icon: "🏢" },
    { id: "services",     label: "Services",     description: "What you offer clients",    icon: "🛎️" },
    { id: "testimonials", label: "Testimonials", description: "What others say",           icon: "⭐" },
    { id: "education",    label: "Education",    description: "Academic & certs",          icon: "🎓" },
    { id: "articles",     label: "Articles",     description: "Blog & writing",            icon: "📝" },
    { id: "contact",      label: "Contact",      description: "How to reach you",          icon: "📧" },
  ]
  return all.map((s, i) => ({ ...s, enabled: enabled.includes(s.id), order: i + 1 }))
}

const THEMES = [
  { id: "minimal",      label: "Minimal",      description: "Clean & airy",        bg: "#ffffff", accent: "#0f172a", text: "#475569", border: "#e2e8f0" },
  { id: "bold",         label: "Bold",         description: "Dark & dramatic",      bg: "#09090b", accent: "#a78bfa", text: "#e2e8f0", border: "#27272a" },
  { id: "creative",     label: "Creative",     description: "Colorful & playful",   bg: "#faf5ff", accent: "#7c3aed", text: "#1e1b4b", border: "#ddd6fe" },
  { id: "professional", label: "Professional", description: "Sharp & trustworthy",  bg: "#f0f9ff", accent: "#0284c7", text: "#0c4a6e", border: "#bae6fd" },
]

const ACCENT_COLORS = [
  { id: "violet",  color: "#7c3aed" },
  { id: "blue",    color: "#2563eb" },
  { id: "emerald", color: "#059669" },
  { id: "rose",    color: "#e11d48" },
  { id: "amber",   color: "#d97706" },
  { id: "slate",   color: "#334155" },
]

const STEP_LABELS = [
  "Your Name",
  "What You Do",
  "Your Tagline",
  "Your Story",
  "Skills",
  "Your Work",
  "Sections",
  "Visual Style",
]

const TOTAL_STEPS = STEP_LABELS.length

function emptyProject(): Project {
  return { id: crypto.randomUUID(), title: "", description: "", tags: "", url: "" }
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

function LivePreview({ data }: { data: PortfolioData }) {
  const theme = THEMES.find(t => t.id === data.theme) ?? THEMES[0]
  const accent = data.accentColor || theme.accent
  const name    = data.name || "Your Name"
  const title   = data.professionTitle || data.professionCategory || "Your Title"
  const tagline = data.tagline || "A short, punchy line that captures you."
  const bio     = data.bio || "Your bio will appear here as you write it…"
  const skills  = data.skills.length ? data.skills : ["Skill 1", "Skill 2", "Skill 3"]
  const projects = data.projects.filter(p => p.title)
  const enabledSections = data.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order)

  return (
    <div
      style={{ background: theme.bg, color: theme.text, fontFamily: "var(--font-display, 'Space Grotesk', system-ui, sans-serif)" }}
      className="w-full h-full overflow-y-auto text-[11px] leading-relaxed"
    >
      {/* Nav */}
      <div
        style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}`, color: theme.text }}
        className="flex items-center justify-between px-5 py-3 sticky top-0 z-10"
      >
        <span className="font-bold text-[13px]">{name.split(" ")[0]}</span>
        <div className="flex gap-3 text-[10px] opacity-60">
          {enabledSections.slice(0, 4).map(s => <span key={s.id}>{s.label}</span>)}
        </div>
        <div
          className="text-[10px] px-2 py-1 rounded font-semibold"
          style={{ background: accent, color: "#fff" }}
        >
          Hire Me
        </div>
      </div>

      {/* Hero */}
      <div className="px-5 pt-6 pb-4">
        <div className="text-[10px] font-semibold tracking-widest uppercase opacity-50 mb-2">{title}</div>
        <h1 className="text-[22px] font-bold leading-tight mb-2" style={{ color: theme.text }}>
          {name}
        </h1>
        <p className="text-[12px] mb-4 opacity-70 leading-relaxed max-w-[260px]">{tagline}</p>
        <div className="flex gap-2">
          <div
            className="text-[10px] px-3 py-1.5 rounded-full font-semibold"
            style={{ background: accent, color: "#fff" }}
          >
            View Work ↓
          </div>
          <div
            className="text-[10px] px-3 py-1.5 rounded-full font-semibold"
            style={{ border: `1px solid ${theme.border}`, color: theme.text }}
          >
            Contact
          </div>
        </div>
      </div>

      {/* Sections */}
      {enabledSections.map(s => {
        if (s.id === "about") return (
          <div key={s.id} className="px-5 py-4 border-t" style={{ borderColor: theme.border }}>
            <div className="text-[9px] font-bold tracking-widest uppercase opacity-40 mb-2">About</div>
            <p className="text-[10px] opacity-70 leading-relaxed line-clamp-4">{bio}</p>
          </div>
        )
        if (s.id === "skills") return (
          <div key={s.id} className="px-5 py-4 border-t" style={{ borderColor: theme.border }}>
            <div className="text-[9px] font-bold tracking-widest uppercase opacity-40 mb-2">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((sk, i) => (
                <span key={i} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: `${accent}18`, color: accent, fontWeight: 600 }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )
        if (s.id === "projects") return (
          <div key={s.id} className="px-5 py-4 border-t" style={{ borderColor: theme.border }}>
            <div className="text-[9px] font-bold tracking-widest uppercase opacity-40 mb-2">Projects</div>
            {projects.length === 0 ? (
              <div className="text-[9px] opacity-30 italic">Your projects will appear here…</div>
            ) : (
              <div className="flex flex-col gap-2">
                {projects.slice(0, 2).map(p => (
                  <div key={p.id} className="rounded-lg p-3" style={{ background: `${accent}0d`, border: `1px solid ${theme.border}` }}>
                    <div className="font-semibold text-[10px] mb-0.5">{p.title}</div>
                    {p.description && <div className="text-[9px] opacity-60 line-clamp-2">{p.description}</div>}
                    {p.tags && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {p.tags.split(",").slice(0, 3).map((t, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: `${accent}20`, color: accent }}>{t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
        return (
          <div key={s.id} className="px-5 py-3 border-t" style={{ borderColor: theme.border }}>
            <div className="text-[9px] font-bold tracking-widest uppercase opacity-40 mb-1">{s.label}</div>
            <div className="text-[9px] opacity-30 italic">Content goes here…</div>
          </div>
        )
      })}

      {/* Footer */}
      <div className="px-5 py-4 border-t text-center" style={{ borderColor: theme.border }}>
        <div className="text-[9px] opacity-30">© {new Date().getFullYear()} {name} · Made with BrandingOS</div>
      </div>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepName({ data, onChange, onNext }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void; onNext: () => void }) {
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && data.name.trim()) onNext() }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">01 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">What&apos;s your name?</h2>
        <p className="text-slate-400 text-sm">This will be the headline of your portfolio.</p>
      </div>
      <input
        autoFocus
        value={data.name}
        onChange={e => onChange("name", e.target.value)}
        onKeyDown={handleKey}
        placeholder="e.g. Alex Johnson"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-xl placeholder:text-slate-600 outline-none focus:border-violet-500/60 transition-colors"
      />
      <p className="text-slate-600 text-xs">Press Enter to continue ↵</p>
    </div>
  )
}

function StepProfession({ data, onChange }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">02 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">What do you do?</h2>
        <p className="text-slate-400 text-sm">Pick the category that fits best — you can refine later.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PROFESSIONS.map(p => {
          const Icon = p.icon
          const selected = data.professionCategory === p.id
          return (
            <button
              key={p.id}
              onClick={() => { onChange("professionCategory", p.id); if (!data.professionTitle) onChange("professionTitle", p.label) }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all"
              style={{
                background: selected ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                borderColor: selected ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
              }}
            >
              <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: selected ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)" }}>
                <Icon size={16} className={selected ? "text-violet-300" : "text-slate-400"} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${selected ? "text-violet-200" : "text-slate-300"}`}>{p.label}</div>
                <div className="text-xs text-slate-500">{p.description}</div>
              </div>
            </button>
          )
        })}
      </div>
      {data.professionCategory && (
        <div>
          <label className="text-slate-400 text-xs font-medium mb-2 block">Your exact title</label>
          <input
            autoFocus
            value={data.professionTitle}
            onChange={e => onChange("professionTitle", e.target.value)}
            placeholder={`e.g. Senior ${PROFESSIONS.find(p => p.id === data.professionCategory)?.label ?? "Professional"}`}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-violet-500/60 transition-colors"
          />
        </div>
      )}
    </div>
  )
}

function StepTagline({ data, onChange, onNext }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void; onNext: () => void }) {
  const examples = [
    "I build products people love.",
    "Design that converts, brands that last.",
    "Words that move people to act.",
    "Helping startups find product-market fit.",
  ]
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") onNext() }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">03 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Your one-liner.</h2>
        <p className="text-slate-400 text-sm">A powerful sentence that captures what you do and why it matters.</p>
      </div>
      <input
        autoFocus
        value={data.tagline}
        onChange={e => onChange("tagline", e.target.value)}
        onKeyDown={handleKey}
        placeholder="I help companies ship faster."
        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-xl placeholder:text-slate-600 outline-none focus:border-violet-500/60 transition-colors"
      />
      <div>
        <p className="text-slate-600 text-xs mb-3">Need inspiration?</p>
        <div className="flex flex-col gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => onChange("tagline", ex)}
              className="text-left text-sm text-slate-400 hover:text-slate-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              &ldquo;{ex}&rdquo;
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepBio({ data, onChange }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void }) {
  const charLimit = 500
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">04 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Tell your story.</h2>
        <p className="text-slate-400 text-sm">Write a short bio — who you are, what you care about, what drives you.</p>
      </div>
      <div className="relative">
        <textarea
          autoFocus
          value={data.bio}
          onChange={e => onChange("bio", e.target.value.slice(0, charLimit))}
          placeholder={`Hey, I'm ${data.name || "Alex"} — a ${data.professionTitle || "professional"} with a passion for…`}
          rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:border-violet-500/60 transition-colors resize-none leading-relaxed"
        />
        <div className="absolute bottom-3 right-4 text-xs text-slate-600">
          {data.bio.length} / {charLimit}
        </div>
      </div>
      <p className="text-slate-600 text-xs">Keep it conversational — this is your first impression.</p>
    </div>
  )
}

function StepSkills({ data, onChange }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void }) {
  const addSkill = () => {
    const val = data.skillInput.trim()
    if (!val || data.skills.includes(val)) return
    onChange("skills", [...data.skills, val])
    onChange("skillInput", "")
  }
  const removeSkill = (s: string) => onChange("skills", data.skills.filter(x => x !== s))
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill() }
  }
  const suggestions = {
    developer:    ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    designer:     ["Figma", "Prototyping", "Design Systems", "Illustration", "Motion"],
    photographer: ["Portrait", "Lightroom", "Retouching", "Studio Lighting", "Commercial"],
    marketer:     ["SEO", "Paid Ads", "Email Marketing", "Content Strategy", "Analytics"],
    consultant:   ["Strategy", "Market Research", "Workshops", "OKRs", "Stakeholder Mgmt"],
    creator:      ["YouTube", "Short-Form Video", "Scripting", "Adobe Premiere", "TikTok"],
    writer:       ["Copywriting", "Storytelling", "Research", "Editing", "SEO Writing"],
    other:        ["Problem Solving", "Leadership", "Communication", "Research", "Strategy"],
  }
  const sugg = suggestions[data.professionCategory as keyof typeof suggestions] ?? suggestions.other

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">05 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">What are your skills?</h2>
        <p className="text-slate-400 text-sm">Type a skill and press Enter or comma to add it.</p>
      </div>
      <div className="flex gap-2">
        <input
          autoFocus
          value={data.skillInput}
          onChange={e => onChange("skillInput", e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. React, Figma, Python…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-violet-500/60 transition-colors"
        />
        <button
          onClick={addSkill}
          disabled={!data.skillInput.trim()}
          className="px-4 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm disabled:opacity-30 hover:bg-violet-500 transition-colors"
        >
          Add
        </button>
      </div>
      {data.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.skills.map(s => (
            <span key={s} className="flex items-center gap-1.5 text-sm text-violet-200 bg-violet-500/15 border border-violet-500/25 px-3 py-1.5 rounded-full">
              {s}
              <button onClick={() => removeSkill(s)} className="text-violet-400 hover:text-white">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div>
        <p className="text-slate-600 text-xs mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {sugg.filter(s => !data.skills.includes(s)).map(s => (
            <button
              key={s}
              onClick={() => onChange("skills", [...data.skills, s])}
              className="text-xs text-slate-400 border border-white/8 px-3 py-1.5 rounded-full hover:border-violet-500/40 hover:text-violet-300 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepProjects({ data, onChange }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void }) {
  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange("projects", data.projects.map(p => p.id === id ? { ...p, [field]: value } : p))
  }
  const addProject = () => onChange("projects", [...data.projects, emptyProject()])
  const removeProject = (id: string) => onChange("projects", data.projects.filter(p => p.id !== id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">06 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Your best work.</h2>
        <p className="text-slate-400 text-sm">Add 2–4 projects you&apos;re most proud of. You can always add more later.</p>
      </div>
      <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
        {data.projects.map((project, idx) => (
          <div key={project.id} className="bg-white/4 border border-white/8 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Project {idx + 1}</span>
              {data.projects.length > 1 && (
                <button onClick={() => removeProject(project.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <input
              value={project.title}
              onChange={e => updateProject(project.id, "title", e.target.value)}
              placeholder="Project name"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-violet-500/50 transition-colors"
            />
            <textarea
              value={project.description}
              onChange={e => updateProject(project.id, "description", e.target.value)}
              placeholder="What did you build, design, or solve? (1–2 sentences)"
              rows={2}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
            <div className="flex gap-2">
              <input
                value={project.tags}
                onChange={e => updateProject(project.id, "tags", e.target.value)}
                placeholder="Tags (comma-separated): React, Design, 2024"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-violet-500/50 transition-colors"
              />
              <input
                value={project.url}
                onChange={e => updateProject(project.id, "url", e.target.value)}
                placeholder="URL (optional)"
                className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
      {data.projects.length < 5 && (
        <button
          onClick={addProject}
          className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-200 transition-colors px-4 py-2 rounded-xl border border-dashed border-violet-500/25 hover:border-violet-500/50"
        >
          <Plus size={16} /> Add another project
        </button>
      )}
    </div>
  )
}

function StepSections({ data, onChange }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void }) {
  const toggle = (id: string) => {
    onChange("sections", data.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }
  const move = (id: string, dir: -1 | 1) => {
    const sorted = [...data.sections].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(s => s.id === id)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= sorted.length) return
    const updated = sorted.map(s => ({ ...s }))
    const temp = updated[idx].order
    updated[idx].order = updated[newIdx].order
    updated[newIdx].order = temp
    onChange("sections", updated)
  }

  const sorted = [...data.sections].sort((a, b) => a.order - b.order)
  const enabledCount = sorted.filter(s => s.enabled).length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">07 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Build your sections.</h2>
        <p className="text-slate-400 text-sm">Toggle sections on or off and arrange them in order. {enabledCount} selected.</p>
      </div>
      <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
        {sorted.map(s => (
          <div
            key={s.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
            style={{
              background: s.enabled ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.03)",
              borderColor: s.enabled ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)",
            }}
          >
            <button
              onClick={() => toggle(s.id)}
              className="shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all"
              style={{
                background: s.enabled ? "#7c3aed" : "transparent",
                borderColor: s.enabled ? "#7c3aed" : "rgba(255,255,255,0.2)",
              }}
            >
              {s.enabled && <Check size={11} className="text-white" />}
            </button>
            <span className="text-lg">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold ${s.enabled ? "text-white" : "text-slate-500"}`}>{s.label}</div>
              <div className="text-xs text-slate-600">{s.description}</div>
            </div>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => move(s.id, -1)} className="text-slate-600 hover:text-slate-300 transition-colors"><ChevronUp size={14} /></button>
              <button onClick={() => move(s.id, 1)} className="text-slate-600 hover:text-slate-300 transition-colors"><ChevronDown size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepStyle({ data, onChange }: { data: PortfolioData; onChange: (k: keyof PortfolioData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-violet-400 text-sm font-semibold mb-1">08 / {TOTAL_STEPS}</div>
        <h2 className="text-3xl font-bold text-white mb-2">Pick your visual vibe.</h2>
        <p className="text-slate-400 text-sm">Every theme is fully customizable after launch.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map(t => {
          const selected = data.theme === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange("theme", t.id)}
              className="text-left rounded-xl border overflow-hidden transition-all"
              style={{ borderColor: selected ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.08)", boxShadow: selected ? "0 0 0 2px rgba(124,58,237,0.3)" : "none" }}
            >
              {/* Mini preview */}
              <div className="h-20 p-3 flex flex-col gap-1.5" style={{ background: t.bg }}>
                <div className="flex items-center justify-between">
                  <div className="w-8 h-1.5 rounded-full" style={{ background: t.text, opacity: 0.8 }} />
                  <div className="w-4 h-1.5 rounded-full" style={{ background: t.accent }} />
                </div>
                <div className="w-20 h-2 rounded" style={{ background: t.text, opacity: 0.9 }} />
                <div className="w-14 h-1.5 rounded" style={{ background: t.text, opacity: 0.4 }} />
                <div className="flex gap-1.5 mt-auto">
                  <div className="w-8 h-1.5 rounded" style={{ background: t.accent }} />
                  <div className="w-8 h-1.5 rounded" style={{ background: t.border }} />
                </div>
              </div>
              <div className="px-3 py-2" style={{ background: selected ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)" }}>
                <div className={`text-sm font-semibold ${selected ? "text-violet-200" : "text-slate-300"}`}>{t.label}</div>
                <div className="text-xs text-slate-500">{t.description}</div>
              </div>
            </button>
          )
        })}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium mb-3">Accent colour</p>
        <div className="flex gap-3">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => onChange("accentColor", c.color)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                background: c.color,
                borderColor: data.accentColor === c.color ? "white" : "transparent",
                boxShadow: data.accentColor === c.color ? `0 0 0 1px ${c.color}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const INITIAL_DATA: PortfolioData = {
  name: "",
  professionCategory: "",
  professionTitle: "",
  tagline: "",
  bio: "",
  skillInput: "",
  skills: [],
  projects: [emptyProject()],
  sections: buildSections("other"),
  theme: "minimal",
  accentColor: "#7c3aed",
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function PortfolioNewPage() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA)
  const [showPreview, setShowPreview] = useState(false)

  const change = useCallback((key: keyof PortfolioData, value: unknown) => {
    setData(prev => {
      const next = { ...prev, [key]: value } as PortfolioData
      // Auto-rebuild sections when profession changes
      if (key === "professionCategory" && typeof value === "string") {
        next.sections = buildSections(value)
      }
      return next
    })
  }, [])

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) { setDir(1); setStep(s => s + 1) }
  }
  const goBack = () => {
    if (step > 0) { setDir(-1); setStep(s => s - 1) }
  }

  const canAdvance = () => {
    if (step === 0) return data.name.trim().length > 0
    if (step === 1) return data.professionCategory.length > 0
    return true
  }

  const steps = [
    <StepName      key="name"       data={data} onChange={change} onNext={goNext} />,
    <StepProfession key="profession" data={data} onChange={change} />,
    <StepTagline   key="tagline"    data={data} onChange={change} onNext={goNext} />,
    <StepBio       key="bio"        data={data} onChange={change} />,
    <StepSkills    key="skills"     data={data} onChange={change} />,
    <StepProjects  key="projects"   data={data} onChange={change} />,
    <StepSections  key="sections"   data={data} onChange={change} />,
    <StepStyle     key="style"      data={data} onChange={change} />,
  ]

  const progress = ((step) / (TOTAL_STEPS - 1)) * 100

  return (
    // Full-screen overlay — covers DashboardShell completely
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#07070a" }}>

      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-display, 'Space Grotesk', system-ui)" }}
          >
            BrandingOS
          </span>
          <span className="text-xs text-slate-500 hidden sm:block">Portfolio Builder</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  background: i < step ? "#7c3aed" : i === step ? "#a78bfa" : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {step + 1} / {TOTAL_STEPS}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(v => !v)}
            className="md:hidden flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/8 transition-colors"
          >
            <Eye size={14} /> Preview
          </button>
          <Link
            href="/dashboard/portfolio"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={14} /> Exit
          </Link>
        </div>
      </div>

      {/* Progress bar (mobile) */}
      <div className="h-0.5 shrink-0 bg-white/5">
        <div
          className="h-full bg-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — Question panel */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${showPreview ? "hidden" : "flex"} md:flex md:w-[55%]`}
          style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex-1 overflow-y-auto px-10 py-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {steps[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav footer */}
          <div
            className="flex items-center justify-between px-10 py-5 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 disabled:opacity-0 transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-3">
              {step < TOTAL_STEPS - 1 && !canAdvance() && (
                <span className="text-xs text-slate-600">
                  {step === 0 ? "Enter your name" : "Make a selection"}
                </span>
              )}
              {step < TOTAL_STEPS - 1 ? (
                <button
                  onClick={goNext}
                  disabled={!canAdvance()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
                  style={{
                    background: canAdvance() ? "#7c3aed" : "rgba(124,58,237,0.3)",
                    color: "white",
                    boxShadow: canAdvance() ? "0 0 20px rgba(124,58,237,0.4)" : "none",
                  }}
                >
                  {step === TOTAL_STEPS - 2 ? "Finish" : "Continue"}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#7c3aed", color: "white", boxShadow: "0 0 24px rgba(124,58,237,0.5)" }}
                >
                  <Sparkles size={16} /> Launch Portfolio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right — Live preview */}
        <div
          className={`flex-col overflow-hidden ${showPreview ? "flex flex-1" : "hidden"} md:flex md:flex-1`}
          style={{ background: "#0a0a0f" }}
        >
          <div className="flex items-center justify-between px-6 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="bg-white/6 border border-white/8 rounded-md px-3 py-1 flex items-center gap-2 ml-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 font-mono">
                  {data.name ? data.name.toLowerCase().replace(/\s+/g, "") : "yourname"}.brandingos.in
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Live preview</span>
              <ExternalLink size={12} className="text-slate-700" />
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-6">
            <div
              className="w-full h-full rounded-2xl overflow-hidden border"
              style={{ borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}
            >
              <AnimatePresence mode="sync">
                <motion.div
                  key={JSON.stringify({ name: data.name, tagline: data.tagline, theme: data.theme, accentColor: data.accentColor, bio: data.bio.slice(0, 50), skills: data.skills.length, projects: data.projects.filter(p => p.title).length, sections: data.sections.filter(s => s.enabled).map(s => s.id).join() })}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  <LivePreview data={data} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
