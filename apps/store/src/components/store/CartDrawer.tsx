"use client"

import { useCart } from "@/lib/cart"
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/format"

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d14] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-lg">Your Cart</span>
          </div>
          <button onClick={closeCart} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
              <ShoppingBag className="w-12 h-12" />
              <p>Your cart is empty</p>
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
                <div key={item.id} className="flex gap-3 group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 relative">
                    {imgSrc ? (
                      <Image src={imgSrc} alt={title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{title}</p>
                    {variantTitle && <p className="text-white/40 text-xs">{variantTitle}</p>}
                    <p className="text-purple-400 text-sm font-semibold mt-1">{formatPrice(price, currency)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateItem(item.id, (item.quantity ?? 1) - 1)}
                        disabled={isLoading || (item.quantity ?? 1) <= 1}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, (item.quantity ?? 1) + 1)}
                        disabled={isLoading}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isLoading}
                    className="text-white/30 hover:text-red-400 transition-colors self-start mt-1"
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
          <div className="border-t border-white/10 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Subtotal</span>
              <span className="font-bold text-lg">
                {formatPrice(
                  ((cart as unknown as Record<string, unknown>).subtotal as number | undefined) ?? 0,
                  ((cart as unknown as Record<string, unknown>).currency_code as string | undefined) ?? "usd"
                )}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold text-center hover:opacity-90 transition-opacity"
            >
              Checkout
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  )
}
