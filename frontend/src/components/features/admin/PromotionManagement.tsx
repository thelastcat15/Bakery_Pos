"use client"
import { usePromotions } from "@/hooks/usePromotions"
import { getAllProducts } from "@/services/product_service"
import { Product } from "@/types/product_type"
import { useEffect, useState, useRef } from "react"

// ฟอร์มใช้ type แยกเพื่อให้ discount เป็น string ได้
type PromotionForm = {
  name: string
  product_id: number | ""
  description: string
  discount: string
  startDate: string
  endDate: string
}

const PromotionManagement = () => {
  const [newPromotion, setNewPromotion] = useState<PromotionForm>({
    name: "",
    product_id: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
  })

  const [products, setProducts] = useState<Product[]>([])
  // server-side search removed — using client-side filter on loaded products
  const [productInput, setProductInput] = useState("")
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const productContainerRef = useRef<HTMLDivElement | null>(null)

  const handleListProduct = async () => {
    // request light weight fields for selection
    const data = await getAllProducts(null, true)
    setProducts(data)
    // categories no longer used; promotions target products only
  }

  // close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        productContainerRef.current &&
        !productContainerRef.current.contains(e.target as Node)
      ) {
        setIsProductDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  useEffect(() => {
    handleListProduct()
  }, [])

  const { promotions, createPromotion, deletePromotion, getDiscountedPrice } =
    usePromotions()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">จัดการโปรโมชั่น</h2>

      {/* Add New Promotion */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">สร้างโปรโมชั่นใหม่</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              ชื่อโปรโมชั่น
            </label>
            <input
              type="text"
              value={newPromotion.name}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="เช่น ลดพิเศษวันหยุด"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
            <textarea
              value={newPromotion.description}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="คำอธิบายโปรโมชั่น (จะแสดงในหน้ารายการ)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* search button removed; use the dropdown input to filter loaded products */}
            <div ref={productContainerRef} className="relative">
              <label className="block text-sm font-medium mb-1">เลือกสินค้า</label>
              <input
                type="text"
                value={productInput}
                onChange={(e) => {
                  setProductInput(e.target.value)
                  setIsProductDropdownOpen(true)
                }}
                onFocus={() => setIsProductDropdownOpen(true)}
                placeholder="พิมพ์เพื่อค้นหาและเลือกสินค้า"
                className="w-full px-3 py-2 border rounded-lg"
              />

              {isProductDropdownOpen && (
                <ul className="absolute z-40 bg-white border rounded mt-1 w-full max-h-48 overflow-auto">
                  {products
                    .filter((p: any) =>
                      p.name.toLowerCase().includes(productInput.toLowerCase())
                    )
                    .map((product: any) => (
                      <li
                        key={product.id}
                        onMouseDown={(e) => {
                          // onMouseDown to prevent blur before click
                          e.preventDefault()
                          setNewPromotion({ ...newPromotion, product_id: product.id })
                          setProductInput(product.name)
                          setIsProductDropdownOpen(false)
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        {product.name}
                      </li>
                    ))}
                  {products.filter((p: any) =>
                    p.name.toLowerCase().includes(productInput.toLowerCase())
                  ).length === 0 && (
                    <li className="px-3 py-2 text-gray-500">ไม่พบสินค้า</li>
                  )}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ส่วนลด (%)
              </label>
              <input
                type="number"
                value={newPromotion.discount}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, discount: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="เช่น 10"
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                วันเริ่มต้น
              </label>
              <input
                type="date"
                value={newPromotion.startDate}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    startDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                วันสิ้นสุด
              </label>
              <input
                type="date"
                value={newPromotion.endDate}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              if (
                newPromotion.name &&
                newPromotion.discount &&
                newPromotion.startDate &&
                newPromotion.endDate
              ) {
                  if (!newPromotion.product_id) {
                    alert("กรุณาเลือกสินค้าเป้าหมายของโปรโมชั่น")
                    return
                  }

                  const payload = {
                    product_id: Number(newPromotion.product_id),
                    name: newPromotion.name,
                    description: newPromotion.description,
                    discount: Number(newPromotion.discount),
                    start_date: `${newPromotion.startDate}T00:00:00Z`,
                    end_date: `${newPromotion.endDate}T23:59:59Z`,
                    is_active: true,
                  }

                  await createPromotion(payload as any)

                setNewPromotion({
                  name: "",
                  product_id: "",
                  description: "",
                  discount: "",
                  startDate: "",
                  endDate: "",
                })
              } else {
                alert("กรุณากรอกข้อมูลให้ครบถ้วน")
              }
            }}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            สร้างโปรโมชั่น
          </button>
        </div>
      </div>

      {/* Active Promotions */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">โปรโมชั่นที่กำลังใช้งาน</h3>
        {promotions.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีโปรโมชั่น</p>
        ) : (
          <div className="space-y-4">
            {promotions.map((promo) => (
              <div key={promo.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{promo.name}</h4>
                  <button
                    onClick={() => deletePromotion(promo.id)}
                    className="text-red-500 hover:text-red-700">
                    ลบ
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
                <div className="text-sm">
                  <p>
                    <strong>เป้าหมาย:</strong>{" "}
                    {(() => {
                      const prod = products.find((p) => p.id === promo.product_id)
                      return prod ? `สินค้า ${prod.name}` : `สินค้า (ไม่พบ)`
                    })()}
                  </p>
                  <p>
                    <strong>ส่วนลด:</strong> {promo.discount}%
                  </p>
                  <p>
                    <strong>ระยะเวลา:</strong> {promo.start_date} ถึง{" "}
                    {promo.end_date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default PromotionManagement
