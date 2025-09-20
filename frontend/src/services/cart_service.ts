import { api } from "./api"
import { CartItem } from "@/types/cart_type"

const BASE_CART = "/cart"

export const getCart = async (): Promise<CartItem[]> => {
  try {
    const response = await api.get(`${BASE_CART}`)
    return response.data
  } catch (error) {
    console.error("Get cart items error:", error)
    throw error
  }
}

export const deleteCart = async (): Promise<string> => {
  try {
    const response = await api.delete(BASE_CART)
    return response.data
  } catch (error) {
    console.error("Delete cart error:", error)
    throw error
  }
}

export const checkout = async (): Promise<any> => {
  try {
    const response = await api.post(`${BASE_CART}/checkout`)
    return response.data
  } catch (error) {
    console.error("Checkout cart error:", error)
    throw error
  }
}

export const updateQuantityInCart = async (
  productId: number,
  quantity: number
): Promise<CartItem[]> => {
  try {
    const response = await api.put(`${BASE_CART}/${productId}`, {
      quantity,
    })
    return response.data
  } catch (error) {
    console.error("Update cart error:", error)
    throw error
  }
}
