export interface Promotion {
  id: number
  name: string
  type: "all" | "category" | "product"
  target: string
  discount: number
  startDate: string
  endDate: string
  announcement: string
  createdAt: Date
  updatedAt: Date
}
