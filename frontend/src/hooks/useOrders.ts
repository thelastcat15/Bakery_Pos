import { CustomerInfo, Order, OrderItem } from "@/types/order_type"
import { useCallback, useEffect, useState } from "react"

const ORDER_STORAGE_KEY = "customer_orders"

const saveOrderToStorage = (orders: Order[]) => {
  try {
    const ordersForStorage = orders.map((order) => ({
      ...order,
      paymentSlip:
        order.paymentSlip instanceof File ? "file_uploaded" : order.paymentSlip,
    }))

    const ordersData = JSON.stringify(ordersForStorage)
    // save to backend
    console.log("Orders would be saved to backend:", ordersForStorage)
  } catch (error) {
    console.error("Failed to save orders:", error)
  }
}

const loadOrdersFromStorage = (): Order[] => {
  try {
    // In real app, this would fetch from backend API
    return [
      {
        id: "ORD001",
        date: "2025-08-30",
        items: [
          {
            id: 1,
            name: "กาแฟ Americano",
            image: "/images/americano.jpg",
            detail: "",
            price: 120,
            category: "drink",
            quantity: 1,
          },
          {
            id: 4,
            name: "เค้กช็อกโกแลต",
            image: "/images/cake.jpg",
            detail: "",
            price: 125,
            category: "cake",
            quantity: 1,
          },
        ],
        customerInfo: {
          name: "ลูกค้า A",
          phone: "081-234-5678",
          address: "กรุงเทพ",
        },
        total: 245,
        status: "confirmed",
        paymentSlip: "https://example.com/payment-slips/slip-001.jpg", // URL ธรรมดา
        createdAt: new Date("2025-08-30"),
        updatedAt: new Date("2025-08-30"),
      },
      {
        id: "ORD002",
        date: "2025-08-29",
        items: [
          {
            id: 2,
            name: "ชาเขียว",
            image: "/images/tea.jpg",
            detail: "",
            price: 80,
            category: "drink",
            quantity: 1,
          },
          {
            id: 6,
            name: "คุกกี้",
            image: "/images/cookie.jpg",
            detail: "",
            price: 100,
            category: "cookie",
            quantity: 1,
          },
        ],
        customerInfo: {
          name: "ลูกค้า B",
          phone: "082-345-6789",
          address: "เชียงใหม่",
        },
        total: 180,
        status: "shipping",
        paymentSlip: "images/slips/slip.jpg", // URL ธรรมดา
        createdAt: new Date("2025-08-29"),
        updatedAt: new Date("2025-08-29"),
      },
      {
        id: "ORD003",
        date: "2025-08-28",
        items: [
          {
            id: 3,
            name: "โดนัท",
            image: "/images/donut.jpg",
            detail: "",
            price: 60,
            category: "cake",
            quantity: 2,
          },
        ],
        customerInfo: {
          name: "ลูกค้า C",
          phone: "083-456-7890",
          address: "ขอนแก่น",
        },
        total: 120,
        status: "pending",
        paymentSlip: undefined, // ไม่มีสลิป
        createdAt: new Date("2025-08-28"),
        updatedAt: new Date("2025-08-28"),
      },
    ]
  } catch (error) {
    console.error("Failed to load orders:", error)
    return []
  }
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedOrders = loadOrdersFromStorage()
    setOrders(savedOrders)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded && orders.length > 0) {
      saveOrderToStorage(orders)
    }
  }, [orders, isLoaded])

  const createOrder = useCallback(
    (items: OrderItem[], customerInfo: CustomerInfo, paymentSlip: File) => {
      const newOrder: Order = {
        id: `ORD${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split("T")[0],
        items,
        customerInfo,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "pending",
        paymentSlip,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setOrders((prev) => [newOrder, ...prev])
      return newOrder.id
    },
    []
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date() }
            : order
        )
      )
    },
    []
  )

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }, [])

  const getOrdersByStatus = useCallback(
    (status?: Order["status"]) => {
      if (!status) return orders
      return orders.filter((order) => order.status === status)
    },
    [orders]
  )

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find((order) => order.id === orderId)
    },
    [orders]
  )

  return {
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrdersByStatus,
    getOrderById,
    isLoaded,
  }
}
