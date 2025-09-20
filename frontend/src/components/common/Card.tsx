import { Product } from "@/types/product_type"
import Image from "next/image"
import { CartButton, DecreaseButton, IncreaseButton } from "./Button"
import { UseCart } from "@/hooks/useCart"
import { Order } from "@/types/order_type"
import { usePromotions } from "@/hooks/usePromotions"

interface CardProductProps {
  product: Product
}

interface CardPromotionProps {
  product: Product
  promotion?: string
}

interface CardCartProps {
  product: Product
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export const CardProduct = ({ product }: CardProductProps) => {
  const { addToCart, getItemQuantity } = UseCart()
  const { getPriceDisplay } = usePromotions()
  const itemQuantity = getItemQuantity(product.id!!)
  const priceInfo = getPriceDisplay(product)

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
      <figure className="relative w-full h-40 md:h-56">
        {product.images!![0]?.public_url && (
          <Image
            src={product.images!![0]?.public_url}
            alt={product.name}
            fill
            className="object-cover hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          />
        )}
      </figure>
      {/* Discount badge */}
      {priceInfo.hasDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          -{priceInfo.discountPercentage}%
        </div>
      )}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="font-semibold md:text-lg text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1 flex-1">
          {product.detail}
        </p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 justify-between">
          {/* Price display */}
          <div className="flex gap-1">
            {priceInfo.hasDiscount ? (
              <>
                <span className="text-gray-400 text-sx line-through">
                  ฿{priceInfo.originalPrice.toLocaleString()}
                </span>
                <span className="text-green-600 text-sm md:text-lg font-bold">
                  ฿{priceInfo.discountedPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-amber-500 text-sm md:text-lg font-bold">
                ฿{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <CartButton onClick={handleAddToCart}>
            <div className="flex justify-center gap-2 items-center">
              <span>เพิ่ม</span>
              {itemQuantity > 0 && (
                <span className="min-w-[20px] h-5 px-1 flex items-center justify-center text-xs bg-amber-100 text-amber-800 rounded-full">
                  {itemQuantity}
                </span>
              )}
            </div>
          </CartButton>
        </div>
      </div>
    </div>
  )
}

export const CardCart = ({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CardCartProps) => {
  const { getPriceDisplay } = usePromotions()
  const priceInfo = getPriceDisplay(product)
  const totalPrice = priceInfo.discountedPrice * quantity
  const originalTotalPrice = priceInfo.originalPrice * quantity

  return (
    <div className="flex justify-between items-center px-4 md:px-6">
      <div className="flex items-center gap-4">
        <figure className="relative h-18 w-18 md:h-20 md:w-20">
          <Image
            src={product.images ? product.images[0].public_url!! : ""}
            alt={product.name}
            fill
            className="object-cover p-1 rounded-lg"
          />
        </figure>
        <div>
          <h3 className="text-sm md:text-lg font-medium leading-tight">
            {product.name}
          </h3>
          {/* Price per item */}
          <div className="text-xs md:text-sm text-gray-600">
            {priceInfo.hasDiscount ? (
              <div className="flex item-center gap-2">
                <span className="line-through text-gray-600">
                  ฿{priceInfo.originalPrice.toLocaleString()}
                </span>
                <span className="text-green-600 font-medium">
                  ฿{priceInfo.discountedPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-red-500 text-white px-1 rounded">
                  -{priceInfo.discountPercentage}%
                </span>
              </div>
            ) : (
              <span>฿{product.price.toLocaleString()} / ชิ้น</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-44 md:w-60 gap-4 md:gap-14">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <DecreaseButton onClick={onDecrease} />
          <div>{quantity.toLocaleString()}</div>
          <IncreaseButton onClick={onIncrease} />
        </div>
        <div className="text-right">
          {/* Total price for this item */}
          {priceInfo.hasDiscount ? (
            <div>
              <p className="text-xs text-gray-400 line-through">
                ฿{originalTotalPrice.toLocaleString()}
              </p>
              <p className="font-medium text-green-600">
                ฿{totalPrice.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="font-medium">฿{totalPrice.toLocaleString()}</p>
          )}
          <button
            onClick={onRemove}
            className="text-red-500 text-xs hover:text-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4">
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const statusConfig = {
  all: { label: "ทั้งหมด", color: "bg-gray-100 text-gray-700" },
  pending: { label: "รอยืนยัน", color: "bg-orange-100 text-orange-700" },
  confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-700" },
  shipping: { label: "กำลังจัดส่ง", color: "bg-yellow-100 text-yellow-700" },
  delivered: { label: "จัดส่งสำเร็จ", color: "bg-green-100 text-green-700" },
}

interface OrderProps {
  order: Order
}

export const OrderCard = ({ order }: OrderProps) => {
  const statusStyle = statusConfig[order.status]

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">#{order.id}</h3>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}>
          {statusStyle.label}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600 mb-1">รายการสินค้า:</p>
        <ul className="text-sm">
          {order.items.map((item, index) => (
            <li key={index} className="text-gray-700">
              • {item.name} x{item.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="font-semibold text-amber-500">
          ฿{order.total.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
