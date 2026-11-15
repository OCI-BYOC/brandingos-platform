import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/lib/cart"
import CartDrawer from "@/components/store/CartDrawer"

export const metadata: Metadata = {
  title: "BrandingOS Store",
  description: "Creator stores powered by BrandingOS",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
