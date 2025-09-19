"use client"
import { usePromotions } from "@/hooks/usePromotions"
import { getAllProducts } from "@/services/product_service"
import { Category } from "@/types/category_type"
import { Product } from "@/types/product_type"
import { Promotion } from "@/types/promotion_types"
import { useEffect, useState } from "react"

// ฟอร์มใช้ type แยกเพื่อให้ discount เป็น string ได้
type PromotionForm = Omit<
  Promotion,
  "id" | "createdAt" | "updatedAt" | "discount"
> & {
  discount: string
}

const PromotionManagement = () => {
  const [newPromotion, setNewPromotion] = useState<PromotionForm>({
    name: "",
    type: "all",
    target: "",
    discount: "",
    startDate: "",
    endDate: "",
    announcement: "",
  })

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])

  const handleListProduct = async () => {
    const data = await getAllProducts()
    setProducts(data)
    const uniqCategories = Array.from(new Set(data.map((p) => p.category)))

    setCategories(uniqCategories)
  }

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
            <label className="block text-sm font-medium mb-1">
              ข้อความประกาศ
            </label>
            <textarea
              value={newPromotion.announcement}
              onChange={(e) =>
                setNewPromotion({
                  ...newPromotion,
                  announcement: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="ข้อความที่จะแสดงให้ลูกค้าเห็น"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                ประเภทเป้าหมาย
              </label>
              <select
                value={newPromotion.type}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    type: e.target.value as "all" | "category" | "product",
                    target: "",
                  })
                }
                className="w-full px-3 py-2 border rounded-lg">
                <option value="all">ทุกสินค้า</option>
                <option value="category">ตามหมวดหมู่</option>
                <option value="product">สินค้าเฉพาะ</option>
              </select>
            </div>

            {newPromotion.type === "category" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  เลือกหมวดหมู่
                </label>
                <select
                  value={newPromotion.target}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, target: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg">
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {newPromotion.type === "product" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  เลือกสินค้า
                </label>
                <select
                  value={newPromotion.target}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, target: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg">
                  <option value="">เลือกสินค้า</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
            onClick={() => {
              if (
                newPromotion.name &&
                newPromotion.discount &&
                newPromotion.startDate &&
                newPromotion.endDate
              ) {
                if (newPromotion.type !== "all" && !newPromotion.target) {
                  alert("กรุณาเลือกเป้าหมายของโปรโมชั่น")
                  return
                }

                const promotion: Omit<
                  Promotion,
                  "id" | "createdAt" | "updatedAt"
                > = {
                  ...newPromotion,
                  discount: parseInt(newPromotion.discount),
                }

                createPromotion(promotion)

                setNewPromotion({
                  name: "",
                  type: "all",
                  target: "",
                  discount: "",
                  startDate: "",
                  endDate: "",
                  announcement: "",
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
                <p className="text-sm text-gray-600 mb-2">
                  {promo.announcement}
                </p>
                <div className="text-sm">
                  <p>
                    <strong>เป้าหมาย:</strong>{" "}
                    {promo.type === "all"
                      ? "ทุกสินค้า"
                      : promo.type === "category"
                      ? `หมวดหมู่ ${promo.target}`
                      : `สินค้า ${promo.target}`}
                  </p>
                  <p>
                    <strong>ส่วนลด:</strong> {promo.discount}%
                  </p>
                  <p>
                    <strong>ระยะเวลา:</strong> {promo.startDate} ถึง{" "}
                    {promo.endDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">
          ตัวอย่างสินค้าหลังใช้โปรโมชั่น
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => {
            const discountedPrice = getDiscountedPrice(product)
            const hasDiscount = discountedPrice < product.price

            return (
              <div key={product.id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{product.name}</h4>
                <div className="space-y-1">
                  {hasDiscount ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 line-through text-sm">
                          ฿{product.price}
                        </span>
                        <span className="bg-red-500 text-white text-xs px-1 rounded">
                          -
                          {Math.round(
                            ((product.price - discountedPrice) /
                              product.price) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <p className="text-green-600 font-bold">
                        ฿{Math.round(discountedPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium">฿{product.price}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default PromotionManagement
