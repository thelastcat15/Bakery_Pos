"use client"
import { useEffect, useState } from "react"
import { getProductSalesSummary, getProductCustomers } from "@/services/report_service"
import { ProductSalesSummary, ProductCustomerDetail } from "@/types/product_type"

// local state populated from API
const ProductSalesDetail = () => {
  const [productSummaries, setProductSummaries] = useState<ProductSalesSummary[]>([])
  const [customerDetails, setCustomerDetails] = useState<ProductCustomerDetail[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await getProductSalesSummary(undefined, undefined, page, limit)
        // backend supports both paginated object or legacy array
        if (Array.isArray(res)) {
          setProductSummaries(res)
          setTotal(res.length)
          setTotalPages(1)
        } else {
          setProductSummaries(res.data)
          setTotal(res.total)
          setTotalPages(Math.max(1, Math.ceil(res.total / (res.limit || limit))))
        }
      } catch (err) {
        console.error("Failed to load product summaries", err)
      }
    }
    fetchSummaries()
  }, [])

  // refetch when page changes
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await getProductSalesSummary(undefined, undefined, page, limit)
        if (Array.isArray(res)) {
          setProductSummaries(res)
          setTotal(res.length)
          setTotalPages(1)
        } else {
          setProductSummaries(res.data)
          setTotal(res.total)
          setTotalPages(Math.max(1, Math.ceil(res.total / (res.limit || limit))))
        }
      } catch (err) {
        console.error("Failed to load product summaries page", err)
      }
    }
    fetchPage()
  }, [page, limit])

  useEffect(() => {
    if (!selectedProductId) {
      setCustomerDetails([])
      return
    }
    const fetchCustomers = async () => {
      try {
        const data = await getProductCustomers(selectedProductId)
        setCustomerDetails(data)
      } catch (err) {
        console.error("Failed to load customers for product", err)
      }
    }
    fetchCustomers()
  }, [selectedProductId])

  const selectedProduct = productSummaries.find((p) => p.product_id === selectedProductId)
  const totalCustomers = customerDetails.length

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
              {productSummaries.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.total_quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.total_revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
          <div className="text-sm text-gray-600">รวม {total.toLocaleString()} รายการ</div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ก่อนหน้า
            </button>
            <div className="text-sm text-gray-700">{page} / {totalPages}</div>
            <button
              className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              ถัดไป
            </button>
          </div>
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
            onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : null)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="">--- เลือกสินค้า ---</option>
            {productSummaries.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.product_name}
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
                {selectedProduct.product_name}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                ลูกค้าทั้งหมด{" "}
                <span className="font-semibold">{totalCustomers}</span> คน |
                ยอดขายรวม{" "}
                <span className="font-semibold">
                  {selectedProduct.total_revenue.toLocaleString()}
                </span>{" "}
                บาท | ขายแล้ว{" "}
                <span className="font-semibold">
                  {selectedProduct.total_quantity.toLocaleString()}
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
                {customerDetails.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {customer.customer_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">
                      {customer.order_count}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">
                      {customer.total_quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">
                      {customer.total_amount.toLocaleString()}
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
