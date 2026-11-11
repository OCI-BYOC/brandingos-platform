import { medusa } from "@/lib/medusa"

interface Props {
  params: Promise<{ username: string; productId: string }>
}

export default async function ProductPage({ params }: Props) {
  const { username, productId } = await params

  let product: any = null
  try {
    const { product: p } = await medusa.store.product.retrieve(productId, {
      fields: "id,title,description,thumbnail,variants,variants.prices,metadata",
    })
    product = p
  } catch {
    // fallback
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Product not found.</p>
      </main>
    )
  }

  const price = product.variants?.[0]?.prices?.[0]
  const displayPrice = price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency_code ?? "USD" })
        .format(price.amount / 100)
    : "Free"

  return (
    <main className="min-h-screen px-4 py-16 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
          {product.thumbnail ? (
            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl">📦</div>
          )}
        </div>

        {/* Product details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-white/50 mb-1">@{username}</p>
            <h1 className="text-3xl font-bold">{product.title}</h1>
          </div>
          <p className="text-white/70 leading-relaxed">{product.description}</p>
          <div className="text-3xl font-bold text-purple-400">{displayPrice}</div>
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold text-lg hover:opacity-90 transition-opacity">
            Buy Now
          </button>
        </div>
      </div>
    </main>
  )
}
