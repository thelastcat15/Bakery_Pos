import { Product } from "@/types/product_type"
import Image from "next/image"
import { CartButton } from "./Button"

interface CardProductProps {
  product: Product
}

interface CardPromotionProps {
  product: Product
  promotion?: string
}

export const CardProduct = ({ product }: CardProductProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
      <figure className="relative w-full h-40 md:h-56">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover  hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        />
      </figure>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="font-semibold md:text-lg text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1 flex-1">
          {product.detail}
        </p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 justify-between">
          <span className="text-amber-500 text-sm md:text-lg font-bold">
            ฿{product.price}
          </span>
          <CartButton onClick={() => console.log("")}></CartButton>
        </div>
      </div>
    </div>
  )
}
