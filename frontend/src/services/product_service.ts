import { Product } from "@/types/product_type"
import { api } from "./api"
const BASE_PRODUCT = "/products"

export const createProduct = async (newProduct: Product): Promise<Product> => {
  try {
    const response = await api.post<Product>(`${BASE_PRODUCT}`)
    return response.data
  } catch (error) {
    console.error("Create product error:", error)
    throw error
  }
}

export const updateProduct = async (productId: number): Promise<Product> => {
  try {
    const response = await api.put<Product>(`${BASE_PRODUCT}/${productId}`)
    return response.data
  } catch (error) {
    console.error("Update product error:", error)
    throw error
  }
}

export const deleteProduct = async (productId: number) => {
  try {
    await api.delete(`${BASE_PRODUCT}/${productId}`)
  } catch (error) {
    console.error("Delete product error:", error)
    throw error
  }
}

export const uploadImageProduct = async (productId: number) => {
  try {
    const response = await api.post(`${BASE_PRODUCT}/${productId}/images`)
    return response.data
  } catch (error) {
    console.error("Upload image of product error:", error)
    throw error
  }
}
