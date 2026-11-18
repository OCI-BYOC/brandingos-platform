import { SignUp } from "@clerk/nextjs"

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ redirect_url?: string }>
}

export default async function StoreSignUpPage({ params, searchParams }: Props) {
  const { username } = await params
  const { redirect_url } = await searchParams

  const afterSignUpUrl = redirect_url ?? `/${username}/store`

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/50 mt-2 text-sm">Sign up to purchase and track your orders</p>
        </div>
        <SignUp
          routing="hash"
          afterSignUpUrl={afterSignUpUrl}
          signInUrl={`/${username}/store/sign-in`}
        />
      </div>
    </main>
  )
}
