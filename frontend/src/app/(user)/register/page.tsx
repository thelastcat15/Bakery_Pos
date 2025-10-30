"use client"
import { RegisterForm } from "@/components/common/Form"
import { logout } from "@/services/user_service"
import Link from "next/link"
import { useEffect } from "react"

const RegisterPage = () => {
  useEffect(() => {
    logout()
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h1 className="font-bold text-2xl text-center">สมัครสมาชิก</h1>
      <div className="mt-8 px-8 md:px-0">
        <RegisterForm />
      </div>
      <p className="text-gray-500 text-center mt-4">
        มีบัญชีแล้ว?{" "}
        <Link href={`/login`} className="text-amber-500 hover:text-amber-600">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  )
}
export default RegisterPage
