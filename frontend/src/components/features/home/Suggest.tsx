import { ProductList } from "@/components/common/List"
import { products } from "@/data/mock/product_mock"

const Suggest = () => {
  return (
    <article className="mt-18 md:mt-24">
      <h2 className="font-bold text-3xl text-center">รายการแนะนำ</h2>
      <div className="max-w-6xl mx-auto mt-12 md:mt-14">
        <ProductList products={products} />
      </div>
    </article>
  )
}
export default Suggest
