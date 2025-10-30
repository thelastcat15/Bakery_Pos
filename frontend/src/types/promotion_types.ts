export interface Promotion {
  id: number
  product_id: number
  name: string
  description: string
  discount: number
  start_date: string
  end_date: string
  is_active: boolean
  createdAt: Date
  updatedAt: Date
}
