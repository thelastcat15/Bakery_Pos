"use client"
import { LoginForm } from "@/components/common/Form"
import { logout } from "@/services/user_service"
import Link from "next/link"
import { useEffect } from "react"

const LoginPage = () => {
  useEffect(() => {
    logout()
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h1 className="font-bold text-2xl text-center">เข้าสู่ระบบ</h1>
      <div className="mt-8 px-8 md:px-0">
        <LoginForm />
      </div>
      <p className="text-gray-500 text-center mt-4">
        ยังไม่เป็นสมาชิก?{" "}
        <Link
          href={`/register`}
          className="text-amber-500 hover:text-amber-600">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  )
}
export default LoginPage
