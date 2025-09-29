import { Product } from "./product_type"

export interface CustomerInfo {
  name: string
  phone: string
  address: string
}

export interface OrderItem {
  order_id: string
  product_id: number
  quantity: number

  name: string
  description: string
  tag: string
  price: number
}

export interface Order {
  order_id: string
  total: number
  status: OrderStatus
  public_url?: string
  upload_url?: string
  create_at: Date

  items: OrderItem[]
}

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered"



// Add id Order Custom