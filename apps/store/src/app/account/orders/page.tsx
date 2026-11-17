"use client"

import { useEffect, useState } from "react"
import { useMedusaAuth } from "@/lib/medusa-auth"
import { formatPrice } from "@/lib/format"
import Link from "next/link"
import { Package, ChevronLeft, Loader2 } from "lucide-react"

interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
}

interface Order {
  id: string
  display_id: number
  created_at: string
  status: string
  total: number
  currency_code: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { medusaToken, isLoading: authLoading } = useMedusaAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!medusaToken) return

    setLoading(true)
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
    fetch(`${backendUrl}/store/orders`, {
      headers: {
        Authorization: `Bearer ${medusaToken}`,
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      },
    })
      .then(r => r.json())
      .then(data => {
        setOrders((data.orders ?? []) as Order[])
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [medusaToken])

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to store
      </Link>

      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {(authLoading || loading) && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{error}</div>
      )}

      {!authLoading && !loading && !error && orders.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <Package className="w-12 h-12 text-white/20 mx-auto" />
          <p className="text-white/50">No orders yet.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">Browse products →</Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className="block bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">Order #{order.display_id}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  order.status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                  order.status === "completed" ? "bg-green-500/20 text-green-300" :
                  "bg-white/10 text-white/50"
                }`}>
                  {order.status}
                </span>
                <p className="font-bold mt-1 text-purple-400">
                  {formatPrice(order.total, order.currency_code)}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {(order.items ?? []).slice(0, 3).map(item => (
                <p key={item.id} className="text-sm text-white/60 truncate">
                  {item.title} × {item.quantity}
                </p>
              ))}
              {(order.items?.length ?? 0) > 3 && (
                <p className="text-xs text-white/30">+{order.items.length - 3} more</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
