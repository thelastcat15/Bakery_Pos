import { UseCart } from "@/hooks/useCart"
import { useOrders } from "@/hooks/useOrders"

const mockCartItems = [
  {
    id: 1,
    name: "Chocolate Cake",
    image: "/images/products/cake.jpg",
    price: 120,
    quantity: 2,
  },
  {
    id: 3,
    name: "Croissant",
    image: "/images/products/croissant.jpg",
    price: 45,
    quantity: 3,
  },
]

const CheckoutPage = () => {
  const { cartItems, getTotalItems, clearCart } = UseCart()
  const { createOrder } = useOrders()
  const {} = useUser()
  return <div>CheckoutPage</div>
}
export default CheckoutPage
