import { Product } from "./product_type"

export interface CartItem extends Product {
  quantity: number
}
