import { medusa } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import type { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { formatPrice } from "@/lib/format"
import ProductActions from "./ProductActions"
import StoreHeader from "@/components/store/StoreHeader"
import { ChevronLeft, Package, Zap, Shield } from "lucide-react"

interface Props {
  params: Promise<{ username: string; productId: string }>
}

export default async function ProductPage({ params }: Props) {
  const { username, productId } = await params

  let product: StoreProduct | null = null
  try {
    const { product: p } = await medusa.store.product.retrieve(productId, {
      fields: "id,title,description,thumbnail,images,variants,variants.prices,variants.options,options,metadata,categories,+variants.calculated_price",
      region_id: "reg_01M7JGBEPKE7F7NFSHH5CXFNYR",
    } as Parameters<typeof medusa.store.product.retrieve>[1])
    product = p
  } catch {}

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-white/60 text-lg">Product not found.</p>
          <Link href={`/${username}/store`} className="text-purple-400 hover:text-purple-300 text-sm">
            ← Back to store
          </Link>
        </div>
      </main>
    )
  }

  const meta = (product.metadata as Record<string, unknown> | null) ?? {}
  const isDigital = meta.type === "digital"
  const firstVariant = product.variants?.[0] as StoreProductVariant | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calcPrice = (firstVariant as any)?.calculated_price as { calculated_amount?: number; currency_code?: string } | undefined
  const fallbackPrice = ((firstVariant as Record<string, unknown> | undefined)?.prices as { amount?: number; currency_code?: string }[] | undefined)?.[0]
  const priceAmount = calcPrice?.calculated_amount ?? fallbackPrice?.amount
  const currencyCode = calcPrice?.currency_code ?? fallbackPrice?.currency_code ?? "inr"
  const displayPrice = priceAmount != null
    ? formatPrice(priceAmount, currencyCode)
    : "Free"

  const images = [product.thumbnail, ...(product.images?.map(i => i.url) ?? [])].filter(Boolean) as string[]

  return (
    <>
      <StoreHeader username={username} />
      <main className="min-h-screen bg-white px-4 py-8 max-w-6xl mx-auto">
        {/* Back */}
        <Link
          href={`/${username}/store`}
          className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#7C3AED] text-sm mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to store
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB] relative">
              {images[0] ? (
                <Image src={images[0]} alt={product.title ?? ""} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {isDigital ? "📄" : "📦"}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB] relative">
                    <Image src={img} alt={`${product.title} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {isDigital && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#EDE9FE", color: "#7C3AED" }}>
                    Digital
                  </span>
                )}
                {product.categories?.[0] && (
                  <span className="text-xs bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] px-2.5 py-1 rounded-full">
                    {product.categories[0].name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold leading-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-display)" }}>
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}>
              {displayPrice}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[#6B7280] leading-relaxed">{product.description}</p>
            )}

            {/* Interactive: variant selection + add to cart */}
            <ProductActions product={product} currencyCode={currencyCode} />

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: "Secure payment" },
                { icon: Zap, label: "Instant access" },
                { icon: Package, label: "Easy returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                  <Icon className="w-4 h-4" style={{ color: "#7C3AED" }} />
                  <span className="text-xs text-[#6B7280] text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
