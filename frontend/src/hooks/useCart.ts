import { useState, useCallback, useEffect } from "react"
import { CartItem } from "@/types/cart_type"
import { Product } from "@/types/product_type"
import { usePromotions } from "./usePromotions"
import {
  getCart as apiGetCart,
  updateQuantityInCart as apiUpdateQuantity,
  deleteCart as apiDeleteCart,
} from "@/services/cart_service"

export const UseCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { getDiscountedPrice, getPriceDisplay } = usePromotions()

  // โหลด cart จาก server ตอน mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await apiGetCart()
        setCartItems(items)
      } catch (error) {
        console.error("Failed to load cart from server", error)
      } finally {
        setIsLoaded(true)
      }
    }
    loadCart()
  }, [])

  // เพิ่มสินค้าไป cart (เรียก API update)
  const addToCart = useCallback(
    async (product: Product, quantity: number = 1) => {
      try {
        const existing = cartItems.find((item) => item.id === product.id)
        const newQuantity = existing ? existing.quantity + quantity : quantity
        const updatedItems = await apiUpdateQuantity(product.id!!, newQuantity)
        setCartItems(updatedItems)
      } catch (error) {
        console.error("Failed to add item to cart", error)
      }
    },
    [cartItems]
  )

  // ลบสินค้า
  const removeFromCart = useCallback(
    async (productId: number) => {
      try {
        const updatedItems = await apiUpdateQuantity(productId, 0)
        setCartItems(updatedItems)
      } catch (error) {
        console.error("Failed to remove item from cart", error)
      }
    },
    []
  )

  // อัพเดตจำนวนสินค้า
  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      try {
        const updatedItems = await apiUpdateQuantity(productId, quantity)
        setCartItems(updatedItems)
      } catch (error) {
        console.error("Failed to update quantity", error)
      }
    },
    []
  )

  // เพิ่มจำนวน +1
  const increaseQuantity = useCallback(
    async (productId: number) => {
      const item = cartItems.find((i) => i.id === productId)
      if (!item) return
      await updateQuantity(productId, item.quantity + 1)
    },
    [cartItems, updateQuantity]
  )

  // ลดจำนวน -1
  const decreaseQuantity = useCallback(
    async (productId: number) => {
      const item = cartItems.find((i) => i.id === productId)
      if (!item) return
      const newQty = Math.max(0, item.quantity - 1)
      await updateQuantity(productId, newQty)
    },
    [cartItems, updateQuantity]
  )

  // ลบทั้งหมด
  const clearCart = useCallback(async () => {
    try {
      await apiDeleteCart()
      setCartItems([])
    } catch (error) {
      console.error("Failed to clear cart", error)
    }
  }, [])

  // ดึงข้อมูล cart สำหรับ display
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const discounted = getDiscountedPrice(item)
      return total + discounted * item.quantity
    }, 0)
  }, [cartItems, getDiscountedPrice])

  const getOriginalTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  const getTotalSavings = useCallback(() => {
    return getOriginalTotalPrice() - getTotalPrice()
  }, [getOriginalTotalPrice, getTotalPrice])

  const getItemQuantity = useCallback(
    (productId: number) => {
      const item = cartItems.find((i) => i.id === productId)
      return item?.quantity || 0
    },
    [cartItems]
  )

  const getCartItemsWithPromotions = useCallback(() => {
    return cartItems.map((item) => ({
      ...item,
      ...getPriceDisplay(item),
    }))
  }, [cartItems, getPriceDisplay])

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getOriginalTotalPrice,
    getTotalSavings,
    getItemQuantity,
    getCartItemsWithPromotions,
    isLoaded,
  }
}
