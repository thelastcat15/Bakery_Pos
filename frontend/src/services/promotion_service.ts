import { api } from "./api"
import { Promotion } from "@/types/promotion_types"

const BASE = "/promotions"

export const getPromotions = async (): Promise<Promotion[]> => {
  try {
    const response = await api.get(`${BASE}`)
    return response.data
  } catch (error) {
    console.error("Get promotions error:", error)
    throw error
  }
}

export const createPromotion = async (
  body: Partial<Promotion>
): Promise<Promotion> => {
  try {
    const payload = {
      product_id: body.product_id,
      name: body.name,
      description: body.description,
      discount: body.discount,
      start_date: body.start_date,
      end_date: body.end_date,
      is_active: body.is_active ?? true,
    }
    const response = await api.post(`${BASE}`, payload)
    return response.data
  } catch (error) {
    console.error("Create promotion error:", error)
    throw error
  }
}

export const deletePromotion = async (id: number): Promise<void> => {
  try {
    await api.delete(`${BASE}/${id}`)
  } catch (error) {
    console.error("Delete promotion error:", error)
    throw error
  }
}
