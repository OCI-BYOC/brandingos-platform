"use client"

import { useCart } from "@/lib/cart"
import { ShoppingCart, Loader2 } from "lucide-react"
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
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : added ? (
        <>✓ Added to Cart</>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  )
}
