"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart"

/**
 * Syncs seller currency and Sales Channel into CartProvider so new carts
 * are scoped to this creator's store. Renders nothing.
 */
export function CartCurrencySync({
  currencyCode,
  salesChannelId,
}: {
  currencyCode?: string
  salesChannelId?: string
}) {
  const { setRegionByCurrency, setSalesChannelId } = useCart()
  useEffect(() => {
    if (currencyCode) setRegionByCurrency(currencyCode)
    if (salesChannelId) setSalesChannelId(salesChannelId)
  }, [currencyCode, salesChannelId, setRegionByCurrency, setSalesChannelId])
  return null
}
