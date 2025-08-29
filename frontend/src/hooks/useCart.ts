import { useState, useCallback } from "react"
import { CartItem } from "@/types/cart_type"
import { Product } from "@/types/product_type"

export const UseCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const increaseQuantity = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id == productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }, [])

  const decreaseQuantity = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }, [cartItems])

  const getItemQuantity = useCallback(
    (productId: number) => {
      const item = cartItems.find((item) => item.id === productId)
      return item?.quantity || 0
    },
    [cartItems]
  )
}
