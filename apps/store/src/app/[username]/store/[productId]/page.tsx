import { medusa } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import type { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { formatPrice } from "@/lib/format"
import ProductActions from "./ProductActions"
import { ChevronLeft, Package, Zap, Shield } from "lucide-react"

interface Props {
  params: Promise<{ username: string; productId: string }>
}

export default async function ProductPage({ params }: Props) {
  const { username, productId } = await params

  let product: StoreProduct | null = null
  try {
    const { product: p } = await medusa.store.product.retrieve(productId, {
      fields: "id,title,description,thumbnail,images,variants,variants.prices,variants.options,options,metadata,categories",
    })
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
  const firstPrice = (firstVariant as Record<string, unknown> | undefined)?.prices as { amount?: number; currency_code?: string }[] | undefined
  const price = firstPrice?.[0]
  const displayPrice = price
    ? formatPrice(price.amount ?? 0, price.currency_code ?? "usd")
    : "Free"
  const currencyCode = price?.currency_code ?? "usd"

  const images = [product.thumbnail, ...(product.images?.map(i => i.url) ?? [])].filter(Boolean) as string[]

  return (
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* Back */}
      <Link
        href={`/${username}/store`}
        className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative">
            {images[0] ? (
              <Image src={images[0]} alt={product.title ?? ""} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl">
                {isDigital ? "📄" : "📦"}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 relative">
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
            <div className="flex items-center gap-2 mb-2">
              {isDigital && (
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-medium">
                  Digital
                </span>
              )}
              {product.categories?.[0] && (
                <span className="text-xs bg-white/5 text-white/40 px-2.5 py-1 rounded-full">
                  {product.categories[0].name}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>
          </div>

          {/* Price */}
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {displayPrice}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-white/70 leading-relaxed">{product.description}</p>
          )}

          {/* Interactive: variant selection + add to cart */}
          <ProductActions
            product={product}
            currencyCode={currencyCode}
          />

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Shield, label: "Secure payment" },
              { icon: Zap, label: "Instant access" },
              { icon: Package, label: "Easy returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <Icon className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/50 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
