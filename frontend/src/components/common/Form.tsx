import { useState } from "react"
import { PrimaryButton } from "@/components/common/Button"

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
  })

  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "password2") {
      setPasswordMatch(value === formData.password1)
    }
    if (name === "password1" && formData.password2) {
      setPasswordMatch(value === formData.password2)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password1 !== formData.password2) {
      setPasswordMatch(false)
      return
    }

    console.log("Form submitted:", {
      username: formData.username,
      password: formData.password1,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password1" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          name="password1"
          id="password1"
          placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
          value={formData.password1}
          onChange={handleInputChange}
          pattern=".{6,}"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password2" className="block text-sm font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="password2"
          id="password2"
          placeholder="ยืนยันรหัสผ่าน"
          value={formData.password2}
          onChange={handleInputChange}
          required
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            !passwordMatch ? "border-red-500" : "border-gray-300"
          }`}
        />
        {!passwordMatch && formData.password2 && (
          <div className="text-red-500 text-sm mt-1">รหัสผ่านไม่ตรงกัน</div>
        )}
      </div>
      <PrimaryButton
        className="w-full mt-4"
        type="submit"
        disabled={!passwordMatch || !formData.password1 || !formData.password2}>
        สมัครสมาชิก
      </PrimaryButton>
    </form>
  )
}

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Form submitted:", {
      username: formData.username,
      password: formData.password,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password1" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="รหัสผ่าน"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <PrimaryButton
        className="w-full mt-4"
        type="submit"
        disabled={!formData.username || !formData.password}>
        เข้าสู่ระบบ
      </PrimaryButton>
    </form>
  )
}
