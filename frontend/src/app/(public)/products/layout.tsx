import { ProductList } from "@/components/common/List"
import Navbar from "@/components/layout/Navbar"
import { products } from "@/data/mock/product_mock"
import ProductsPage from "./page"

const ProductsPageLayout = () => {
  return (
    <main>
      <Navbar />
      <section>
        <ProductsPage />
      </section>
    </main>
  )
}
export default ProductsPageLayout
