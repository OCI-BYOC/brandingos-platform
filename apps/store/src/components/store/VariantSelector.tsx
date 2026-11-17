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
      <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Options</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const price = (v as unknown as Record<string, unknown>).calculated_price as { calculated_amount?: number } | undefined
          const optionValues = (v.options as Array<{ value?: string }> | undefined)?.map(o => o.value).filter(Boolean).join(" / ")
          const label = (v.title && v.title !== "Default Title") ? v.title : (optionValues || "Default")
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                selected === v.id
                  ? "border-[#7C3AED] bg-[#EDE9FE] text-[#7C3AED]"
                  : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#A78BFA] hover:text-[#7C3AED]"
              }`}
            >
              {label}
              {price?.calculated_amount !== undefined && (
                <span className="ml-1.5 text-xs opacity-70" style={{ fontFamily: "var(--font-mono)" }}>
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
