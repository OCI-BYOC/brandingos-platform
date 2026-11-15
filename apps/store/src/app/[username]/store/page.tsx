import { medusa } from "@/lib/medusa"
import ProductCard from "@/components/store/ProductCard"
import type { StoreProduct } from "@medusajs/types"
import Image from "next/image"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ q?: string; category?: string }>
}

type SellerProfile = {
  id: string
  name: string
  slug: string
  description?: string
  avatar_url?: string
  banner_url?: string
  products?: StoreProduct[]
}

async function getSellerData(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/store/sellers/${slug}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const data = await res.json() as { seller: SellerProfile }
    return data.seller
  } catch {
    return null
  }
}

export default async function CreatorStorePage({ params, searchParams }: Props) {
  const { username } = await params
  const { q, category } = await searchParams

  // Try to get seller profile from Medusa API
  const seller = await getSellerData(username)

  // Fall back to fetching products directly
  let products: StoreProduct[] = []
  try {
    if (seller?.products) {
      products = seller.products
    } else {
      const { products: list } = await medusa.store.product.list({
        limit: 100,
      })
      products = (list ?? []).filter(
        (p) => {
          const meta = p.metadata as Record<string, unknown> | null
          return meta?.seller_slug === username || meta?.creator_username === username
        }
      )
    }
  } catch {}

  // Apply search filter
  if (q) {
    const lower = q.toLowerCase()
    products = products.filter(p =>
      p.title?.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower)
    )
  }

  // Apply category filter
  if (category) {
    products = products.filter(p =>
      p.categories?.some(c => c.handle === category || c.name?.toLowerCase() === category.toLowerCase())
    )
  }

  // Split by type
  const digitalProducts = products.filter(p => (p.metadata as Record<string, unknown> | null)?.type === "digital")
  const physicalProducts = products.filter(p => (p.metadata as Record<string, unknown> | null)?.type !== "digital")

  const displayName = seller?.name ?? `@${username}`
  const bio = seller?.description

  return (
    <main className="min-h-screen">
      {/* Store banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {seller?.banner_url ? (
          <Image src={seller.banner_url} alt={displayName} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-black to-cyan-900/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Seller info */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end gap-4 -mt-12 mb-8">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-black bg-gradient-to-br from-purple-500 to-cyan-500 relative flex-shrink-0">
            {seller?.avatar_url && (
              <Image src={seller.avatar_url} alt={displayName} fill className="object-cover" />
            )}
          </div>
          <div className="pb-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-white/50 text-sm">@{username}</p>
            {bio && <p className="text-white/60 text-sm mt-1 max-w-md">{bio}</p>}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { label: "All", value: undefined },
            { label: "Digital", value: "digital" },
            { label: "Physical", value: "physical" },
          ].map(tab => (
            <a
              key={tab.label}
              href={tab.value ? `/${username}/store?category=${tab.value}` : `/${username}/store`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (tab.value === category) || (!tab.value && !category)
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Search results header */}
        {q && (
          <p className="text-white/50 text-sm mb-6">
            {products.length} result{products.length !== 1 ? "s" : ""} for &quot;{q}&quot;
          </p>
        )}

        {products.length === 0 ? (
          <div className="text-center text-white/40 py-24">
            <p className="text-lg">{q ? "No products found." : "No products yet."}</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Digital products */}
            {digitalProducts.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-semibold text-white/70 mb-4">Digital Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {digitalProducts.map(product => (
                    <ProductCard key={product.id} product={product} username={username} />
                  ))}
                </div>
              </section>
            )}

            {/* Physical products */}
            {physicalProducts.length > 0 && (
              <section className="mb-10">
                {digitalProducts.length > 0 && (
                  <h2 className="text-lg font-semibold text-white/70 mb-4">Physical Products</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {physicalProducts.map(product => (
                    <ProductCard key={product.id} product={product} username={username} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
