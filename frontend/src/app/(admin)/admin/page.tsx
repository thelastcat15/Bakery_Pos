"use client"
import AdminOverview from "@/components/features/admin/AdminOverview"
import OrderManagement from "@/components/features/admin/OrderManagement"
import ProductManagement from "@/components/features/admin/ProductManagement"
import ProductSalesDetail from "@/components/features/admin/ProductSalesDetail"
import PromotionManagement from "@/components/features/admin/PromotionManagement"
import {
  OrdersIcon,
  OverviewIcon,
  ProductSalesIcon,
  ProductsIcon,
  PromotionsIcon,
} from "@/components/shared/Icons"
import { CartProvider } from "@/context/CartContext"
import { OrderProvider } from "@/context/OrderContext"

import { useState } from "react"

const AdminDashBoard = () => {
  const [activeMenu, setActiveMenu] = useState("overview")

  const menuItems = [
    { id: "overview", label: "ภาพรวม", icon: <OverviewIcon /> },
    { id: "products", label: "จัดการสินค้า", icon: <ProductsIcon /> },
    { id: "orders", label: "จัดการคำสั่งซื้อ", icon: <OrdersIcon /> },
    { id: "promotions", label: "โปรโมชั่น", icon: <PromotionsIcon /> },
    { id: "productSales", label: "รายงานการขาย", icon: <ProductSalesIcon /> },
  ]

  return (
    <OrderProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-100 flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm border-r">
            <div className="p-6">
              <h1 className="text-xl font-bold text-amber-600">
                Sweet Heaven Admin
              </h1>
              <nav className="mt-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full text-left px-6 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      activeMenu === item.id
                        ? "bg-amber-50 border-r-2 border-amber-500 text-amber-700"
                        : "text-gray-700"
                    }`}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">
            {activeMenu === "overview" && <AdminOverview />}
            {activeMenu === "products" && <ProductManagement />}
            {activeMenu === "orders" && <OrderManagement />}
            {activeMenu === "promotions" && <PromotionManagement />}
            {activeMenu === "productSales" && <ProductSalesDetail />}
          </main>
        </div>
      </CartProvider>
    </OrderProvider>
  )
}

export default AdminDashBoard
