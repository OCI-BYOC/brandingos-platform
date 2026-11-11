import { medusa } from "@/lib/medusa"
import ProductCard from "@/components/store/ProductCard"
import type { StoreProduct } from "@medusajs/types"

interface Props {
  params: Promise<{ username: string }>
}

export default async function CreatorStorePage({ params }: Props) {
  const { username } = await params

  let products: StoreProduct[] = []
  try {
    // Fetch products tagged with this creator's username
    const { products: list } = await medusa.store.product.list()
    products = (list ?? []).filter(
      (p) => (p.metadata as Record<string, unknown> | null)?.creator_username === username
    )
  } catch {
    // Medusa not running in dev — render empty state
  }

  return (
    <main className="min-h-screen px-4 py-16 max-w-6xl mx-auto">
      {/* Creator header */}
      <div className="mb-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">@{username}</h1>
        <p className="text-white/60 mt-2">Creator Store</p>
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="text-center text-white/40 py-24">
          <p className="text-lg">No products yet.</p>
          <p className="text-sm mt-2">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} username={username} />
          ))}
        </div>
      )}
    </main>
  )
}
