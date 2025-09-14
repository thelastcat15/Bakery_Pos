import { Image } from "./image_type"

export interface Product {
  id?: number
  name: string
  image?: Image
  detail: string
  price: number
  category: string
  quantity?: number
}
