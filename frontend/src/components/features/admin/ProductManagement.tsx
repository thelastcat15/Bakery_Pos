"use client"

import { Product } from "@/types/product_type"
import { useState } from "react"

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "กาแฟ Americano",
    category: "drink",
    price: 120,
    stock: 15,
    image: "/images/products/americano.jpg",
    detail: "กาแฟอเมริกาโน่ รสชาติเข้มข้น หอมกรุ่น",
  },
  {
    id: 2,
    name: "ชาเขียว",
    category: "drink",
    price: 80,
    stock: 8,
    image: "/images/products/green-tea.jpg",
    detail: "ชาเขียวคุณภาพพรีเมียม กลิ่นหอมธรรมชาติ",
  },
  {
    id: 3,
    name: "คัพเค้ก",
    category: "cake",
    price: 125,
    stock: 5,
    image: "/images/products/cupcakes.jpg",
    detail: "คัพเค้กเนื้อนุ่ม หวานกำลังดี",
  },
  {
    id: 4,
    name: "เค้กช็อกโกแลต",
    category: "cake",
    price: 180,
    stock: 12,
    image: "/images/products/chocolate-cake.jpg",
    detail: "เค้กช็อกโกแลตเนื้อนุ่ม รสเข้มข้น",
  },
  {
    id: 5,
    name: "คุกกี้",
    category: "cookie",
    price: 100,
    stock: 20,
    image: "/images/products/cookies.jpg",
    detail: "คุกกี้เนื้อกรอบ รสหวานหอม",
  },
  {
    id: 6,
    name: "โดนัท",
    category: "donut",
    price: 65,
    stock: 3,
    image: "/images/products/donut.jpg",
    detail: "โดนัทนุ่มหวาน หลากหลายรสชาติ",
  },
]

