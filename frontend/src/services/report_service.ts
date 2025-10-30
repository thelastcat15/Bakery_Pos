import { ReportProduct } from "@/types/product_type"
import { api } from "./api"
import { CartItem } from "@/types/cart_type"

const BASE_CART = "/reports"

export const getTopProducts = async (): Promise<ReportProduct[]> => {
  try {
    const response = await api.get(`${BASE_CART}/products/top`)
    return response.data
  } catch (error) {
    console.error("Get cart items error:", error)
    throw error
  }
}
