"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Reorder, useDragControls } from "framer-motion"
import {
  ArrowLeft, Save, Eye, EyeOff, GripVertical, Plus, Trash2,
  Loader2, Globe, Lock, Check, X, ChevronDown, ChevronUp,
  Palette, Layout, Settings2,
} from "lucide-react"
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer"

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionType =
  | "hero" | "about" | "skills" | "work" | "education" | "projects"
  | "integrations" | "testimonials" | "newsletter" | "booking" | "contact" | "custom"

type DbTheme = "minimal" | "modern" | "creative"

interface EditorSection {
  key:       string   // local uuid for Reorder key
  id?:       string   // DB id (undefined for new sections)
  type:      SectionType
  title:     string
  isVisible: boolean
  content:   Record<string, unknown>
}

interface EditorPortfolio {
  id:          string
  slug:        string
  title:       string | null
  tagline:     string | null
  bio:         string | null
  theme:       DbTheme
  isPublished: boolean
  settings:    Record<string, unknown> | null
}

interface Props {
  portfolio: EditorPortfolio
  sections:  Array<{
    id:        string
    type:      string
    title:     string | null
    isVisible: boolean
    content:   Record<string, unknown> | null
  }>
}

// ─── SECTION_TYPES palette ────────────────────────────────────────────────────

const AVAILABLE_SECTION_TYPES: { type: SectionType; label: string; icon: string; description: string }[] = [
  { type: "about",        label: "About",        icon: "👤", description: "Bio / intro text" },
  { type: "skills",       label: "Skills",       icon: "⚡", description: "Tag cloud of skills" },
  { type: "projects",     label: "Projects",     icon: "🗂️", description: "Portfolio projects" },
  { type: "work",         label: "Experience",   icon: "💼", description: "Work history" },
  { type: "education",    label: "Education",    icon: "🎓", description: "Degrees & courses" },
  { type: "testimonials", label: "Testimonials", icon: "💬", description: "Client quotes" },
  { type: "contact",      label: "Contact",      icon: "✉️",  description: "Contact form" },
  { type: "custom",       label: "Custom",       icon: "✏️",  description: "Free-form section" },
]

const THEME_OPTIONS: { value: DbTheme; label: string; description: string }[] = [
  { value: "minimal",  label: "Minimal",  description: "Clean typography, white bg" },
  { value: "modern",   label: "Modern",   description: "Dark mode, card grid" },
  { value: "creative", label: "Creative", description: "Bold editorial hero" },
]

const ACCENT_PRESETS = [
  "#7c3aed", "#2563eb", "#0891b2", "#059669",
  "#d97706", "#dc2626", "#db2777", "#4f46e5",
]

// ─── Section drag handle ─────────────────────────────────────────────────────

function DragHandle() {
  const controls = useDragControls()
  return (
    <div
      onPointerDown={(e) => controls.start(e)}
      className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none"
    >
      <GripVertical size={16} />
    </div>
  )
}

// ─── Project list editor ──────────────────────────────────────────────────────

interface Project { title: string; description: string; url: string; tags: string }

