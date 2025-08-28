"use client"

import { ProductList } from "@/components/common/List"
import { products } from "@/data/mock/product_mock"

const ProductsPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="py-8 px-4 md:px-2 xl:px-0 md:py-16">
        <h1 className="font-bold text-2xl md:text-4xl mb-12">สินค้าทั้งหมด</h1>
        <ProductList products={products} />
      </div>
    </div>
  )
}
export default ProductsPage
