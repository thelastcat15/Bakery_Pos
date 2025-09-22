import { Product } from "./product_type"

export interface CustomerInfo {
  name: string
  phone: string
  address: string
}

export interface OrderItem {
  orderID: string
  productID: number
  quantity: number

  name: string
  description: string
  tag: string
  price: number
  imageURL: string
}

export interface Order {
  order_id: string
  total: number
  status: string
  public_url?: string
  upload_url?: string

  items: OrderItem[]
}


// Add id Order Custom