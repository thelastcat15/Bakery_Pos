"use client"
import { Product } from "@/types/product_type"
import { CardProduct } from "./Card"

interface ProductListProps {
  products: Product[]
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {products.map((p) => (
        <CardProduct key={p.id} product={p} />
      ))}
    </div>
  )
}
