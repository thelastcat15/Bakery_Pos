import { Product } from "./product_type"

export interface CartItem extends Product {
  id: number        
  quantity: number
  sale_price: number
}
