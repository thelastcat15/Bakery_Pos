"use client"
import { Product } from "@/types/product_type"
import { CardProduct } from "./Card"
import { CategoryButton } from "./Button"
import { Category } from "@/types/category_type"

interface ProductListProps {
  products: Product[]
}

interface CategoryListProps {
  categories: Category[]
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

export const CategoryList = ({ categories }: CategoryListProps) => {
  return (
    <div className="flex flex-wrap py-2 mb-6 gap-2">
      {categories.map((c, index) => (
        <CategoryButton
          key={index}
          children={c.children}
          onClick={c.onClick}
          href={c.href || ""}
          active={c.active || false}
          className={c.className || ""}
        />
      ))}
    </div>
  )
}
