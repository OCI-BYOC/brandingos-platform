"use client"

import { useCart } from "@/lib/cart"
import { usePathname } from "next/navigation"
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/format"

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart()
  const pathname = usePathname()
  // Derive per-store checkout URL: /{username}/store/* → /{username}/store/checkout
  const storeMatch = pathname.match(/^\/([^/]+)\/store/)
  const checkoutHref = storeMatch ? `/${storeMatch[1]}/store/checkout` : "/checkout"

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#E5E7EB] z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "-8px 0 32px rgba(0,0,0,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: "#7C3AED" }} />
            <span className="font-semibold text-lg text-[#0A0A0A]">Your Cart</span>
          </div>
          <button onClick={closeCart} className="text-[#6B7280] hover:text-[#0A0A0A] transition-colors p-1 rounded-lg hover:bg-[#F9FAFB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#6B7280]">
              <ShoppingBag className="w-12 h-12 text-[#D1D5DB]" />
              <p className="font-medium">Your cart is empty</p>
            </div>
          ) : (
            cart.items.map((item) => {
              const itemAny = item as unknown as Record<string, unknown>
              const cartAny = cart as unknown as Record<string, unknown>
              const imgSrc = itemAny.thumbnail as string | undefined
              const title = (itemAny.title as string | undefined) ?? "Product"
              const variantTitle = (item.variant as unknown as Record<string, unknown> | undefined)?.title as string | undefined
              const price = (itemAny.unit_price as number | undefined) ?? 0
              const currency = (cartAny.currency_code as string | undefined) ?? "usd"
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F9FAFB] flex-shrink-0 relative border border-[#E5E7EB]">
                    {imgSrc ? (
                      <Image src={imgSrc} alt={title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-[#0A0A0A]">{title}</p>
                    {variantTitle && <p className="text-[#6B7280] text-xs mt-0.5">{variantTitle}</p>}
                    <p className="text-sm font-bold mt-1" style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}>
                      {formatPrice(price, currency)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateItem(item.id, (item.quantity ?? 1) - 1)}
                        disabled={isLoading || (item.quantity ?? 1) <= 1}
                        className="w-6 h-6 rounded-full bg-[#F3F4F6] hover:bg-[#EDE9FE] flex items-center justify-center disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-[#6B7280]" />
                      </button>
                      <span className="text-sm w-4 text-center font-medium text-[#0A0A0A]">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, (item.quantity ?? 1) + 1)}
                        disabled={isLoading}
                        className="w-6 h-6 rounded-full bg-[#F3F4F6] hover:bg-[#EDE9FE] flex items-center justify-center disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-[#6B7280]" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isLoading}
                    className="text-[#D1D5DB] hover:text-[#DC2626] transition-colors self-start mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length ? (
          <div className="border-t border-[#E5E7EB] px-6 py-5 space-y-4 bg-[#F9FAFB]">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] text-sm">Subtotal</span>
              <span className="font-bold text-xl" style={{ fontFamily: "var(--font-mono)", color: "#0A0A0A" }}>
                {formatPrice(
                  ((cart as unknown as Record<string, unknown>).subtotal as number | undefined) ?? 0,
                  ((cart as unknown as Record<string, unknown>).currency_code as string | undefined) ?? "usd"
                )}
              </span>
            </div>
            <Link
              href={checkoutHref}
              onClick={closeCart}
              className="block w-full py-3.5 rounded-xl font-semibold text-center text-white transition-all hover:opacity-90"
              style={{ background: "#7C3AED", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
            >
              Checkout →
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  )
}
