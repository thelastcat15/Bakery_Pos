"use client"
import AdminOverview from "@/components/features/admin/AdminOverview"
import ProductManagement from "@/components/features/admin/ProductManagement"
import {
  OrdersIcon,
  OverviewIcon,
  ProductsIcon,
  PromotionsIcon,
} from "@/components/shared/Icons"
import { usePromotions } from "@/hooks/usePromotions"
import { useState } from "react"

// Mock data
const mockProducts = [
  { id: 1, name: "กาแฟ Americano", category: "drink", price: 120, stock: 15 },
  { id: 2, name: "ชาเขียว", category: "drink", price: 80, stock: 8 },
  { id: 3, name: "คัพเค้ก", category: "cake", price: 125, stock: 5 },
  { id: 4, name: "เค้กช็อกโกแลต", category: "cake", price: 180, stock: 12 },
  { id: 5, name: "คุกกี้", category: "cookie", price: 100, stock: 20 },
  { id: 6, name: "โดนัท", category: "donut", price: 65, stock: 3 },
]

const mockOrders = [
  {
    id: "ORD001",
    date: "2025-09-01 09:30",
    customerName: "สมชาย ใจดี",
    status: "pending",
    items: [
      { name: "กาแฟ Americano", quantity: 2 },
      { name: "คุกกี้", quantity: 3 },
    ],
    total: 540,
    address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
  },
  {
    id: "ORD002",
    date: "2025-09-01 08:15",
    customerName: "สมหญิง รักดี",
    status: "confirmed",
    items: [
      { name: "เค้กช็อกโกแลต", quantity: 1 },
      { name: "ชาเขียว", quantity: 2 },
    ],
    total: 340,
    address: "456 ถนนราชดำริ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330",
  },
  {
    id: "ORD003",
    date: "2025-08-31 16:45",
    customerName: "สมศักดิ์ มีสุข",
    status: "shipping",
    items: [
      { name: "คัพเค้ก", quantity: 4 },
      { name: "โดนัท", quantity: 2 },
    ],
    total: 630,
    address: "789 ถนนพระราม 4 แขวงสุริยวงศ์ เขตบางรัก กรุงเทพฯ 10500",
  },
  {
    id: "ORD004",
    date: "2025-08-31 14:20",
    customerName: "สมปอง ดีใจ",
    status: "delivered",
    items: [
      { name: "กาแฟ Americano", quantity: 1 },
      { name: "คุกกี้", quantity: 5 },
    ],
    total: 620,
    address: "321 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500",
  },
  {
    id: "ORD005",
    date: "2025-08-31 11:10",
    customerName: "สมใจ มั่นคง",
    status: "pending",
    items: [
      { name: "เค้กช็อกโกแลต", quantity: 2 },
      { name: "ชาเขียว", quantity: 1 },
    ],
    total: 440,
    address: "654 ถนนพญาไท แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400",
  },
]

const categories = ["drink", "cake", "cookie", "donut"]

const AdminDashBoard = () => {
  const [activeMenu, setActiveMenu] = useState("overview")
  const [products, setProducts] = useState(mockProducts)
  const [orders, setOrders] = useState(mockOrders)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  })
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    type: "all",
    target: "",
    discount: "",
    startDate: "",
    endDate: "",
    announcement: "",
  })

  const {
    promotions,
    createPromotion,
    deletePromotion,
    getDiscountedPrice,
    getPriceDisplay,
  } = usePromotions()

  const menuItems = [
    { id: "overview", label: "ภาพรวม", icon: <OverviewIcon /> },
    { id: "products", label: "จัดการสินค้า", icon: <ProductsIcon /> },
    { id: "orders", label: "จัดการคำสั่งซื้อ", icon: <OrdersIcon /> },
    { id: "promotions", label: "โปรโมชั่น", icon: <PromotionsIcon /> },
  ]

  return (
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
      </main>
    </div>
  )
}

export default AdminDashBoard
