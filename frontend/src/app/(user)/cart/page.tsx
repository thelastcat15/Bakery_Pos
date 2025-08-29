"use client"
import { PrimaryButton } from "@/components/common/Button"
import { CartList } from "@/components/common/List"
import { UseCart } from "@/hooks/useCart"

const CartPage = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = UseCart()

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 mt-4 md:mt-8">
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
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">รวมทั้งหมด</span>
            <span className="text-xl font-bold text-amber-500">
              ฿{getTotalPrice().toLocaleString()}
            </span>
          </div>
          <PrimaryButton
            onClick={() => console.log("Proceed to checkout")}
            className="w-full">
            ดำเนินการชำระเงิน
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}
export default CartPage
