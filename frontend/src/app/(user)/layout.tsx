import Navbar from "@/components/layout/Navbar"

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Navbar />
      <main>
        <section>{children}</section>
      </main>
    </>
  )
}
export default UserLayout
