"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"

export default function CartButton() {
  const { toggleCart, itemCount } = useCart()
  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#EDE9FE] rounded-lg transition-colors"
      aria-label={`Cart (${itemCount} items)`}
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7C3AED] text-[10px] font-bold flex items-center justify-center text-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  )
}
