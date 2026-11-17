"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useUser } from "@clerk/nextjs"

type MedusaAuthContextType = {
  medusaToken: string | null
  customerEmail: string | null
  isLoading: boolean
}

const MedusaAuthContext = createContext<MedusaAuthContextType>({
  medusaToken: null,
  customerEmail: null,
  isLoading: false,
})

export function MedusaAuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [medusaToken, setMedusaToken] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      setMedusaToken(null)
      setCustomerEmail(null)
      try { localStorage.removeItem("bos_medusa_token") } catch {}
      return
    }

    // Reuse cached token for same user
    try {
      const cached = localStorage.getItem("bos_medusa_token")
      const cachedUser = localStorage.getItem("bos_medusa_user")
      if (cached && cachedUser === user.id) {
        setMedusaToken(cached)
        setCustomerEmail(user.emailAddresses[0]?.emailAddress ?? null)
        return
      }
    } catch {}

    setIsLoading(true)
    fetch("/api/auth/medusa-token", { method: "POST" })
      .then(r => r.json())
      .then(({ token, email }) => {
        if (token) {
          setMedusaToken(token)
          setCustomerEmail(email ?? null)
          try {
            localStorage.setItem("bos_medusa_token", token)
            localStorage.setItem("bos_medusa_user", user.id)
          } catch {}
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [user, isLoaded])

  return (
    <MedusaAuthContext.Provider value={{ medusaToken, customerEmail, isLoading }}>
      {children}
    </MedusaAuthContext.Provider>
  )
}

export function useMedusaAuth() {
  return useContext(MedusaAuthContext)
}
