"use client"

import Link from "next/link"
import Image from "next/image"
import CartButton from "./CartButton"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"

interface StoreHeaderProps {
  username: string
  sellerName?: string
  sellerAvatar?: string
}

export default function StoreHeader({ username, sellerName, sellerAvatar }: StoreHeaderProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { isSignedIn } = useUser()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${username}/store?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E5E7EB]" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Store brand */}
        <Link href={`/${username}/store`} className="flex items-center gap-2.5 flex-shrink-0">
          {sellerAvatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden relative">
              <Image src={sellerAvatar} alt={sellerName ?? username} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }} />
          )}
          <span className="font-semibold text-sm hidden sm:block text-[#0A0A0A]">
            {sellerName ?? `@${username}`}
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] focus:border-[#7C3AED] focus:ring-0 focus:outline-none text-sm text-[#0A0A0A] placeholder:text-[#6B7280] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>
        </form>

        {/* Cart + Auth */}
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link
                href={`/${username}/store/account`}
                className="text-xs text-[#6B7280] hover:text-[#7C3AED] px-3 py-1.5 rounded-lg hover:bg-[#EDE9FE] transition-colors hidden sm:block"
              >
                My Orders
              </Link>
              <UserButton afterSignOutUrl={`/${username}/store`} appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </>
          ) : (
            <Link
              href={`/${username}/store/sign-in`}
              className="text-xs font-medium text-[#7C3AED] px-3 py-1.5 rounded-lg border border-[#7C3AED] hover:bg-[#EDE9FE] transition-colors"
            >
              Sign In
            </Link>
          )}
          <CartButton />
        </div>
      </div>
    </header>
  )
}
