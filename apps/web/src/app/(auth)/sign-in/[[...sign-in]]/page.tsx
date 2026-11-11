import { SignIn } from "@clerk/nextjs"
import { Suspense } from "react"

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#7c3aed",
            colorBackground: "rgba(15,12,30,0.75)",
            colorText: "#ffffff",
            colorTextSecondary: "rgba(255,255,255,0.6)",
            colorInputBackground: "rgba(255,255,255,0.05)",
            colorInputText: "#ffffff",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "backdrop-blur-xl border border-white/10 shadow-2xl",
            formButtonPrimary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90",
          },
        }}
      />
    </Suspense>
  )
}
