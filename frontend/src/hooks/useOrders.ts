import { useCallback, useEffect, useState } from "react"
import { Order } from "@/types/order_type"
import {
  getAllOrder,
  getOrderById as fetchOrderById,
  deleteOrderById,
  uploadOrderSlip,
} from "@/services/order_service"

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // โหลดทั้งหมดจาก backend
  // useEffect(() => {
  //   const loadOrders = async () => {
  //     setIsLoading(true)
  //     try {
  //       const data = await getAllOrder()
  //       setOrders(data)
  //     } catch (err: any) {
  //       setError(err.message || "Failed to load orders")
  //     } finally {
  //       setIsLoaded(true)
  //       setIsLoading(false)
  //     }
  //   }

  //   loadOrders()
  // }, [])

  // อัพเดตสถานะใน state (ในระบบจริงควรมี API update ด้วย)
  // const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
  //     setOrders((prev) =>
  //       prev.map((order) =>
  //         order.id === orderId
  //           ? { ...order, status, updatedAt: new Date() }
  //           : order
  //       )
  //     )
  //   },
  //   []
  // )

  // ลบ order (ทั้ง API + state)
  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      await deleteOrderById(orderId)
      setOrders((prev) => prev.filter((order) => order.order_id !== orderId))
    } catch (err: any) {
      setError(err.message || "Failed to delete order")
    }
  }, [])

  // อัพโหลดสลิป (API + อัพเดต state)
  const uploadSlip = useCallback(async (orderId: string) => {
    try {
      const updatedOrder = await uploadOrderSlip(orderId)
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId ? updatedOrder : order
        )
      )
    } catch (err: any) {
      setError(err.message || "Failed to upload slip")
    }
  }, [])

  // ดึง order เดี่ยวจาก backend
  const getOrderById = useCallback(
    async (orderId: string): Promise<Order | undefined> => {
      try {
        const res: Order = await fetchOrderById(orderId)
        return res
      } catch (err: any) {
        setError(err.message || "Failed to get order")
        return undefined
      }
    },
    []
  )

  // filter ตามสถานะ
  // const getOrdersByStatus = useCallback(
  //   (status?: Order["status"]) => {
  //     if (!status) return orders
  //     return orders.filter((order) => order.status === status)
  //   },
  //   [orders]
  // )

  return {
    orders,
    isLoaded,
    isLoading,
    error,
    // updateOrderStatus,
    deleteOrder,
    uploadSlip,
    // getOrdersByStatus,
    getOrderById,
  }
}
