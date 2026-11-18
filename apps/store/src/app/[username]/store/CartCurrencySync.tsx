"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart"

/**
 * Dropped into the per-seller store server component to sync the seller's
 * currency code into CartProvider so new carts use the right Medusa region.
 * Renders nothing.
 */
export function CartCurrencySync({ currencyCode }: { currencyCode?: string }) {
  const { setRegionByCurrency } = useCart()
  useEffect(() => {
    if (currencyCode) setRegionByCurrency(currencyCode)
  }, [currencyCode, setRegionByCurrency])
  return null
}
