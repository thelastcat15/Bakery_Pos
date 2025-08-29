import { CartList } from "@/components/common/List"
import { products } from "@/data/mock/product_mock"

const CartPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1>ตะกร้าสินค้า 2 รายการ</h1>
      <CartList products={products} />
    </div>
  )
}
export default CartPage
