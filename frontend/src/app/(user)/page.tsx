import Navbar from "../../components/layout/Navbar"
import Banner from "@/components/features/home/Banner"
import Suggest from "@/components/features/home/Suggest"

export default function Home() {
  return (
    <>
      <section>
        <Banner />
      </section>
      <section>
        <Suggest />
      </section>
    </>
  )
}
