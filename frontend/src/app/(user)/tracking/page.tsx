"use client"
import { CategoryButton } from "@/components/common/Button"
import { OrderCard } from "@/components/common/Card"
import { useOrders } from "@/context/OrderContext"
import { useEffect, useState } from "react"

const OrderTrackingPage = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const { orders, isLoaded, reloadOrders } = useOrders()

  const safeOrders = orders ?? []

  const filteredOrders =
    activeFilter === "all"
      ? safeOrders
      : safeOrders.filter((order) => order.status === activeFilter)

  const categories = [
    {
      children: "ทั้งหมด",
      active: activeFilter === "all",
      onClick: () => setActiveFilter("all"),
    },
    {
      children: "รอยืนยัน",
      active: activeFilter === "pending",
      onClick: () => setActiveFilter("pending"),
    },
    {
      children: "ยืนยันแล้ว",
      active: activeFilter === "confirmed",
      onClick: () => setActiveFilter("confirmed"),
    },
    {
      children: "กำลังจัดส่ง",
      active: activeFilter === "shipping",
      onClick: () => setActiveFilter("shipping"),
    },
    {
      children: "จัดส่งสำเร็จ",
      active: activeFilter === "delivered",
      onClick: () => setActiveFilter("delivered"),
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">ติดตามคำสั่งซื้อ</h1>
        <p className="text-gray-600">ตรวจสอบสถานะคำสั่งซื้อของคุณ</p>
      </div>

      {/* filter buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              children={category.children}
              active={category.active}
              onClick={category.onClick}
            />
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {!isLoaded || !filteredOrders ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">กำลังโหลด...</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white rounded-2xl p-4 md:p-6">
        <h3 className="font-semibold mb-3">สรุป</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-orange-500">
              {safeOrders.filter((o) => o.status === "pending").length}
            </div>
            <div className="text-xs text-gray-600>">รอยืนยัน</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-500">
              {safeOrders.filter((o) => o.status === "confirmed").length}
            </div>
            <div className="text-xs text-gray-600>">ยืนยันแล้ว</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-500">
              {safeOrders.filter((o) => o.status === "shipping").length}
            </div>
            <div className="text-xs text-gray-600>">กำลังจัดส่ง</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-500">
              {safeOrders.filter((o) => o.status === "delivered").length}
            </div>
            <div className="text-xs text-gray-600>">จัดส่งสำเร็จ</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default OrderTrackingPage
