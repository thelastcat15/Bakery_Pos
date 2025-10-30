"use client"

import { CategoryList, ProductList } from "@/components/common/List"

import { getAllProducts } from "@/services/product_service"
import { Category } from "@/types/category_type"
import { Product } from "@/types/product_type"
import { useEffect, useMemo, useState } from "react"

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchText, setSearchText] = useState<string>("")

  const handleListProduct = async () => {
    const data = await getAllProducts()
    setProducts(data)

    const uniqCategories = Array.from(new Set(data.map((p) => p.category)))

    // add an "All" option at the start
    const allCats = ["All", ...uniqCategories]

    // do not set categories in state; categories are computed from products and selectedCategory
  }

  useEffect(() => {
    handleListProduct()
  }, [])

  const categories = useMemo(() => {
    const uniqCategories = Array.from(new Set(products.map((p) => p.category)))
    const allCats = ["All", ...uniqCategories]
    return allCats.map((name) => ({
      children: name,
      active: selectedCategory === null ? name === "All" : name === selectedCategory,
      onClick: () => setSelectedCategory(name === "All" ? null : name),
    })) as Category[]
  }, [products, selectedCategory])

  const filteredProducts = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    let result = products

    if (q !== "") {
      result = result.filter((p) => {
        const name = (p.name || "").toString().toLowerCase()
        const desc = (p.detail || "").toString().toLowerCase()
        return name.includes(q) || desc.includes(q)
      })
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    return result
  }, [products, selectedCategory, searchText])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="py-8 px-4 md:px-2 xl:px-0 md:py-16">
        <h1 className="font-bold text-2xl md:text-4xl mb-12">สินค้าทั้งหมด</h1>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาสินค้า (ชื่อหรือคำอธิบาย)"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="w-full md:w-auto">
            <CategoryList categories={categories} />
          </div>
        </div>
        <ProductList
          products={filteredProducts}
        />
      </div>
    </div>
  )
}
export default ProductsPage
