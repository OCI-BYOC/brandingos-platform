"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import { medusa } from "./medusa"
import type { StoreCart } from "@medusajs/types"

type CartContextType = {
  cart: StoreCart | null
  cartId: string | null
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  itemCount: number
  isLoading: boolean
  /** Called by per-seller pages to set the checkout currency. */
  setRegionByCurrency: (currencyCode: string) => void
  /** Called by per-seller pages to scope the cart to their Sales Channel. */
  setSalesChannelId: (id: string) => void
}

const CartContext = createContext<CartContextType | null>(null)

// Cached region map: currency_code → region_id, populated on first lookup
const regionCache: Record<string, string> = {}

/** Resolves a Medusa region_id for a given currency code. Cached after first call. */
async function resolveRegionId(currencyCode: string): Promise<string | null> {
  const key = currencyCode.toLowerCase()
  if (regionCache[key]) return regionCache[key]
  try {
    const { regions } = await medusa.store.region.list()
    for (const r of regions) {
      if (r.currency_code) regionCache[r.currency_code.toLowerCase()] = r.id
    }
    return regionCache[key] ?? null
  } catch {
    return null
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Defaults to INR; seller pages call setRegionByCurrency to override
  const currencyRef = useRef<string>("inr")
  const salesChannelIdRef = useRef<string | null>(null)

  const setRegionByCurrency = useCallback((currencyCode: string) => {
    currencyRef.current = currencyCode.toLowerCase()
  }, [])

  const setSalesChannelId = useCallback((id: string) => {
    salesChannelIdRef.current = id
  }, [])

  const getOrCreateCart = useCallback(async (): Promise<string> => {
    let id = cartId
    try { id = id ?? localStorage.getItem("bos_cart_id") } catch {}

    if (id) {
      try {
        const { cart: existing } = await medusa.store.cart.retrieve(id)
        setCart(existing)
        setCartId(id)
        return id
      } catch {
        // Cart expired — fall through to create a new one
      }
    }

    // Resolve region for the current seller's currency
    const regionId = await resolveRegionId(currencyRef.current)

    const { cart: newCart } = await medusa.store.cart.create({
      ...(regionId ? { region_id: regionId } : {}),
      ...(salesChannelIdRef.current ? { sales_channel_id: salesChannelIdRef.current } : {}),
    } as Parameters<typeof medusa.store.cart.create>[0])
    try { localStorage.setItem("bos_cart_id", newCart.id) } catch {}
    setCart(newCart)
    setCartId(newCart.id)
    return newCart.id
  }, [cartId])

  useEffect(() => {
    const stored = (() => { try { return localStorage.getItem("bos_cart_id") } catch { return null } })()
    if (stored) {
      medusa.store.cart.retrieve(stored)
        .then(({ cart: c }) => { setCart(c); setCartId(c.id) })
        .catch(() => { try { localStorage.removeItem("bos_cart_id") } catch {} })
    }
  }, [])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      const id = await getOrCreateCart()
      const { cart: updated } = await medusa.store.cart.createLineItem(id, {
        variant_id: variantId,
        quantity,
      })
      setCart(updated)
      setIsOpen(true)
    } finally {
      setIsLoading(false)
    }
  }, [getOrCreateCart])

  const updateItem = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cartId) return
    setIsLoading(true)
    try {
      const { cart: updated } = await medusa.store.cart.updateLineItem(cartId, lineItemId, { quantity })
      setCart(updated)
    } finally {
      setIsLoading(false)
    }
  }, [cartId])

  const removeItem = useCallback(async (lineItemId: string) => {
    if (!cartId) return
    setIsLoading(true)
    try {
      const { parent: updated } = await medusa.store.cart.deleteLineItem(cartId, lineItemId)
      if (updated) setCart(updated)
    } finally {
      setIsLoading(false)
    }
  }, [cartId])

  const itemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0

  return (
    <CartContext.Provider value={{
      cart, cartId, isOpen, isLoading, itemCount,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen(prev => !prev),
      addItem, updateItem, removeItem,
      setRegionByCurrency, setSalesChannelId,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
