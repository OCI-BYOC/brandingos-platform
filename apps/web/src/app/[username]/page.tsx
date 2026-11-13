import { notFound } from "next/navigation"
import Link from "next/link"
import { Globe, Twitter, Linkedin, ShoppingBag, BookOpen, Mail, Star, Users, ArrowRight, Download, Package } from "lucide-react"

const MOCK_CREATORS: Record<string, {
  name: string; bio: string; avatar: string; location: string; role: string;
  skills: string[]; socials: { twitter?: string; linkedin?: string; website?: string; email?: string };
  products: { title: string; price: number; type: string; desc: string; sales?: number }[];
  courses: { title: string; price: number; students: number; rating: number; lessons: number }[];
  stats: { label: string; value: string }[];
}> = {
  "alex-chen": {
    name: "Alex Chen",
    bio: "UI/UX Designer & Brand Strategist. I help early-stage startups build beautiful digital products that people love. 5+ years of experience, 50+ projects shipped.",
    avatar: "AC",
    location: "Mumbai, India",
    role: "Design Lead @ Startup",
    skills: ["Figma", "Branding", "Design Systems", "React", "Framer", "Motion Design"],
    socials: { twitter: "@alexchendesign", linkedin: "alex-chen", website: "alexchen.in", email: "alex@alexchen.in" },
    products: [
      { title: "UI Design System — Figma Kit", price: 1999, type: "Digital", desc: "Complete design system with 400+ components, tokens, and documentation ready to ship.", sales: 47 },
      { title: "Brand Identity Template Pack",  price: 2999, type: "Digital", desc: "10 fully customizable brand identity templates with logo, colors, and typography.", sales: 23 },
    ],
    courses: [
      { title: "UI/UX Design Masterclass 2025", price: 2999, students: 342, rating: 4.9, lessons: 48 },
      { title: "Freelancing Blueprint: Land ₹1L/month", price: 2999, students: 189, rating: 4.8, lessons: 32 },
    ],
    stats: [
      { label: "Projects shipped", value: "50+" },
      { label: "Happy clients", value: "38" },
      { label: "Students taught", value: "531" },
      { label: "Years of experience", value: "5" },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const creator = MOCK_CREATORS[username]
  if (!creator) return { title: "Creator not found" }
  return { title: `${creator.name} — BrandingOS`, description: creator.bio }
}

export default async function CreatorPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const creator = MOCK_CREATORS[username]
  if (!creator) notFound()

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              {creator.avatar}
            </div>
            <span className="text-sm font-semibold text-slate-900">{creator.name}</span>
          </div>
          <div className="flex gap-1">
            {["About", "Products", "Courses", "Contact"].map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`} className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium">
                {s}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="relative overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-100 blur-[80px] opacity-50" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-cyan-100 blur-[80px] opacity-40" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-14">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-violet-200">
                {creator.avatar}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">✓</span>
              </div>
            </div>

            {/* Identity */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-4xl font-bold text-slate-900">{creator.name}</h1>
              </div>
              <p className="text-slate-500 font-medium mb-1">{creator.role}</p>
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-sm">
                <Globe size={12} />
                <span>{creator.location}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-slate-600 text-base leading-relaxed max-w-xl">{creator.bio}</p>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2">
              {creator.skills.map((s) => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium shadow-sm hover:border-violet-300 hover:text-violet-600 transition-colors cursor-default">
                  {s}
                </span>
              ))}
            </div>

            {/* Socials + CTA */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              {creator.socials.twitter && (
                <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                  <Twitter size={14} /> {creator.socials.twitter}
                </a>
              )}
              {creator.socials.linkedin && (
                <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                  <Linkedin size={14} /> LinkedIn
                </a>
              )}
              {creator.socials.email && (
                <a href={`mailto:${creator.socials.email}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm shadow-md shadow-violet-200">
                  <Mail size={14} /> Get in Touch
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-y border-slate-100 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {creator.stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <section id="products" className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <ShoppingBag size={16} className="text-violet-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Products</h2>
              <p className="text-xs text-slate-400">{creator.products.length} digital products</p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {creator.products.map((p) => (
            <div key={p.title} className="card card-hover p-6 flex flex-col gap-4">
              {/* Product cover */}
              <div className="h-32 rounded-xl bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 border border-violet-100 flex items-center justify-center">
                <Package size={36} className="text-violet-200" />
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 font-medium border border-violet-100">{p.type}</span>
                  {p.sales && (
                    <span className="text-xs text-slate-400">{p.sales} sales</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <p className="text-xl font-bold text-violet-600">₹{p.price.toLocaleString("en-IN")}</p>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm shadow-violet-200">
                  <Download size={14} /> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
            <BookOpen size={16} className="text-cyan-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Courses</h2>
            <p className="text-xs text-slate-400">{creator.courses.reduce((s, c) => s + c.students, 0)} students enrolled</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {creator.courses.map((c) => (
            <div key={c.title} className="card card-hover p-6">
              {/* Cover gradient */}
              <div className="h-24 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100 mb-4 flex items-center justify-center">
                <BookOpen size={28} className="text-cyan-300" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 leading-snug">{c.title}</h3>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" /> {c.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={11} /> {c.students.toLocaleString()} students
                </span>
                <span>{c.lessons} lessons</span>
              </div>

              {/* Rating bar */}
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${(c.rating / 5) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-cyan-600">₹{c.price.toLocaleString("en-IN")}</p>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors">
                  Enroll <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%)" }} />
          <div className="relative px-10 py-14 text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Mail size={22} />
            </div>
            <h2 className="text-3xl font-bold mb-3">Work with {creator.name.split(" ")[0]}</h2>
            <p className="text-violet-200 max-w-sm mx-auto mb-8 leading-relaxed">
              Interested in a collaboration or custom project? Send a message and I&apos;ll get back within 24 hours.
            </p>
            <a
              href={`mailto:${creator.socials.email}`}
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-violet-50 transition-colors shadow-xl text-sm"
            >
              <Mail size={15} /> Send a message
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-7">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">© 2025 {creator.name}. All rights reserved.</p>
          <p className="text-xs text-slate-300">
            Powered by{" "}
            <Link href="/" className="text-violet-400 hover:text-violet-600 transition-colors font-medium">BrandingOS</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
