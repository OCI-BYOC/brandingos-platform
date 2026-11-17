import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Sign in to BrandingOS Store</h1>
          <p className="text-white/50 mt-2 text-sm">Access your purchases and order history</p>
        </div>
        <SignIn routing="hash" />
      </div>
    </main>
  )
}
