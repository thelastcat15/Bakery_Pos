import { Product } from "./product_type"

export interface CustomerInfo {
  name: string
  phone: string
  address: string
}

export interface Order {
  id: string
  date: string
  items: Product[]
  customerInfo: CustomerInfo
  total: number
  status: "pending" | "confirmed" | "shipping" | "delivered"
  paymentSlip?: File | string
  createdAt: Date
  updatedAt: Date
}
