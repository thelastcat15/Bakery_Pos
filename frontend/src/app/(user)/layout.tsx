"use client"
import Navbar from "@/components/layout/Navbar"
import { CartProvider } from "@/context/CartContext";

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <section>{children}</section>
      </main>
    </CartProvider>
  )
}
export default UserLayout
