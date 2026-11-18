import { medusa } from "@/lib/medusa"
import { formatPrice } from "@/lib/format"
import { CheckCircle, Package, Mail } from "lucide-react"
import Link from "next/link"
import type { StoreOrder } from "@medusajs/types"

interface Props {
  params: Promise<{ username: string; orderId: string }>
}

export default async function StoreOrderConfirmationPage({ params }: Props) {
  const { username, orderId } = await params

  let order: StoreOrder | null = null
  try {
    const { order: o } = await medusa.store.order.retrieve(orderId, {
      fields: "id,display_id,status,email,items,items.unit_price,items.quantity,items.title,items.thumbnail,shipping_address,total,subtotal,shipping_total,currency_code",
    })
    order = o
  } catch {}

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-white/60 text-lg">Order not found.</p>
          <Link href={`/${username}/store`} className="text-purple-400 hover:text-purple-300 text-sm">
            ← Back to store
          </Link>
        </div>
      </main>
    )
  }

  const currencyCode = order.currency_code ?? "inr"
  const shippingAddr = order.shipping_address as Record<string, string> | null

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order confirmed!</h1>
        <p className="text-white/50 text-lg">Order #{order.display_id}</p>
        {order.email && (
          <p className="text-white/40 text-sm mt-2 flex items-center justify-center gap-1.5">
            <Mail className="w-4 h-4" />
            Confirmation sent to {order.email}
          </p>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 mb-6">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-400" />
          Items ordered
        </h2>
        <div className="space-y-4">
          {order.items?.map(item => {
            const itemAny = item as unknown as Record<string, unknown>
            return (
              <div key={item.id} className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0 overflow-hidden">
                  {!!itemAny.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={itemAny.thumbnail as string} alt={item.title ?? ""} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-white/40">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold">
                  {formatPrice((item.unit_price ?? 0) * (item.quantity ?? 1), currencyCode)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal ?? 0, currencyCode)}</span>
          </div>
          {(order.shipping_total ?? 0) > 0 && (
            <div className="flex justify-between text-sm text-white/60">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_total ?? 0, currencyCode)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-1">
            <span>Total</span>
            <span className="text-purple-400">{formatPrice(order.total ?? 0, currencyCode)}</span>
          </div>
        </div>
      </div>

      {shippingAddr && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-3">Shipping to</h2>
          <div className="text-white/60 text-sm space-y-1">
            <p>{shippingAddr.first_name} {shippingAddr.last_name}</p>
            <p>{shippingAddr.address_1}{shippingAddr.address_2 ? `, ${shippingAddr.address_2}` : ""}</p>
            <p>{shippingAddr.city}, {shippingAddr.province} {shippingAddr.postal_code}</p>
            <p>{shippingAddr.country_code?.toUpperCase()}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link href={`/${username}/store/account`}
          className="w-full block text-center py-3 rounded-xl border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-semibold transition-all">
          View my orders
        </Link>
        <Link href={`/${username}/store`}
          className="w-full block text-center py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold text-lg hover:opacity-90 transition-all">
          Continue shopping
        </Link>
      </div>
    </main>
  )
}
