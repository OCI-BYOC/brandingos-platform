"use client"

import type { StoreProductVariant } from "@medusajs/types"
import { formatPrice } from "@/lib/format"

interface Props {
  variants: StoreProductVariant[]
  selected: string
  onSelect: (variantId: string) => void
  currencyCode?: string
}

export default function VariantSelector({ variants, selected, onSelect, currencyCode = "usd" }: Props) {
  if (!variants || variants.length <= 1) return null

  return (
    <div className="space-y-2">
      <p className="text-sm text-white/60 font-medium">Options</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const price = (v as unknown as Record<string, unknown>).calculated_price as { calculated_amount?: number } | undefined
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                selected === v.id
                  ? "border-purple-500 bg-purple-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
              }`}
            >
              {v.title ?? "Default"}
              {price?.calculated_amount !== undefined && (
                <span className="ml-1.5 text-xs text-white/40">
                  {formatPrice(price.calculated_amount, currencyCode)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
