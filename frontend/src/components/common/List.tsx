"use client"
import { Product } from "@/types/product_type"
import { CardCart, CardProduct } from "./Card"
import { CategoryButton } from "./Button"
import { Category } from "@/types/category_type"
import { CartItem } from "@/types/cart_type"

interface ProductListProps {
  products: Product[]
}

interface CategoryListProps {
  categories: Category[]
}

interface CardListProps {
  cartItems: CartItem[]
  onIncrease: (productId: number) => void
  onDecrease: (productId: number) => void
  onRemove: (productId: number) => void
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

export const CartList = ({
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
}: CardListProps) => {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 md;p-6 text-center">
        <p className="text-gray-500">ตะกร้าของคุณว่างเปล่า</p>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl py-4 md:py-6">
      <div className="flex flex-col gap-2">
        {cartItems.map((item) => (
          <div key={item.id}>
            <CardCart
              product={item}
              quantity={item.quantity!!}
              onIncrease={() => onIncrease(item.id!!)}
              onDecrease={() => onDecrease(item.id!!)}
              onRemove={() => onRemove(item.id!!)}
            />
            <hr className="text-gray-200 mt-2 mb-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
