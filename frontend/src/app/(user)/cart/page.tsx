"use client"
import { PrimaryButton } from "@/components/common/Button"
import { CartList } from "@/components/common/List"
import { UseCart } from "@/context/CartContext"
import { usePromotions } from "@/hooks/usePromotions"
import { checkout } from "@/services/cart_service"
import { useRouter } from "next/navigation";


const CartPage = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    getOriginalTotalPrice,
    getTotalSavings,
    clearCart,
  } = UseCart()

  const { getActiveAnnouncements } = usePromotions()
  const announcements = getActiveAnnouncements()
  const totalSavings = getTotalSavings()
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const checkoutData = await checkout()
      if (checkoutData.order_id) {
        router.push(`/checkout/${checkoutData.order_id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 mt-4 md:mt-8">
      {/* Promotion Annoucement */}
      {announcements.length > 0 && (
        <div className="mb-6 space-y-2">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm font-medium">
                🎉 {announcement}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between item-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          ตะกร้าสินค้า {getTotalItems().toLocaleString()} รายการ
        </h1>
        {cartItems.length > 0 && (
          <button onClick={clearCart}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6">
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <CartList
        cartItems={cartItems}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
      />

      {cartItems.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl p-4 md:p-6">
          {/* Show savings if any */}
          {totalSavings > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex justify-center items-center">
                <span className="text-green-800 font-medium">
                  🎉 คุณประหยัดได้
                </span>
                <span className="text-green-600 font-bold">
                  ฿{totalSavings.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {totalSavings > 0 && (
              <div className="flex justify-center items-center text-gray-600">
                <span>ราคาปกติ</span>
                <span className="line-through">
                  ฿{getOriginalTotalPrice().toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">รวมทั้งหมด</span>
              <span className="text-xl font-bold text-amber-500">
                ฿{getTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>
          <PrimaryButton
            onClick={handleCheckout}
            className="w-full">
            ดำเนินการชำระเงิน
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}
export default CartPage
