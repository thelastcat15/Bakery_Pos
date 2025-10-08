"use client"
import { useState } from "react"

// Mock data - แทนที่ด้วยข้อมูลจริงจาก API
const mockProductSales = [
  {
    productId: 1,
    productName: "เค้กช็อกโกแลต",
    totalQuantity: 248,
    totalRevenue: 19840,
  },
  {
    productId: 2,
    productName: "เค้กวานิลลา",
    totalQuantity: 180,
    totalRevenue: 14400,
  },
  {
    productId: 3,
    productName: "คุกกี้ช็อกชิป",
    totalQuantity: 320,
    totalRevenue: 16000,
  },
  {
    productId: 4,
    productName: "บราวนี่",
    totalQuantity: 150,
    totalRevenue: 9000,
  },
]

const mockCustomerDetails: Record<
  number,
  {
    customerId: number
    customerName: string
    orderCount: number
    totalQuantity: number
    totalAmount: number
  }[]
> = {
  1: [
    // เค้กช็อกโกแลต
    {
      customerId: 1,
      customerName: "สมชาย ใจดี",
      orderCount: 5,
      totalQuantity: 45,
      totalAmount: 3600,
    },
    {
      customerId: 2,
      customerName: "สมหญิง สวยงาม",
      orderCount: 3,
      totalQuantity: 30,
      totalAmount: 2400,
    },
    {
      customerId: 3,
      customerName: "วิชัย มั่นคง",
      orderCount: 8,
      totalQuantity: 80,
      totalAmount: 6400,
    },
    {
      customerId: 4,
      customerName: "กานดา ดอกไม้",
      orderCount: 2,
      totalQuantity: 20,
      totalAmount: 1600,
    },
    {
      customerId: 5,
      customerName: "ประเสริฐ ดีเลิศ",
      orderCount: 4,
      totalQuantity: 35,
      totalAmount: 2800,
    },
    {
      customerId: 6,
      customerName: "สุดา รักษ์ดี",
      orderCount: 1,
      totalQuantity: 8,
      totalAmount: 640,
    },
    {
      customerId: 7,
      customerName: "นิรันดร์ ยั่งยืน",
      orderCount: 6,
      totalQuantity: 50,
      totalAmount: 4000,
    },
    {
      customerId: 8,
      customerName: "มานะ พยายาม",
      orderCount: 3,
      totalQuantity: 25,
      totalAmount: 2000,
    },
  ],
  2: [
    // เค้กวานิลลา
    {
      customerId: 1,
      customerName: "สมชาย ใจดี",
      orderCount: 3,
      totalQuantity: 30,
      totalAmount: 2400,
    },
    {
      customerId: 9,
      customerName: "ศิริพร แสงสว่าง",
      orderCount: 4,
      totalQuantity: 40,
      totalAmount: 3200,
    },
    {
      customerId: 10,
      customerName: "ธนา เงินงาม",
      orderCount: 5,
      totalQuantity: 50,
      totalAmount: 4000,
    },
  ],
  3: [
    // คุกกี้ช็อกชิป
    {
      customerId: 2,
      customerName: "สมหญิง สวยงาม",
      orderCount: 10,
      totalQuantity: 120,
      totalAmount: 6000,
    },
    {
      customerId: 11,
      customerName: "จิรา สุขใจ",
      orderCount: 8,
      totalQuantity: 100,
      totalAmount: 5000,
    },
  ],
  4: [
    // บราวนี่
    {
      customerId: 3,
      customerName: "วิชัย มั่นคง",
      orderCount: 6,
      totalQuantity: 60,
      totalAmount: 3600,
    },
    {
      customerId: 12,
      customerName: "พิมพ์ใจ รักงาม",
      orderCount: 4,
      totalQuantity: 40,
      totalAmount: 2400,
    },
  ],
}

const ProductSalesDetail = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  )

  const selectedProduct = mockProductSales.find(
    (p) => p.productId === selectedProductId
  )
  const customerData = selectedProductId
    ? mockCustomerDetails[selectedProductId] || []
    : []

  const totalCustomers = customerData.length

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          สรุปยอดขายสินค้า
        </h1>
        <p className="text-gray-600">
          ดูภาพรวมยอดขายและรายละเอียดลูกค้าที่ซื้อสินค้าแต่ละชนิด
        </p>
      </div>

      {/* Section1 : Product Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ภาพรวมสินค้าทั้งหมด
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* table แสดงชื่อสินค้า, จำนวนที่ขาย(ชิ้น), ยอดขายรวม (บาท) */}
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  ชื่อสินค้า
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  จำนวนที่ขาย (ชิ้น)
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  ยอดขายรวม (บาท)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockProductSales.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.totalQuantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Customer Details */}
      <div>
        <h2
          className="text-xl font-semibold text-gray-800 mb-
        4">
          รายละเอียดลูกค้าตามสินค้า
        </h2>

        {/* Product Selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            เลือกสินค้าเพื่อดูรายละเอียด
          </label>
          <select
            value={selectedProductId || ""}
            onChange={(e) =>
              setSelectedProductId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="">--- เลือกสินค้า ---</option>
            {mockProductSales.map((product) => (
              <option key={product.productName} value={product.productId}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>

        {/* Customer table -> ใคร, กี่ครั้ง, กี่ชิ้น, ยอดรวม */}
        {selectedProduct && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Summary Bar */}
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">สินค้าที่เลือก:</span>{" "}
                {selectedProduct.productName}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                ลูกค้าทั้งหมด{" "}
                <span className="font-semibold">{totalCustomers}</span> คน |
                ยอดขายรวม{" "}
                <span className="font-semibold">
                  {selectedProduct.totalRevenue.toLocaleString()}
                </span>{" "}
                บาท | ขายแล้ว{" "}
                <span className="font-semibold">
                  {selectedProduct.totalQuantity.toLocaleString()}
                </span>{" "}
                ชิ้น
              </p>
            </div>

            {/* Customer Data table */}
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    ชื่อลูกค้า
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    จำนวนครั้ง
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    จำนวนชิ้น
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    ยอดรวม (บาท)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerData.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {customer.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">
                      {customer.orderCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">
                      {customer.totalQuantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">
                      {customer.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!selectedProduct && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              กรุณาเลือกสินค้าเพื่อดูรายละเอียดลูกค้า
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
export default ProductSalesDetail
