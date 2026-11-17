import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-white/50 mt-2 text-sm">Sign up to purchase and track your orders</p>
        </div>
        <SignUp routing="hash" />
      </div>
    </main>
  )
}
