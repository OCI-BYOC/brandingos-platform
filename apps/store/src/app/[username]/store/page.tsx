import { medusa } from "@/lib/medusa"
import ProductCard from "@/components/store/ProductCard"
import StoreHeader from "@/components/store/StoreHeader"
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
        region_id: "reg_01M7JGBEPKE7F7NFSHH5CXFNYR",
        fields: "+metadata",
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
    <>
      <StoreHeader username={username} sellerName={displayName} sellerAvatar={seller?.avatar_url} />
      <main className="min-h-screen bg-white">
      {/* Store banner */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-[#F9FAFB]">
        {seller?.banner_url ? (
          <Image src={seller.banner_url} alt={displayName} fill className="object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F9FAFB 50%, #EDE9FE 100%)" }} />
        )}
      </div>

      {/* Seller info */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end gap-4 -mt-12 mb-8">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white relative flex-shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            {seller?.avatar_url && (
              <Image src={seller.avatar_url} alt={displayName} fill className="object-cover" />
            )}
          </div>
          <div className="pb-1">
            <h1 className="text-2xl font-bold text-[#0A0A0A]" style={{ fontFamily: "var(--font-display)" }}>{displayName}</h1>
            <p className="text-[#6B7280] text-sm">@{username}</p>
            {bio && <p className="text-[#6B7280] text-sm mt-1 max-w-md">{bio}</p>}
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
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                (tab.value === category) || (!tab.value && !category)
                  ? "bg-[#EDE9FE] text-[#7C3AED] border-[#A78BFA]"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#A78BFA] hover:text-[#7C3AED]"
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Search results header */}
        {q && (
          <p className="text-[#6B7280] text-sm mb-6">
            {products.length} result{products.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
          </p>
        )}

        {products.length === 0 ? (
          <div className="text-center text-[#6B7280] py-24">
            <p className="text-lg font-medium">{q ? "No products found." : "No products yet."}</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Digital products */}
            {digitalProducts.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-widest mb-4">Digital Products</h2>
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
                  <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-widest mb-4">Physical Products</h2>
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
    </>
  )
}
