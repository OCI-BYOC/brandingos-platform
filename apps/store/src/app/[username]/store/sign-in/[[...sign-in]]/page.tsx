import { SignIn } from "@clerk/nextjs"

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ redirect_url?: string }>
}

type SellerProfile = {
  id: string
  name: string
  avatar_url?: string
}

async function getSellerName(slug: string): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/store/sellers/${slug}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return `@${slug}`
    const data = await res.json() as { seller: SellerProfile }
    return data.seller.name ?? `@${slug}`
  } catch {
    return `@${slug}`
  }
}

export default async function StoreSignInPage({ params, searchParams }: Props) {
  const { username } = await params
  const { redirect_url } = await searchParams

  const sellerName = await getSellerName(username)
  const afterSignInUrl = redirect_url ?? `/${username}/store`

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Sign in to continue</h1>
          <p className="text-white/50 mt-2 text-sm">
            You&apos;re shopping at <span className="text-purple-400 font-medium">{sellerName}</span>&apos;s store
          </p>
        </div>
        <SignIn
          routing="hash"
          afterSignInUrl={afterSignInUrl}
          afterSignUpUrl={afterSignInUrl}
          signUpUrl={`/${username}/store/sign-up`}
        />
        <p className="text-center text-white/30 text-xs mt-6">
          After signing in you&apos;ll return to {sellerName}&apos;s store
        </p>
      </div>
    </main>
  )
}
