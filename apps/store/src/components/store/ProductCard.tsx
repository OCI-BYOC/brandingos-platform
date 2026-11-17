import Link from "next/link"
import type { StoreProduct } from "@medusajs/types"
import Image from "next/image"

interface ProductCardProps {
  product: StoreProduct
  username: string
}

export default function ProductCard({ product, username }: ProductCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variant = product.variants?.[0] as any
  const calcPrice = variant?.calculated_price as { calculated_amount?: number; currency_code?: string } | undefined
  const fallbackPrice = variant?.prices?.[0] as { amount?: number; currency_code?: string } | undefined
  const amount = calcPrice?.calculated_amount ?? fallbackPrice?.amount
  const currency = calcPrice?.currency_code ?? fallbackPrice?.currency_code ?? "INR"
  const displayPrice = amount != null
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount / 100)
    : "Free"

  const isDigital = (product.metadata as Record<string, unknown> | null)?.type === "digital"

  return (
    <Link
      href={`/${username}/store/${product.id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#A78BFA] transition-all hover:shadow-lg"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
    >
      <div className="aspect-video bg-[#F9FAFB] overflow-hidden relative">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title ?? ""}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {isDigital ? "📄" : "📦"}
          </div>
        )}
      </div>
      <div className="p-5 space-y-2">
        <h3 className="font-semibold text-lg leading-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-sans)" }}>
          {product.title}
        </h3>
        {product.description && (
          <p className="text-[#6B7280] text-sm line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-lg" style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}>
            {displayPrice}
          </span>
          {isDigital && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#EDE9FE", color: "#7C3AED" }}>
              Digital
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
