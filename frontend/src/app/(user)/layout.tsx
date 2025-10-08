"use client"
import Navbar from "@/components/layout/Navbar"
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <OrderProvider>
      <CartProvider>
        <Navbar />
        <main>
          <section>{children}</section>
        </main>
      </CartProvider>
    </OrderProvider>
  )
}
export default UserLayout
