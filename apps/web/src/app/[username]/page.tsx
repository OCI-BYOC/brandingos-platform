import { notFound } from "next/navigation"
import Link from "next/link"
import { Globe, Twitter, Linkedin, ShoppingBag, BookOpen, Mail } from "lucide-react"

// Dummy data — replace with real DB query when API is wired
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
    <div className="min-h-screen bg-[#06060f] text-white">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 bg-[#06060f]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">{creator.name}</span>
        <div className="flex gap-1">
          {["About", "Products", "Courses", "Contact"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} className="text-xs px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors">
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/20">
            {creator.avatar}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{creator.name}</h1>
            <p className="text-white/50 text-sm mb-1">{creator.role}</p>
            <p className="text-white/30 text-xs">{creator.location}</p>
          </div>
          <p className="text-white/60 text-base leading-relaxed max-w-xl">{creator.bio}</p>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2">
            {creator.skills.map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/60">{s}</span>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            {creator.socials.twitter && (
              <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter size={15} className="text-white/50" />
              </a>
            )}
            {creator.socials.linkedin && (
              <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin size={15} className="text-white/50" />
              </a>
            )}
            {creator.socials.email && (
              <a href={`mailto:${creator.socials.email}`} className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Mail size={15} className="text-white/50" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag size={18} className="text-purple-400" />
          <h2 className="text-lg font-semibold">Products</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {creator.products.map((p) => (
            <div key={p.title} className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-5 hover:border-purple-500/30 hover:bg-white/[0.06] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">{p.type}</span>
                <p className="text-sm font-bold text-purple-300">₹{p.price.toLocaleString("en-IN")}</p>
              </div>
              <h3 className="font-semibold text-sm mb-4 leading-snug">{p.title}</h3>
              <button className="w-full py-2 rounded-xl text-xs font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={18} className="text-cyan-400" />
          <h2 className="text-lg font-semibold">Courses</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {creator.courses.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-5 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all">
              <h3 className="font-semibold text-sm mb-2 leading-snug">{c.title}</h3>
              <p className="text-xs text-white/40 mb-4">{c.students} students enrolled</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-cyan-300">₹{c.price.toLocaleString("en-IN")}</p>
                <button className="text-xs px-4 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors">
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="max-w-3xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-purple-600/20 to-indigo-600/10 border border-purple-500/20 p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Work with {creator.name.split(" ")[0]}</h2>
          <p className="text-white/50 text-sm mb-7 max-w-md mx-auto">Interested in a collaboration or custom project? Send a message and I&apos;ll get back within 24 hours.</p>
          <a href={`mailto:${creator.socials.email}`} className="inline-flex items-center gap-2 btn-aurora px-8 py-3 rounded-xl text-sm font-medium">
            <Mail size={15} /> Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] px-6 py-6 text-center">
        <p className="text-xs text-white/20">
          Powered by{" "}
          <Link href="/" className="text-purple-400/60 hover:text-purple-400 transition-colors">BrandingOS</Link>
        </p>
      </footer>
    </div>
  )
}
