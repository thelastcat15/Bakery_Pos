import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Order, OrderStatus } from "@/types/order_type"
import {
  getAllOrder,
  getOrderById as fetchOrderById,
  deleteOrderById,
  uploadOrderSlip,
  updateOrderStatusById,
} from "@/services/order_service"

// 1. ประกาศ type สำหรับ context
interface OrderContextType {
  orders: Order[]
  isLoaded: boolean
  isLoading: boolean
  error: string | null
  deleteOrder: (orderId: string) => Promise<void>
  uploadSlip: (orderId: string, file: File) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  getOrderById: (orderId: string) => Promise<Order | undefined>
  reloadOrders: () => Promise<void>
}

// 2. สร้าง Context
const OrderContext = createContext<OrderContextType | undefined>(undefined)

// 3. Provider component
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // โหลดทั้งหมดจาก backend
  const reloadOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllOrder()
      setOrders(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to load orders")
    } finally {
      setIsLoaded(true)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reloadOrders()
  }, [reloadOrders])

  // ลบ order
  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      await deleteOrderById(orderId)
      setOrders((prev) => prev.filter((order) => order.order_id !== orderId))
    } catch (err: any) {
      setError(err.message || "Failed to delete order")
    }
  }, [])

  // อัพโหลดสลิป
  const uploadSlip = useCallback(async (orderId: string, file: File) => {
    try {
      const updatedOrder = await uploadOrderSlip(orderId, file)
      if (!updatedOrder) return
        setOrders((prev) =>
          prev.map((order) => (order.order_id === orderId ? updatedOrder : order))
        )
    } catch (err: any) {
      setError(err.message || "Failed to upload slip")
    }
  }, [])

  // ดึง order เดี่ยว
  const getOrderById = useCallback(async (orderId: string): Promise<Order | undefined> => {
    try {
      const res: Order = await fetchOrderById(orderId)
      return res
    } catch (err: any) {
      setError(err.message || "Failed to get order")
      return undefined
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatusById(orderId, status)
      if (!updatedOrder) return
      setOrders((prev) =>
        prev.map((order) => (order.order_id === orderId ? updatedOrder : order))
      )

    } catch (err: any) {
      setError(err.message || "Failed to update order status")
    }
  },[])

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoaded,
        isLoading,
        error,
        deleteOrder,
        uploadSlip,
        updateOrderStatus,
        getOrderById,
        reloadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

// 4. Hook สำหรับใช้ Context
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}