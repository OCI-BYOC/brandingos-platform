import {
  User, Briefcase, GraduationCap, Layers, Star, Mail,
  Calendar, Phone, FileText, Puzzle, MessageSquare, Code2,
} from 'lucide-react'

// ─── Tier AI credit allocations ────────────────────────────────────────────
export const TIER_LIMITS = {
  free:   50,
  pro:    500,
  growth: 2000,
  brand:  10000,
} as const

export type Tier = keyof typeof TIER_LIMITS

// ─── Feature flags per tier ─────────────────────────────────────────────────
export const PLAN_FEATURES: Record<Tier, Record<string, boolean>> = {
  free: {
    multiplePortfolios: false,
    commerce:           false,
    courses:            false,
    socialAgent:        false,
    jobIntelligence:    false,
    newsletter:         true,
    booking:            false,
    customDomain:       false,
    privateAI:          false,
    analytics:          false,
    teamAccess:         false,
  },
  pro: {
    multiplePortfolios: false,
    commerce:           true,
    courses:            true,
    socialAgent:        false,
    jobIntelligence:    false,
    newsletter:         true,
    booking:            true,
    customDomain:       false,
    privateAI:          false,
    analytics:          true,
    teamAccess:         false,
  },
  growth: {
    multiplePortfolios: true,
    commerce:           true,
    courses:            true,
    socialAgent:        true,
    jobIntelligence:    true,
    newsletter:         true,
    booking:            true,
    customDomain:       true,
    privateAI:          false,
    analytics:          true,
    teamAccess:         false,
  },
  brand: {
    multiplePortfolios: true,
    commerce:           true,
    courses:            true,
    socialAgent:        true,
    jobIntelligence:    true,
    newsletter:         true,
    booking:            true,
    customDomain:       true,
    privateAI:          true,
    analytics:          true,
    teamAccess:         true,
  },
}

// ─── Pricing ────────────────────────────────────────────────────────────────
export const PRICING = {
  free:   { monthly: 0,    yearly: 0 },
  pro:    { monthly: 999,  yearly: 9990  },
  growth: { monthly: 2499, yearly: 24990 },
  brand:  { monthly: 4999, yearly: 49990 },
} as const

// ─── Portfolio section types ─────────────────────────────────────────────────
export const SECTION_TYPES = [
  {
    type:        'hero' as const,
    icon:        User,
    label:       'Hero',
    description: 'Your name, tagline, avatar and cover photo',
    color:       '#7c3aed',
  },
  {
    type:        'about' as const,
    icon:        FileText,
    label:       'About',
    description: 'A rich bio section with skills overview',
    color:       '#06b6d4',
  },
  {
    type:        'skills' as const,
    icon:        Star,
    label:       'Skills',
    description: 'Tag-style skill chips with proficiency dots',
    color:       '#a78bfa',
  },
  {
    type:        'work' as const,
    icon:        Briefcase,
    label:       'Work Experience',
    description: 'Your employment history with descriptions',
    color:       '#f472b6',
  },
  {
    type:        'education' as const,
    icon:        GraduationCap,
    label:       'Education',
    description: 'Degrees, schools and years of study',
    color:       '#34d399',
  },
  {
    type:        'projects' as const,
    icon:        Layers,
    label:       'Projects',
    description: 'Project cards with images, URLs and tags',
    color:       '#fbbf24',
  },
  {
    type:        'integrations' as const,
    icon:        Puzzle,
    label:       'Integrations',
    description: 'GitHub, LinkedIn and other connected data',
    color:       '#f97316',
  },
  {
    type:        'testimonials' as const,
    icon:        MessageSquare,
    label:       'Testimonials',
    description: 'Client reviews with ratings and attribution',
    color:       '#ec4899',
  },
  {
    type:        'newsletter' as const,
    icon:        Mail,
    label:       'Newsletter CTA',
    description: 'Grow your email list directly from your portfolio',
    color:       '#8b5cf6',
  },
  {
    type:        'booking' as const,
    icon:        Calendar,
    label:       'Booking',
    description: 'Let visitors book time with you directly',
    color:       '#06b6d4',
  },
  {
    type:        'contact' as const,
    icon:        Phone,
    label:       'Contact',
    description: 'Email, phone and social links',
    color:       '#10b981',
  },
  {
    type:        'custom' as const,
    icon:        Code2,
    label:       'Custom',
    description: 'Write your own markdown or HTML content',
    color:       '#6366f1',
  },
] as const

export type SectionType = (typeof SECTION_TYPES)[number]['type']

// ─── Navigation ──────────────────────────────────────────────────────────────
export const NAV_SECTIONS = [
  {
    label: 'Brand',
    items: [
      { label: 'Dashboard',  href: '/dashboard',           icon: 'LayoutDashboard' },
      { label: 'Portfolio',  href: '/dashboard/portfolio', icon: 'Globe' },
    ],
  },
  {
    label: 'Monetise',
    items: [
      { label: 'Commerce',   href: '/dashboard/commerce',  icon: 'ShoppingBag' },
      { label: 'Courses',    href: '/dashboard/courses',   icon: 'BookOpen' },
      { label: 'Booking',    href: '/dashboard/booking',   icon: 'Calendar' },
    ],
  },
  {
    label: 'Grow',
    items: [
      { label: 'Social',     href: '/dashboard/social',    icon: 'Share2' },
      { label: 'Newsletter', href: '/dashboard/newsletter',icon: 'Mail' },
      { label: 'Jobs',       href: '/dashboard/jobs',      icon: 'Briefcase' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Analytics',  href: '/dashboard/analytics', icon: 'BarChart2' },
    ],
  },
]
