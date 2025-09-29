"use client"

import { useOrders } from "@/context/OrderContext"
import { useState } from "react"

const OrderManagement = () => {
  const { orders, updateOrderStatus, deleteOrder, isLoaded } = useOrders()

  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)
  type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered"

  const getStatusLabel = (status: string): string => {
    const statusLabels: Record<OrderStatus, string> = {
      pending: "รอยืนยัน",
      confirmed: "ยืนยันแล้ว",
      shipping: "กำลังจัดส่ง",
      delivered: "จัดส่งสำเร็จ",
    }
    return statusLabels[status as OrderStatus] || status
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<OrderStatus, string> = {
      pending: "bg-orange-100 text-orange-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipping: "bg-yellow-100 text-yellow-700",
      delivered: "bg-green-100 text-green-700",
    }
    return statusColors[status as OrderStatus] || "bg-gray-100 text-gray-700"
  }

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      pending: "confirmed",
      confirmed: "shipping",
      shipping: "delivered",
    }
    return statusFlow[currentStatus] || null
  }

  const getNextStatusLabel = (currentStatus: string): string => {
    const nextStatusLabels: Record<string, string> = {
      pending: "ยืนยัน",
      confirmed: "จัดส่ง",
      shipping: "สำเร็จ",
    }
    return nextStatusLabels[currentStatus] || ""
  }

  if (!isLoaded) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">จัดการคำสั่งซื้อ</h2>

      {/* Orders Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">รอยืนยัน</h3>
          <p className="text-2xl font-bold text-orange-600">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">ยืนยันแล้ว</h3>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter((o) => o.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">กำลังจัดส่ง</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter((o) => o.status === "shipping").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-600">จัดส่งสำเร็จ</h3>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === "delivered").length}
          </p>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center text-gray-500">
            ยังไม่มีคำสั่งซื้อ
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.order_id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">#{order.order_id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.create_at).toLocaleString("th-TH")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() => {
                        const nextStatus = getNextStatus(order.status)
                        if (nextStatus) {
                          updateOrderStatus(order.order_id, nextStatus as any)
                        }
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                      {getNextStatusLabel(order.status)}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm("ต้องการลบคำสั่งซื้อนี้หรือไม่?")) {
                        deleteOrder(order.order_id)
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    ลบ
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Customer Info */}
                <div>
                  <h4 className="font-medium mb-2">ลูกค้า</h4>
                  {/* <p className="text-sm">{order.customerInfo.name}</p>
                  <p className="text-sm text-gray-600">
                    {order.customerInfo.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.customerInfo.address}
                  </p> */}
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-medium mb-2">รายการสินค้า</h4>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm flex justify-between">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>
                          ฿{(item.price * item.quantity!!).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <h4 className="font-medium mb-2">การชำระเงิน</h4>
                  <p className="text-lg font-bold text-amber-600 mb-2">
                    ฿{order.total.toLocaleString()}
                  </p>
                  {order.public_url ? (
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-1 text-green-600">
                        <span>✓</span>
                        <span>มีสลิปการโอน</span>
                      </div>
                      <div className="border rounded p-2 bg-gray-50">
                        <p className="font-medium text-xs mb-1">
                          📄 สลิปการโอน
                        </p>
                        <img
                          src={order.public_url}
                          alt="Payment slip"
                          className="max-w-full h-24 object-contain border rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            setSelectedSlip(order.public_url as string)
                          }
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            const fallback = document.createElement("div")
                            fallback.className = "text-xs text-gray-500 p-2"
                            fallback.textContent = "ไม่สามารถโหลดสลิปได้"
                            target.parentNode?.appendChild(fallback)
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">
                      <span>✗ ไม่มีสลิปการโอน</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal สำหรับดูรูปเต็ม */}
      {selectedSlip && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSlip(null)}>
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute -top-10 right-0 text-white text-xl hover:text-gray-300">
              ✕ ปิด
            </button>
            <img
              src={selectedSlip}
              alt="Payment slip full size"
              className="max-w-full max-h-full object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
export default OrderManagement
