"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getOrCreateCart = useCallback(async (): Promise<string> => {
    let id = cartId
    try {
      id = id ?? localStorage.getItem("bos_cart_id")
    } catch {}

    if (id) {
      try {
        const { cart: existing } = await medusa.store.cart.retrieve(id)
        setCart(existing)
        setCartId(id)
        return id
      } catch {
        // Cart expired — create new
      }
    }

    const { cart: newCart } = await medusa.store.cart.create({
      region_id: "reg_01M7JGBEPKE7F7NFSHH5CXFNYR",
    })
    try { localStorage.setItem("bos_cart_id", newCart.id) } catch {}
    setCart(newCart)
    setCartId(newCart.id)
    return newCart.id
  }, [cartId])

  useEffect(() => {
    // Hydrate cart from localStorage silently
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
