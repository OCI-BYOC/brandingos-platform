"use client"

import { useCart } from "@/lib/cart"
import { ShoppingCart, Loader2, Check } from "lucide-react"
import { useState } from "react"

interface Props {
  variantId: string
  disabled?: boolean
}

export default function AddToCartButton({ variantId, disabled }: Props) {
  const { addItem, isLoading } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = async () => {
    await addItem(variantId)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isLoading || disabled}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      style={{
        background: added ? "#059669" : "#7C3AED",
        boxShadow: added ? "0 4px 16px rgba(5,150,105,0.35)" : "0 4px 16px rgba(124,58,237,0.35)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : added ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  )
}
