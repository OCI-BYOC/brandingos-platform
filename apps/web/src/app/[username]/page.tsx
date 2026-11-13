import { notFound } from "next/navigation"
import Link from "next/link"
import { Globe, Twitter, Linkedin, ShoppingBag, BookOpen, Mail } from "lucide-react"

const MOCK_CREATORS: Record<string, {
  name: string; bio: string; avatar: string; location: string; role: string;
  skills: string[]; socials: { twitter?: string; linkedin?: string; website?: string; email?: string };
  products: { title: string; price: number; type: string }[];
  courses: { title: string; price: number; students: number }[];
}> = {
  "alex-chen": {
    name: "Alex Chen",
    bio: "UI/UX Designer & Brand Strategist. I help early-stage startups build beautiful digital products that people love. 5+ years of experience, 50+ projects shipped.",
    avatar: "AC",
    location: "Mumbai, India",
    role: "Design Lead @ Startup",
    skills: ["Figma", "Branding", "Design Systems", "React", "Framer", "Motion Design"],
    socials: { twitter: "@alexchendesign", linkedin: "alex-chen", email: "alex@alexchen.in" },
    products: [
      { title: "UI Design System — Figma Kit", price: 1999, type: "digital" },
      { title: "Brand Identity Template Pack",  price: 2999, type: "digital" },
    ],
    courses: [
      { title: "UI/UX Design Masterclass 2025",         price: 2999, students: 342 },
      { title: "Freelancing Blueprint: Land ₹1L/month", price: 2999, students: 189 },
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
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight text-slate-900">{creator.name}</span>
        <div className="flex gap-1">
          {["About", "Products", "Courses", "Contact"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-200">
            {creator.avatar}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{creator.name}</h1>
            <p className="text-slate-500 text-sm mb-1">{creator.role}</p>
            <p className="text-slate-400 text-xs">{creator.location}</p>
          </div>
          <p className="text-slate-600 text-base leading-relaxed max-w-xl">{creator.bio}</p>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2">
            {creator.skills.map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500">{s}</span>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            {creator.socials.twitter && (
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Twitter size={15} className="text-slate-500" />
              </a>
            )}
            {creator.socials.linkedin && (
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Linkedin size={15} className="text-slate-500" />
              </a>
            )}
            {creator.socials.email && (
              <a href={`mailto:${creator.socials.email}`} className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Mail size={15} className="text-slate-500" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag size={18} className="text-violet-500" />
          <h2 className="text-lg font-semibold text-slate-900">Products</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {creator.products.map((p) => (
            <div key={p.title} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">{p.type}</span>
                <p className="text-sm font-bold text-violet-600">₹{p.price.toLocaleString("en-IN")}</p>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-4 leading-snug">{p.title}</h3>
              <button className="w-full py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={18} className="text-cyan-500" />
          <h2 className="text-lg font-semibold text-slate-900">Courses</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {creator.courses.map((c) => (
            <div key={c.title} className="card card-hover p-5">
              <h3 className="font-semibold text-sm text-slate-900 mb-2 leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{c.students} students enrolled</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-cyan-600">₹{c.price.toLocaleString("en-IN")}</p>
                <button className="text-xs px-4 py-1.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 transition-colors font-medium">
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="max-w-3xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Work with {creator.name.split(" ")[0]}</h2>
          <p className="text-slate-500 text-sm mb-7 max-w-md mx-auto">Interested in a collaboration or custom project? Send a message and I&apos;ll get back within 24 hours.</p>
          <a href={`mailto:${creator.socials.email}`} className="inline-flex items-center gap-2 btn-primary px-8 py-3 rounded-xl text-sm">
            <Mail size={15} /> Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-6 text-center">
        <p className="text-xs text-slate-300">
          Powered by{" "}
          <Link href="/" className="text-violet-400 hover:text-violet-600 transition-colors">BrandingOS</Link>
        </p>
      </footer>
    </div>
  )
}
