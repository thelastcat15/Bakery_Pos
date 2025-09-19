import { SuggestList } from "@/components/common/List"
import { getAllProducts } from "@/services/product_service"

const Suggest = async () => {
  const products = await getAllProducts()
  console.log(products)

  return (
    <article className="mt-18 md:mt-24">
      <h2 className="font-bold text-3xl text-center">รายการแนะนำ</h2>
      <div className="max-w-6xl mx-auto mt-12 md:mt-14">
        <SuggestList products={products} />
      </div>
    </article>
  )
}
export default Suggest
