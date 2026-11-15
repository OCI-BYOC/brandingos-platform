"use client"

import Link from "next/link"
import Image from "next/image"
import CartButton from "./CartButton"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface StoreHeaderProps {
  username: string
  sellerName?: string
  sellerAvatar?: string
}

export default function StoreHeader({ username, sellerName, sellerAvatar }: StoreHeaderProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${username}/store?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Store brand */}
        <Link href={`/${username}/store`} className="flex items-center gap-2 flex-shrink-0">
          {sellerAvatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden relative">
              <Image src={sellerAvatar} alt={sellerName ?? username} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex-shrink-0" />
          )}
          <span className="font-semibold text-sm hidden sm:block">
            {sellerName ?? `@${username}`}
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-sm placeholder:text-white/30 transition-colors"
            />
          </div>
        </form>

        {/* Cart */}
        <CartButton />
      </div>
    </header>
  )
}