function ProjectsEditor({
  projects, onChange,
}: { projects: Project[]; onChange: (p: Project[]) => void }) {
  const add = () => onChange([...projects, { title: "", description: "", url: "", tags: "" }])
  const remove = (i: number) => onChange(projects.filter((_, j) => j !== i))
  const update = (i: number, field: keyof Project, val: string) =>
    onChange(projects.map((p, j) => j === i ? { ...p, [field]: val } : p))

  return (
    <div className="space-y-3">
      {projects.map((p, i) => (
        <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Project {i + 1}</span>
            <button onClick={() => remove(i)} className="text-slate-300 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </div>
          <input
            placeholder="Project title"
            value={p.title}
            onChange={e => update(i, "title", e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <textarea
            placeholder="Description"
            rows={2}
            value={p.description}
            onChange={e => update(i, "description", e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
          />
          <input
            placeholder="URL (optional)"
            value={p.url}
            onChange={e => update(i, "url", e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <input
            placeholder="Tags (comma-separated)"
            value={p.tags}
            onChange={e => update(i, "tags", e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
      ))}
      <button
        onClick={add}
        className="w-full text-xs font-semibold text-violet-500 hover:text-violet-700 border-2 border-dashed border-violet-200 hover:border-violet-300 rounded-xl py-2 transition-colors"
      >
        + Add Project
      </button>
    </div>
  )
}

// ─── Skills chip editor ───────────────────────────────────────────────────────

function SkillsEditor({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState("")

  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !skills.includes(trimmed)) onChange([...skills, trimmed])
    setInput("")
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-8">
        {skills.map(sk => (
          <span key={sk} className="inline-flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">
            {sk}
            <button onClick={() => onChange(skills.filter(s => s !== sk))} className="hover:text-red-500 transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add() } }}
          placeholder="Add a skill, press Enter"
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
        <button
          onClick={add}
          className="px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-semibold rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  )
}

// ─── Single section card ──────────────────────────────────────────────────────

function SectionCard({
  section, expanded, onToggleExpand, onToggleVisible, onRemove, onUpdate,
}: {
  section:        EditorSection
  expanded:       boolean
  onToggleExpand: () => void
  onToggleVisible: () => void
  onRemove:       () => void
  onUpdate:       (content: Record<string, unknown>) => void
}) {
  const icon = AVAILABLE_SECTION_TYPES.find(t => t.type === section.type)?.icon ?? "📝"

  return (
    <div className={`rounded-xl border transition-all ${expanded ? "border-violet-300 shadow-sm shadow-violet-100" : "border-slate-200"} bg-white`}>
      {/* Header row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <DragHandle />
        <span className="text-base">{icon}</span>
        <span className="flex-1 text-sm font-semibold text-slate-700 truncate">{section.title}</span>
        <button
          onClick={onToggleVisible}
          className={`p-1 rounded-lg transition-colors ${section.isVisible ? "text-slate-400 hover:text-slate-600" : "text-slate-200 hover:text-slate-400"}`}
          title={section.isVisible ? "Hide section" : "Show section"}
        >
          {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button
          onClick={onToggleExpand}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          onClick={onRemove}
          className="p-1 rounded-lg text-slate-200 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Editor body */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-100 pt-3">
          {section.type === "skills" && (
            <SkillsEditor
              skills={(section.content.skills as string[] | undefined) ?? []}
              onChange={skills => onUpdate({ ...section.content, skills })}
            />
          )}
          {section.type === "projects" && (
            <ProjectsEditor
              projects={(section.content.projects as Project[] | undefined) ?? []}
              onChange={projects => onUpdate({ ...section.content, projects })}
            />
          )}
          {section.type === "about" && (
            <p className="text-xs text-slate-400">
              About text comes from the bio in the Design tab.
            </p>
          )}
          {section.type === "contact" && (
            <p className="text-xs text-slate-400">
              A contact form is auto-rendered — no content to configure.
            </p>
          )}
          {(section.type === "hero") && (
            <p className="text-xs text-slate-400">
              Hero content (name, title, tagline) is set in the Design tab.
            </p>
          )}
          {!["skills","projects","about","contact","hero"].includes(section.type) && (
            <p className="text-xs text-slate-400 italic">
              Custom content editor coming soon.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Add section sheet ────────────────────────────────────────────────────────

function AddSectionSheet({
  onAdd, onClose,
}: { onAdd: (type: SectionType) => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="font-bold text-sm text-slate-800">Add Section</h3>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
        {AVAILABLE_SECTION_TYPES.map(t => (
          <button
            key={t.type}
            onClick={() => { onAdd(t.type); onClose() }}
            className="text-left p-3 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
          >
            <div className="text-xl mb-1">{t.icon}</div>
            <div className="text-xs font-bold text-slate-700">{t.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{t.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Editor ─────────────────────────────────────────────────────────────

export default function PortfolioEditor({ portfolio: initial, sections: initialSections }: Props) {
  const [tab, setTab] = useState<"sections" | "design">("sections")
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [expandedKey,  setExpandedKey]  = useState<string | null>(null)

  // ── Draft state ──────────────────────────────────────────────────────────
  const [title,       setTitle]       = useState(initial.title ?? "")
  const [tagline,     setTagline]     = useState(initial.tagline ?? "")
  const [bio,         setBio]         = useState(initial.bio ?? "")
  const [theme,       setTheme]       = useState<DbTheme>(initial.theme)
  const [isPublished, setIsPublished] = useState(initial.isPublished)
  const [accentColor, setAccentColor] = useState(
    (initial.settings?.accentColor as string | undefined) ?? "#7c3aed"
  )
  const [professionTitle, setProfessionTitle] = useState(
    (initial.settings?.professionTitle as string | undefined) ?? ""
  )

  const [sections, setSections] = useState<EditorSection[]>(() =>
    initialSections.map(s => ({
      key:       s.id,
      id:        s.id,
      type:      s.type as SectionType,
      title:     s.title ?? s.type,
      isVisible: s.isVisible,
      content:   s.content ?? {},
    }))
  )

  // ── Helpers ──────────────────────────────────────────────────────────────

  const toggleExpand = useCallback((key: string) =>
    setExpandedKey(prev => prev === key ? null : key), [])

  const addSection = (type: SectionType) => {
    const info  = AVAILABLE_SECTION_TYPES.find(t => t.type === type)
    const newSec: EditorSection = {
      key:       `new-${Date.now()}`,
      type,
      title:     info?.label ?? type,
      isVisible: true,
      content:   {},
    }
    setSections(prev => [...prev, newSec])
    setExpandedKey(newSec.key)
  }

  const removeSection = (key: string) =>
    setSections(prev => prev.filter(s => s.key !== key))

  const updateContent = (key: string, content: Record<string, unknown>) =>
    setSections(prev => prev.map(s => s.key === key ? { ...s, content } : s))

  const toggleVisible = (key: string) =>
    setSections(prev => prev.map(s => s.key === key ? { ...s, isVisible: !s.isVisible } : s))

  // ── Save ─────────────────────────────────────────────────────────────────

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const [metaRes, sectRes] = await Promise.all([
        fetch(`/api/portfolio/${initial.id}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            title, tagline, bio, theme, isPublished,
            settings: { accentColor, professionTitle, skills: [] },
          }),
        }),
        fetch(`/api/portfolio/${initial.id}/sections`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            sections: sections.map((s, i) => ({
              type:      s.type,
              title:     s.title,
              order:     i + 1,
              isVisible: s.isVisible,
              content:   s.content,
            })),
          }),
        }),
      ])
      if (metaRes.ok && sectRes.ok) setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  // ── Preview data ──────────────────────────────────────────────────────────

  const previewPortfolio = {
    id:          initial.id,
    slug:        initial.slug,
    title,
    tagline,
    bio,
    theme,
    isPublished,
    settings:    { accentColor, professionTitle, skills: [] },
  }

  const previewSections = sections
    .filter(s => s.isVisible)
    .map(s => ({
      id:        s.key,
      type:      s.type,
      title:     s.title,
      isVisible: s.isVisible,
      content:   s.content,
    }))

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-100 shrink-0 bg-white/95 backdrop-blur z-20">
        <Link href="/dashboard/portfolio" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft size={16} />
        </Link>

        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="font-bold text-sm text-slate-900 bg-transparent border-none outline-none w-full truncate placeholder:text-slate-300"
            placeholder="Portfolio title"
          />
        </div>

        <a
          href={`/p/${initial.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
        >
          <Eye size={14} /> Preview
        </a>

        {/* Publish toggle */}
        <button
          onClick={() => setIsPublished(p => !p)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            isPublished
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          {isPublished ? <><Globe size={12} /> Live</> : <><Lock size={12} /> Draft</>}
        </button>

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all disabled:opacity-70"
          style={{ background: accentColor }}
        >
          {saving
            ? <Loader2 size={14} className="animate-spin" />
            : saved ? <Check size={14} /> : <Save size={14} />
          }
          {saving ? "Saving…" : saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="w-[380px] shrink-0 flex flex-col border-r border-slate-100 bg-slate-50 relative">
          {/* Tab bar */}
          <div className="flex border-b border-slate-100 bg-white shrink-0">
            {[
              { key: "sections", icon: <Layout size={14} />,   label: "Sections" },
              { key: "design",   icon: <Palette size={14} />,  label: "Design"   },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as "sections" | "design")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
                  tab === t.key
                    ? "border-violet-500 text-violet-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {tab === "sections" && (
              <div className="p-3 space-y-2">
                <Reorder.Group
                  axis="y"
                  values={sections}
                  onReorder={setSections}
                  className="space-y-2"
                >
                  {sections.map(s => (
                    <Reorder.Item key={s.key} value={s} className="list-none">
                      <SectionCard
                        section={s}
                        expanded={expandedKey === s.key}
                        onToggleExpand={() => toggleExpand(s.key)}
                        onToggleVisible={() => toggleVisible(s.key)}
                        onRemove={() => removeSection(s.key)}
                        onUpdate={content => updateContent(s.key, content)}
                      />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                <button
                  onClick={() => setShowAddSheet(true)}
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-violet-600 border-2 border-dashed border-slate-200 hover:border-violet-200 rounded-xl py-3 transition-all mt-1"
                >
                  <Plus size={14} /> Add Section
                </button>
              </div>
            )}

            {tab === "design" && (
              <div className="p-4 space-y-6">
                {/* Meta */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Settings2 size={12} /> Identity
                  </h3>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1">Profession / Title</label>
                    <input
                      value={professionTitle}
                      onChange={e => setProfessionTitle(e.target.value)}
                      placeholder="e.g. Full-Stack Developer"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1">Tagline</label>
                    <input
                      value={tagline}
                      onChange={e => setTagline(e.target.value)}
                      placeholder="One-liner that sells you"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1">Bio</label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell your story…"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
                    />
                  </div>
                </div>

                {/* Template */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Layout size={12} /> Template
                  </h3>
                  {THEME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all ${
                        theme === opt.value
                          ? "border-violet-400 bg-violet-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
                        {theme === opt.value && <Check size={14} className="text-violet-500" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                    </button>
                  ))}
                </div>

                {/* Accent */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Palette size={12} /> Accent Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_PRESETS.map(c => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === c ? "border-slate-900 scale-110" : "border-transparent"}`}
                        style={{ background: c }}
                      />
                    ))}
                    <label className="w-8 h-8 rounded-full border-2 border-slate-200 cursor-pointer overflow-hidden relative" title="Custom color">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={e => setAccentColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className="w-full h-full rounded-full" style={{ background: accentColor }} />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">Selected: {accentColor}</p>
                </div>
              </div>
            )}
          </div>

          {/* Add section sheet overlay */}
          {showAddSheet && (
            <AddSectionSheet onAdd={addSection} onClose={() => setShowAddSheet(false)} />
          )}
        </div>

        {/* Right: live preview */}
        <div className="flex-1 min-w-0 overflow-auto bg-slate-100">
          <div className="min-h-full">
            <div
              className="origin-top-left bg-white shadow-2xl transition-all"
              style={{
                width:     "100%",
                minHeight: "100%",
              }}
            >
              <PortfolioRenderer
                portfolio={previewPortfolio}
                sections={previewSections}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
