import { api } from "./api"
import { Order, OrderStatus } from "@/types/order_type"
import { uploadImage } from "./product_service"

const BASE_ORDER = "/order"

export const getAllOrder = async (): Promise<Order[]> => {
  try {
    const response = await api.get(`${BASE_ORDER}`)
    return response.data
  } catch (error) {
    console.error("Get all order error:", error)
    throw error
  }
}

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`${BASE_ORDER}/${orderId}`)
    return response.data
  } catch (error) {
    console.error("Get order by id error:", error)
    throw error
  }
}

export const updateOrderStatusById = async (orderId: string, status: OrderStatus): Promise<Order> => {
  try {
    const response = await api.put(`${BASE_ORDER}/${orderId}`, {status})
    return response.data
  } catch (error) {
    console.error("Get order by id error:", error)
    throw error
  }
}

export const deleteOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.delete(`${BASE_ORDER}/${orderId}`)
    return response.data
  } catch (error) {
    console.error("Delete order by id error:", error)
    throw error
  }
}

// upload slip
export const uploadOrderSlip = async (orderId: string, file: File): Promise<Order> => {
  try {
    const response = await api.post(`${BASE_ORDER}/${orderId}/upload-slip`)
    await uploadImage(file, response.data.upload_url)
    return response.data
  } catch (error) {
    console.error("Upload order slip error:", error)
    throw error
  }
}
