"use client"

import { useState } from "react"
import { Mail, ExternalLink, Github, Linkedin, Twitter } from "lucide-react"

type PortfolioTheme = "minimal" | "modern" | "creative"

interface PortfolioSettings {
  professionTitle?: string
  accentColor?: string
  skills?: string[]
}

interface Portfolio {
  id: string
  slug: string
  title: string | null
  tagline?: string | null
  bio?: string | null
  theme: PortfolioTheme
  settings?: Record<string, unknown> | null
}

interface Section {
  id: string
  type: string
  title: string | null
  content: Record<string, unknown> | null
}

interface Props {
  portfolio: Portfolio
  sections: Section[]
}

// ─── Contact Form ────────────────────────────────────────────────────────────

function ContactForm({ slug, accent }: { slug: string; accent: string }) {
  const [form,    setForm]    = useState({ name: "", email: "", message: "" })
  const [status,  setStatus]  = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch(`/api/public/portfolio/${slug}/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") return (
    <p className="text-center py-8 text-green-600 font-medium">
      Message sent! I&apos;ll get back to you soon.
    </p>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 opacity-60">Name</label>
          <input
            required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": accent } as React.CSSProperties}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 opacity-60">Email</label>
          <input
            required type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1 opacity-60">Message</label>
        <textarea
          required rows={5} value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-xs text-red-500">Something went wrong — please try again.</p>
      )}
      <button
        type="submit" disabled={status === "sending"}
        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70 transition-opacity"
        style={{ background: accent }}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  )
}

// ─── Minimal Template ────────────────────────────────────────────────────────

function MinimalPortfolio({ portfolio, sections }: Props) {
  const settings = (portfolio.settings ?? {}) as PortfolioSettings
  const accent   = settings.accentColor ?? "#7c3aed"
  const skills   = (settings.skills ?? []) as string[]
  const displayTitle = portfolio.title ?? "Portfolio"

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: accent }}>{displayTitle}</span>
          <a href="#contact" className="text-xs font-semibold px-4 py-1.5 rounded-full text-white" style={{ background: accent }}>
            Contact
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-24">
        {/* Hero */}
        <section>
          {settings.professionTitle && (
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: accent }}>
              {settings.professionTitle}
            </p>
          )}
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">{displayTitle}</h1>
          {portfolio.tagline && (
            <p className="text-xl text-slate-500 leading-relaxed mb-8">{portfolio.tagline}</p>
          )}
          {portfolio.bio && (
            <p className="text-slate-600 leading-relaxed max-w-2xl">{portfolio.bio}</p>
          )}
        </section>

        {/* Dynamic sections */}
        {sections.map(s => {
          if (s.type === "skills" || s.id === "skills") {
            const sectionSkills = (((s.content ?? {}) as { skills?: string[] }).skills ?? skills)
            return (
              <section key={s.id}>
                <h2 className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: accent }}>{s.title ?? "Skills"}</h2>
                <div className="flex flex-wrap gap-2">
                  {sectionSkills.map((sk: string) => (
                    <span key={sk} className="text-sm px-3 py-1 rounded-full border border-slate-200 text-slate-600">{sk}</span>
                  ))}
                </div>
              </section>
            )
          }

          if (s.type === "projects") {
            type Project = { title?: string; description?: string; url?: string; tags?: string }
            const projects = (((s.content ?? {}) as { projects?: Project[] }).projects ?? [])
            return (
              <section key={s.id}>
                <h2 className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: accent }}>{s.title ?? "Projects"}</h2>
                <div className="space-y-6">
                  {projects.map((p: Project, i: number) => (
                    <div key={i} className="border-t border-slate-100 pt-6 flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1">{p.title}</h3>
                        {p.description && <p className="text-sm text-slate-500">{p.description}</p>}
                        {p.tags && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {p.tags.split(",").map((t: string) => (
                              <span key={t} className="text-[11px] text-slate-400">{t.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer" className="shrink-0">
                          <ExternalLink size={16} className="text-slate-300 hover:text-slate-600 transition-colors" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (s.type === "about" && portfolio.bio) {
            return (
              <section key={s.id}>
                <h2 className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: accent }}>{s.title ?? "About"}</h2>
                <p className="text-slate-600 leading-relaxed">{portfolio.bio}</p>
              </section>
            )
          }

          return null
        })}

        {/* Contact */}
        <section id="contact">
          <h2 className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: accent }}>Contact</h2>
          <ContactForm slug={portfolio.slug} accent={accent} />
        </section>
      </main>

      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        Built with BrandingOS
      </footer>
    </div>
  )
}

// ─── Modern Template ─────────────────────────────────────────────────────────

function ModernPortfolio({ portfolio, sections }: Props) {
  const settings = (portfolio.settings ?? {}) as PortfolioSettings
  const accent   = settings.accentColor ?? "#7c3aed"
  const skills   = (settings.skills ?? []) as string[]
  const displayTitle = portfolio.title ?? "Portfolio"

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
          <span className="font-bold tracking-tight" style={{ color: accent }}>{displayTitle}</span>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-80" style={{ background: accent }}>
              Hire Me
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-8 py-32">
          <p className="text-sm font-semibold mb-4" style={{ color: accent }}>
            {settings.professionTitle ?? "Professional"}
          </p>
          <h1 className="text-6xl font-extrabold tracking-tight mb-6 leading-none">
            {displayTitle}
          </h1>
          {portfolio.tagline && (
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-10">{portfolio.tagline}</p>
          )}
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl text-white transition-opacity hover:opacity-80" style={{ background: accent }}>
            <Mail size={16} /> Get in Touch
          </a>
        </section>

        {/* Skills strip */}
        {skills.length > 0 && (
          <div className="border-y border-slate-800 py-6 overflow-hidden">
            <div className="flex gap-8 items-center px-8 max-w-5xl mx-auto flex-wrap">
              {skills.map((s: string) => (
                <span key={s} className="text-slate-500 text-sm font-medium whitespace-nowrap">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic sections */}
        {sections.map(s => {
          if (s.type === "projects") {
            type Project = { title?: string; description?: string; url?: string; tags?: string }
            const projects = (((s.content ?? {}) as { projects?: Project[] }).projects ?? [])
            return (
              <section key={s.id} id="work" className="max-w-5xl mx-auto px-8 py-24">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-12">{s.title ?? "Projects"}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((p: Project, i: number) => (
                    <div key={i} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-600 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white">{p.title}</h3>
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer">
                            <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                          </a>
                        )}
                      </div>
                      {p.description && <p className="text-sm text-slate-400 leading-relaxed mb-4">{p.description}</p>}
                      {p.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {p.tags.split(",").map((t: string) => (
                            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (s.type === "about" || s.type === "skills") {
            return (
              <section key={s.id} id="about" className="max-w-5xl mx-auto px-8 py-16 border-t border-slate-800">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-6">{s.title ?? s.type}</h2>
                {s.type === "about" && portfolio.bio && (
                  <p className="text-slate-400 leading-relaxed max-w-2xl">{portfolio.bio}</p>
                )}
                {s.type === "skills" && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((sk: string) => (
                      <span key={sk} className="text-sm px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">{sk}</span>
                    ))}
                  </div>
                )}
              </section>
            )
          }

          return null
        })}

        {/* Contact */}
        <section id="contact" className="max-w-5xl mx-auto px-8 py-24 border-t border-slate-800">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Contact</h2>
          <h3 className="text-3xl font-bold mb-10">Let&apos;s work together</h3>
          <div className="text-slate-400">
            <ContactForm slug={portfolio.slug} accent={accent} />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-600">
        Built with BrandingOS
      </footer>
    </div>
  )
}

// ─── Creative Template ───────────────────────────────────────────────────────

function CreativePortfolio({ portfolio, sections }: Props) {
  const settings = (portfolio.settings ?? {}) as PortfolioSettings
  const accent   = settings.accentColor ?? "#7c3aed"
  const skills   = (settings.skills ?? []) as string[]
  const displayTitle = portfolio.title ?? "Portfolio"

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Full-bleed hero */}
      <section className="relative min-h-screen flex flex-col justify-end px-10 py-16"
        style={{ background: `linear-gradient(135deg, ${accent}22 0%, transparent 60%)` }}
      >
        <div className="absolute top-8 left-10 right-10 flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>{settings.professionTitle ?? "Portfolio"}</span>
          <a href="#contact" className="text-xs font-semibold px-4 py-2 rounded-full border-2 transition-colors hover:text-white"
            style={{ borderColor: accent, color: accent, ["--hover-bg" as string]: accent }}
          >
            Work with me
          </a>
        </div>

        <div>
          <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-none tracking-tighter mb-6">
            {displayTitle}
          </h1>
          {portfolio.tagline && (
            <p className="text-xl text-zinc-500 max-w-xl leading-relaxed">{portfolio.tagline}</p>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <div className="w-px h-16 bg-zinc-900" />
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-10 space-y-32 py-24">
        {/* Dynamic sections */}
        {sections.map(s => {
          if (s.type === "projects") {
            type Project = { title?: string; description?: string; url?: string; tags?: string }
            const projects = (((s.content ?? {}) as { projects?: Project[] }).projects ?? [])
            return (
              <section key={s.id}>
                <div className="flex items-baseline justify-between mb-12">
                  <h2 className="text-4xl font-black">{s.title ?? "Projects"}</h2>
                  <span className="text-sm text-zinc-400">{projects.length} projects</span>
                </div>
                <div className="space-y-1">
                  {projects.map((p: Project, i: number) => (
                    <div key={i} className="group flex items-center justify-between py-6 border-b border-zinc-200 hover:pl-4 transition-all">
                      <div className="flex items-center gap-6">
                        <span className="text-xs text-zinc-400 w-6 shrink-0">0{i + 1}</span>
                        <div>
                          <h3 className="font-bold text-xl">{p.title}</h3>
                          {p.description && <p className="text-sm text-zinc-500 mt-0.5">{p.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {p.tags && (
                          <span className="hidden sm:block text-xs text-zinc-400">{p.tags.split(",")[0]?.trim()}</span>
                        )}
                        {p.url ? (
                          <a href={p.url} target="_blank" rel="noreferrer"
                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors"
                            style={{ borderColor: accent, color: accent }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-zinc-200 flex items-center justify-center opacity-30">
                            <ExternalLink size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (s.type === "skills") {
            return (
              <section key={s.id}>
                <h2 className="text-4xl font-black mb-12">{s.title ?? "Skills"}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {skills.map((sk: string) => (
                    <div key={sk} className="p-4 rounded-2xl bg-white border border-zinc-200 font-semibold text-sm text-zinc-700">
                      {sk}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (s.type === "about" && portfolio.bio) {
            return (
              <section key={s.id} className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-black mb-6">{s.title ?? "About"}</h2>
                  <p className="text-zinc-600 leading-relaxed text-lg">{portfolio.bio}</p>
                </div>
                <div className="h-64 rounded-3xl" style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}11)` }} />
              </section>
            )
          }

          return null
        })}

        {/* Contact */}
        <section id="contact" className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: `${accent}15`, color: accent }}>
            <Mail size={12} /> Say Hello
          </div>
          <h2 className="text-5xl font-black mb-4">Let&apos;s create something</h2>
          <p className="text-zinc-500 mb-12 text-lg">amazing together</p>
          <div className="text-left">
            <ContactForm slug={portfolio.slug} accent={accent} />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-10 px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>© {new Date().getFullYear()} {displayTitle}</span>
          <div className="flex gap-4">
            <Github size={14} className="cursor-pointer hover:text-zinc-700 transition-colors" />
            <Linkedin size={14} className="cursor-pointer hover:text-zinc-700 transition-colors" />
            <Twitter size={14} className="cursor-pointer hover:text-zinc-700 transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Router ──────────────────────────────────────────────────────────────────

export default function PortfolioRenderer({ portfolio, sections }: Props) {
  switch (portfolio.theme) {
    case "modern":
      return <ModernPortfolio portfolio={portfolio} sections={sections} />
    case "creative":
      return <CreativePortfolio portfolio={portfolio} sections={sections} />
    default:
      return <MinimalPortfolio portfolio={portfolio} sections={sections} />
  }
}
