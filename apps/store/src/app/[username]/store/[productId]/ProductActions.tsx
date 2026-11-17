"use client"

import { useState } from "react"
import type { StoreProduct, StoreProductVariant } from "@medusajs/types"
import VariantSelector from "@/components/store/VariantSelector"
import AddToCartButton from "@/components/store/AddToCartButton"
import { Minus, Plus } from "lucide-react"

interface Props {
  product: StoreProduct
  currencyCode: string
}

export default function ProductActions({ product, currencyCode }: Props) {
  const variants = product.variants as StoreProductVariant[] | undefined
  const [selectedVariantId, setSelectedVariantId] = useState(variants?.[0]?.id ?? "")
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = variants?.find(v => v.id === selectedVariantId)
  const isInStock = (selectedVariant as Record<string, unknown> | undefined)?.inventory_quantity as number | undefined
  const outOfStock = isInStock !== undefined && isInStock <= 0

  return (
    <div className="space-y-4">
      <VariantSelector
        variants={variants ?? []}
        selected={selectedVariantId}
        onSelect={setSelectedVariantId}
        currencyCode={currencyCode}
      />

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#6B7280]">Qty</span>
        <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl px-3 py-2 border border-[#E5E7EB]">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="text-[#6B7280] hover:text-[#0A0A0A] transition-colors disabled:opacity-30"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-6 text-center font-semibold text-[#0A0A0A]">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(10, q + 1))}
            className="text-[#6B7280] hover:text-[#0A0A0A] transition-colors disabled:opacity-30"
            disabled={quantity >= 10}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {outOfStock ? (
        <button disabled className="w-full py-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280] font-medium cursor-not-allowed">
          Out of Stock
        </button>
      ) : (
        <AddToCartButton variantId={selectedVariantId} />
      )}
    </div>
  )
}
