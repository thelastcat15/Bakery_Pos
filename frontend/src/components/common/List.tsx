"use client"
import { Product } from "@/types/product_type"
import { CardProduct } from "./Card"

interface ProductListProps {
  products: Product[]
}

export const SuggestList = ({ products }: ProductListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-4">
      {products.map((p) => (
        <CardProduct key={p.id} product={p} />
      ))}
    </div>
  )
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
      {products.map((p) => (
        <CardProduct key={p.id} product={p} />
      ))}
    </div>
  )
}
