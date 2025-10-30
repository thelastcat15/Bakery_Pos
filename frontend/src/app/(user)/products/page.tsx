"use client"

import { CategoryList, ProductList } from "@/components/common/List"

import { getAllProducts } from "@/services/product_service"
import { Category } from "@/types/category_type"
import { Product } from "@/types/product_type"
import { useEffect, useMemo, useState } from "react"

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="py-8 px-4 md:px-2 xl:px-0 md:py-16">
        <h1 className="font-bold text-2xl md:text-4xl mb-12">สินค้าทั้งหมด</h1>
        <CategoryList categories={categories} />
        <ProductList
          products={
            selectedCategory
              ? products.filter((p) => p.category === selectedCategory)
              : products
          }
        />
      </div>
    </div>
  )
}
export default ProductsPage
