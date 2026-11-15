"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"
import { medusa } from "@/lib/medusa"
import { formatPrice } from "@/lib/format"
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import type { StoreCartLineItem } from "@medusajs/types"

type Step = "address" | "shipping" | "payment"

interface Address {
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
  email: string
}

const EMPTY_ADDRESS: Address = {
  first_name: "", last_name: "", address_1: "", address_2: "",
  city: "", province: "", postal_code: "", country_code: "in",
  phone: "", email: "",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartId } = useCart()
  const [step, setStep] = useState<Step>("address")
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [shippingOptions, setShippingOptions] = useState<{ id: string; name: string; amount: number; currency_code: string }[]>([])
  const [selectedShipping, setSelectedShipping] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const items = (cart?.items as StoreCartLineItem[] | undefined) ?? []
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price ?? 0) * (item.quantity ?? 1), 0)
  const currencyCode = items[0]
    ? ((items[0] as unknown as Record<string, unknown>).currency_code as string | undefined) ?? "inr"
    : "inr"

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cartId) return
    setLoading(true)
    setError("")
    try {
      await medusa.store.cart.update(cartId, {
        email: address.email,
        shipping_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          address_2: address.address_2,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          country_code: address.country_code,
          phone: address.phone,
        },
        billing_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          address_2: address.address_2,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          country_code: address.country_code,
          phone: address.phone,
        },
      })
      // Fetch shipping options
      const { shipping_options } = await medusa.store.fulfillment.listCartOptions({ cart_id: cartId })
      setShippingOptions(
        (shipping_options ?? []).map((o) => ({
          id: o.id,
          name: o.name ?? "Standard Shipping",
          amount: ((o as unknown as Record<string, unknown>).amount as number) ?? 0,
          currency_code: currencyCode,
        }))
      )
      setStep("shipping")
    } catch (err) {
      setError("Failed to save address. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleShippingSubmit() {
    if (!cartId || !selectedShipping) return
    setLoading(true)
    setError("")
    try {
      await medusa.store.cart.addShippingMethod(cartId, { option_id: selectedShipping })
      setStep("payment")
    } catch (err) {
      setError("Failed to select shipping. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePlaceOrder() {
    if (!cartId) return
    setLoading(true)
    setError("")
    try {
      const result = await medusa.store.cart.complete(cartId)
      if (result.type === "order") {
        router.push(`/order/${result.order.id}`)
      } else {
        setError(result.error?.message ?? "Payment failed. Please try again.")
      }
    } catch (err) {
      setError("Payment failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!cart || items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-white/60 text-lg">Your cart is empty.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">← Browse stores</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to store
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-10">
        {(["address", "shipping", "payment"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              s === step ? "bg-purple-600 text-white" :
              ["address", "shipping", "payment"].indexOf(step) > i ? "bg-purple-500/30 text-purple-300" :
              "bg-white/10 text-white/40"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm capitalize hidden sm:block ${s === step ? "text-white" : "text-white/40"}`}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{error}</div>
          )}

          {/* Address step */}
          {step === "address" && (
            <form onSubmit={handleAddressSubmit} className="space-y-5">
              <h2 className="text-xl font-semibold">Shipping address</h2>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Email *</label>
                <input
                  type="email" required value={address.email}
                  onChange={e => setAddress(a => ({ ...a, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(["first_name", "last_name"] as const).map(field => (
                  <div key={field}>
                    <label className="block text-sm text-white/60 mb-1.5 capitalize">{field.replace("_", " ")} *</label>
                    <input
                      required value={address[field]}
                      onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Address *</label>
                <input
                  required value={address.address_1}
                  onChange={e => setAddress(a => ({ ...a, address_1: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Apartment, suite, etc.</label>
                <input
                  value={address.address_2}
                  onChange={e => setAddress(a => ({ ...a, address_2: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Optional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">City *</label>
                  <input
                    required value={address.city}
                    onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">State / Province *</label>
                  <input
                    required value={address.province}
                    onChange={e => setAddress(a => ({ ...a, province: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Postal code *</label>
                  <input
                    required value={address.postal_code}
                    onChange={e => setAddress(a => ({ ...a, postal_code: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Country</label>
                  <select
                    value={address.country_code}
                    onChange={e => setAddress(a => ({ ...a, country_code: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="in">India</option>
                    <option value="us">United States</option>
                    <option value="gb">United Kingdom</option>
                    <option value="sg">Singapore</option>
                    <option value="ae">UAE</option>
                    <option value="au">Australia</option>
                    <option value="ca">Canada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Phone</label>
                <input
                  type="tel" value={address.phone}
                  onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Shipping"}
              </button>
            </form>
          )}

          {/* Shipping step */}
          {step === "shipping" && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Shipping method</h2>
              <div className="space-y-3">
                {shippingOptions.length === 0 ? (
                  <p className="text-white/40 text-sm">No shipping options available for your address.</p>
                ) : (
                  shippingOptions.map(option => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedShipping === option.id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={() => setSelectedShipping(option.id)}
                          className="accent-purple-500"
                        />
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <span className="text-purple-400 font-semibold">
                        {option.amount === 0 ? "Free" : formatPrice(option.amount, option.currency_code)}
                      </span>
                    </label>
                  ))
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("address")}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleShippingSubmit}
                  disabled={!selectedShipping || loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Payment"}
                </button>
              </div>
            </div>
          )}

          {/* Payment step */}
          {step === "payment" && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Payment</h2>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-sm text-white/60">Payment is processed securely via Razorpay (India) or Stripe (international).</p>
                <div className="flex gap-2 flex-wrap">
                  {["UPI", "Cards", "Net Banking", "Wallets"].map(m => (
                    <span key={m} className="text-xs bg-white/10 text-white/50 px-2.5 py-1 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("shipping")}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8 space-y-4">
            <h3 className="font-semibold text-lg">Order summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map(item => {
                const itemAny = item as unknown as Record<string, unknown>
                return (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex-shrink-0 overflow-hidden relative">
                    {!!itemAny.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={itemAny.thumbnail as string}
                        alt={item.title ?? ""}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium flex-shrink-0">
                    {formatPrice((item.unit_price ?? 0) * (item.quantity ?? 1), currencyCode)}
                  </span>
                </div>
                )
              })}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currencyCode)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-purple-400">{formatPrice(subtotal, currencyCode)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
