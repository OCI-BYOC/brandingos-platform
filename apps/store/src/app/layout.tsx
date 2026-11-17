import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "@/lib/cart"
import { MedusaAuthProvider } from "@/lib/medusa-auth"
import CartDrawer from "@/components/store/CartDrawer"

export const metadata: Metadata = {
  title: "BrandingOS Store",
  description: "Creator stores powered by BrandingOS",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-black text-white antialiased">
          <MedusaAuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </MedusaAuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
