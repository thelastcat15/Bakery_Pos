import { useState, useCallback, useEffect } from "react"
import { CartItem } from "@/types/cart_type"
import { Product } from "@/types/product_type"
import { usePromotions } from "./usePromotions"

const CART_STORAGE_KEY = "shopping_cart"

// helper function for lacalStorage
const saveCartToStorage = (cartItems: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  } catch (error) {
    console.error("Failed to save cart to localStorage")
  }
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error)
    return []
  }
}

export const UseCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { getDiscountedPrice, getPriceDisplay } = usePromotions()

  // Load cart from localStorafe on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    setCartItems(savedCart)
    setIsLoaded(true)
  }, [])

  // Save cart to localstorage whenever cartItems changes
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(cartItems)
    }
  }, [cartItems, isLoaded])

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prev, { ...product, quantity }]
      }
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    },
    [removeFromCart]
  )

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

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  // Updated to use promotional pricing
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = getDiscountedPrice(item)
      return total + discountedPrice * item.quantity
    }, 0)
  }, [cartItems, getDiscountedPrice])

  const getOriginalTotalPrice = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }, [cartItems])

  const getTotalSavings = useCallback(() => {
    const originalTotal = getOriginalTotalPrice()
    const discountedTotal = getTotalPrice()
    return originalTotal - discountedTotal
  }, [getOriginalTotalPrice, getTotalPrice])

  const getItemQuantity = useCallback(
    (productId: number) => {
      const item = cartItems.find((item) => item.id === productId)
      return item?.quantity || 0
    },
    [cartItems]
  )

  const getCartItemsWithPromotions = useCallback(() => {
    return cartItems.map((item) => {
      const priceDisplay = getPriceDisplay(item)
      return {
        ...item,
        ...priceDisplay,
      }
    })
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
