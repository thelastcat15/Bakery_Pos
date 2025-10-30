"use client"
import { SuggestList } from "@/components/common/List"
import { getAllProducts } from "@/services/product_service"
import { Product } from "@/types/product_type"
import { useEffect, useState } from "react"

const Suggest = () => {
  const [products, setProducts] = useState<Product[]>([])

  const handleListProduct = async () => {
    const data = await getAllProducts()
    setProducts(data)
  }

  useEffect(() => {
    handleListProduct()
  }, [])

  return (
    <article className="mt-18 md:mt-24">
      {/* <h2 className="font-bold text-3xl text-center">รายการแนะนำ</h2> */}
      <div className="max-w-6xl mx-auto mt-12 md:mt-14">
        <SuggestList products={products} />
      </div>
    </article>
  )
}
export default Suggest
