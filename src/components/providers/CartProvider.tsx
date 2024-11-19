'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { loadUserCart } from '@/actions/cart/cart.actions'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const initializeCart = useCartStore((state) => state.initializeCart)

  useEffect(() => {
    const loadCart = async () => {
      if (session?.user) {
        const { success, cartItems } = await loadUserCart()
        if (success && cartItems) {
          initializeCart(cartItems)
        }
      }
    }

    loadCart()
  }, [session, initializeCart])

  return <>{children}</>
}
