import { ReportProduct, SalesByHourReport, ProductSalesSummary, ProductCustomerDetail } from "@/types/product_type"
import { api } from "./api"

const BASE_CART = "/reports"

export const getTopProducts = async (): Promise<ReportProduct[]> => {
  try {
    const response = await api.get(`${BASE_CART}/products/top`)
    return response.data
  } catch (error) {
    console.error("Get top products error:", error)
    throw error
  }
}

export const getSalesByHour = async (date?: string): Promise<SalesByHourReport[]> => {
  try {
    const params = date ? { params: { date } } : undefined
    const response = await api.get(`${BASE_CART}/sales/hourly`, params)
    return response.data
  } catch (error) {
    console.error("Get sales by hour error:", error)
    throw error
  }
}

export const getProductSalesSummary = async (start?: string, end?: string): Promise<ProductSalesSummary[]> => {
  try {
    const response = await api.get(`${BASE_CART}/products/sales`, { params: { start, end } })
    return response.data
  } catch (error) {
    console.error("Get product sales summary error:", error)
    throw error
  }
}

export const getProductCustomers = async (productId: number, start?: string, end?: string): Promise<ProductCustomerDetail[]> => {
  try {
    const response = await api.get(`${BASE_CART}/products/${productId}/customers`, { params: { start, end } })
    return response.data
  } catch (error) {
    console.error("Get product customers error:", error)
    throw error
  }
}

export const getSalesByDay = async (start: string, end: string): Promise<import("@/types/product_type").SalesByDayReport[]> => {
  try {
    const response = await api.get(`${BASE_CART}/sales/daily`, { params: { start, end } })
    return response.data
  } catch (error) {
    console.error("Get sales by day error:", error)
    throw error
  }
}