const categories = ["drink", "cake", "cookie", "donut"]

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    detail: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string>("")

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setNewProduct({ ...newProduct, image: result }) // must get URL from backend after upload
      }
      reader.readAsDataURL(file)
      setImageFile(file)
    }
  }

  const handleEditImageUpload = (file: File, productId: number) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setEditImagePreview(result)
        handleUpdateProduct(productId, "image", result)
      }
      reader.readAsDataURL(file)
      setEditImageFile(file)
    }
  }

  const createProduct = async (productData: Omit<Product, "id">) => {
    // ใ upload รูปก่อน แล้วได้ URL กลับมา
    // if (imageFile) {
    //   const formData = new FormData()
    //   formData.append('image', imageFile)
    //   const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData })
    //   const { imageUrl } = await uploadResponse.json()
    //   productData.image = imageUrl
    // }

    // จากนั้นถึงสร้างสินค้า
    // const response = await fetch('/api/products', { method: 'POST', body: JSON.stringify(productData) })
    // const newProduct = await response.json()

    // สำหรับ demo ใช้ temporary ID
    const tempId = Math.max(...products.map((p) => p.id), 0) + 1
    return { ...productData, id: tempId }
  }

  const handleAddProduct = async () => {
    if (
      newProduct.name &&
      newProduct.category &&
      newProduct.price &&
      newProduct.stock &&
      newProduct.image &&
      newProduct.detail
    ) {
      try {
        const productToCreate: Omit<Product, "id"> = {
          name: newProduct.name,
          category: newProduct.category,
          price: parseInt(newProduct.price),
          stock: parseInt(newProduct.stock),
          image: newProduct.image,
          detail: newProduct.detail,
        }

        const createdProduct = await createProduct(productToCreate)
        setProducts([...products, createdProduct])
        setNewProduct({
          name: "",
          category: "",
          price: "",
          stock: "",
          image: "",
          detail: "",
        })
        setImageFile(null)
        setImagePreview("")
      } catch (error) {
        console.error("Error creating product:", error)
        // error message ให้ user
      }
    }
  }

  const handleUpdateProduct = (
    productId: number,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, [field]: value } : p))
    )
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      // call api

      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleSaveEdit = async (productId: number) => {
    try {
      const productToUpdate = products.find((p) => p.id === productId)
      if (productToUpdate) {
        // call api
      }
      setEditingProduct(null)
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">จัดการสินค้า</h2>

      {/* Add new product form */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">เพิ่มสินค้าใหม่</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="ชื่อสินค้า"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          />
          <select
            value=""
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="px-3 py-2 border rounded-lg">
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="ราคา (บาท)"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="จำนวนสต็อก"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          />

          {/* Image upload */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปภาพสินค้า
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageUpload(file)
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 objext-cover rounded-lg border"
                  />
                  <button
                    onClick={() => {
                      setImagePreview("")
                      setImageFile(null)
                      setNewProduct({ ...newProduct, image: "" })
                    }}
                    className="text-red-500 hover:text-red-700 text-sm">
                    ลบรูป
                  </button>
                </div>
              )}
            </div>
          </div>

          <textarea
            placeholder="รายละเอียดของสินค้า"
            value={newProduct.detail}
            onChange={(e) =>
              setNewProduct({ ...newProduct, detail: e.target.value })
            }
            className="px-3 py-2 border rounded-lg col-span-full"
            rows={3}
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          disabled={
            !newProduct.name ||
            !newProduct.category ||
            !newProduct.price ||
            !newProduct.stock ||
            !imageFile ||
            !newProduct.detail
          }>
          เพิ่มสินค้า
        </button>
      </div>

      {/* Product list */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            รายการสินค้าทั้งหมด ({products.length} รายการ)
          </h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">รูปภาพ</th>
                  <th className="text-left py-2">ชื่อสินค้า</th>
                  <th className="text-left py-2">หมวดหมู่</th>
                  <th className="text-left py-2">ราคา</th>
                  <th className="text-left py-2">สต็อก</th>
                  <th className="text-left py-2">รายละเอียด</th>
                  <th className="text-left py-2">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b ${
                      (product.stock || 0) < 10 ? "bg-red-50" : ""
                    }`}>
                    <td className="py-2">
                      {editingProduct === product.id ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleEditImageUpload(file, product.id)
                              }
                            }}
                            className="block w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
                          />
                          {editImagePreview && (
                            <img
                              src={editImagePreview}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded border"
                            />
                          )}
                        </div>
                      ) : product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">ไม่มีรูป</span>
                      )}
                    </td>
                    <td className="py-2">
                      {editingProduct === product.id ? (
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) =>
                            handleUpdateProduct(
                              product.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        product.name
                      )}
                    </td>
                    <td className="py-2">
                      {editingProduct === product.id ? (
                        <select
                          value={product.category}
                          onChange={(e) =>
                            handleUpdateProduct(
                              product.id,
                              "category",
                              e.target.value
                            )
                          }
                          className="px-2 py-1 border rounded">
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        product.category
                      )}
                    </td>
                    <td className="py-2">
                      {editingProduct === product.id ? (
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            handleUpdateProduct(
                              product.id,
                              "price",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-2 py-1 border rounded w-20"
                        />
                      ) : (
                        `฿${product.price}`
                      )}
                    </td>
                    <td className="py-2">
                      {editingProduct === product.id ? (
                        <input
                          type="number"
                          value={product.stock}
                          onChange={(e) =>
                            handleUpdateProduct(
                              product.id,
                              "stock",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-2 py-1 border rounded w-20"
                        />
                      ) : (
                        <span
                          className={
                            product.stock || 0 ? "text-red-600 font-bold" : ""
                          }>
                          {product.stock || 0} ชิ้น
                        </span>
                      )}
                    </td>
                    <td className="py-2 max-w-xs">
                      {editingProduct === product.id ? (
                        <textarea
                          value={product.detail}
                          onChange={(e) =>
                            handleUpdateProduct(
                              product.id,
                              "detail",
                              e.target.value
                            )
                          }
                          className="px-2 py-1 border rounded w-full"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm text-gray-600 truncate block">
                          {product.detail}
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        {editingProduct === product.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(product.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                              บันทึก
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-sm">
                              ยกเลิก
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingProduct(product.id)}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                              แก้ไข
                            </button>
                            <button
                              onClick={() => {
                                setProducts(
                                  products.filter((p) => p.id !== product.id)
                                )
                              }}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                              ลบ
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Low stock alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          {"สินค้าที่เหลือน้อย (< 10 ชิ้น)"}
        </h3>
        <div className="space-y-2">
          {products
            .filter((p) => (p.stock || 0) < 10)
            .map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center">
                <span className="text-red-700">{product.name}</span>
                <span className="font-bold text-red-800">
                  {product.stock || 0} ชิ้น
                </span>
              </div>
            ))}
        </div>
        {products.filter((p) => (p.stock || 0) < 10).length === 0 && (
          <p className="text-gray-600">ไม่มีสินค้าเหลือน้อย</p>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800">จำนวนสินค้าทั้งหมด</h4>
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800">มูลค่าสต็อก</h4>
          <p className="text-2xl font-bold text-green-600">
            ฿
            {products
              .reduce((total, p) => total + p.price * (p.stock || 0), 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800">สินค้าเหลือน้อย</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {products.filter((p) => (p.stock || 0) < 10).length}
          </p>
        </div>
      </div>
    </div>
  )
}
export default ProductManagement
