import { api } from "./api"
import { Order } from "@/types/order_type"

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
export const uploadOrderSlip = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.post(`${BASE_ORDER}/${orderId}/upload-slip`)
    return response.data
  } catch (error) {
    console.error("Upload order slip error:", error)
    throw error
  }
}
