import Link from "next/link"

interface ProductCardProps {
  product: any
  username: string
}

export default function ProductCard({ product, username }: ProductCardProps) {
  const price = product.variants?.[0]?.prices?.[0]
  const displayPrice = price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency_code ?? "USD" })
        .format(price.amount / 100)
    : "Free"

  const isDigital = product.metadata?.type === "digital"

  return (
    <Link
      href={`/${username}/store/${product.id}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
    >
      <div className="aspect-video bg-white/5 overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-5xl">
            {isDigital ? "📄" : "📦"}
          </div>
        )}
      </div>
      <div className="p-5 space-y-2">
        <h3 className="font-semibold text-lg leading-tight">{product.title}</h3>
        {product.description && (
          <p className="text-white/50 text-sm line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-purple-400 font-bold text-lg">{displayPrice}</span>
          {isDigital && (
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
              Digital
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
