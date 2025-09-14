"use client"

import { CategoryList, ProductList } from "@/components/common/List"

import { getAllProducts } from "@/services/product_service"
import { Category } from "@/types/category_type"
import { Product } from "@/types/product_type"
import { useEffect, useState } from "react"

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const handleListProduct = async () => {
    const data = await getAllProducts()
    setProducts(data)

    const uniqCategories = Array.from(new Set(data.map((p) => p.category)))

    // map to Categoty[]
    const categoriesObj: Category[] = uniqCategories.map((name, index) => ({
      children: name,
      active: index === 0,
      onClick: () => console.log(`Go to ${name}`),
    }))

    setCategories(categoriesObj)
  }

  useEffect(() => {
    handleListProduct()
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="py-8 px-4 md:px-2 xl:px-0 md:py-16">
        <h1 className="font-bold text-2xl md:text-4xl mb-12">สินค้าทั้งหมด</h1>
        <CategoryList categories={categories} />
        <ProductList products={products} />
      </div>
    </div>
  )
}
export default ProductsPage
