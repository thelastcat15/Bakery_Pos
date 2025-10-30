import { Image } from "./image_type"

export interface Product {
  id?: number
  name: string
  images?: Image[]
  detail: string
  price: number
  category: string
  quantity?: number
}
export interface ReportProduct {
  product_id: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface SalesByHourReport {
  hour: string;
  total: number;
  orders: number;
}

export interface SalesByDayReport {
  date: string;
  total: number;
  orders: number;
}

export interface ProductSalesSummary {
  product_id: number;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface ProductCustomerDetail {
  customer_id: string;
  customer_name: string;
  order_count: number;
  total_quantity: number;
  total_amount: number;
}
