import { useState } from "react"
import { PrimaryButton } from "@/components/common/Button"
import { login } from "@/services/user_service"
import { register } from "@/services/user_service"

// Validation regexes
// Username: 3-20 characters, letters, numbers, underscores
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
// Password: at least 6 characters, at least one lowercase, one uppercase and one digit
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
  })

  const [passwordMatch, setPasswordMatch] = useState(true)
  const [usernameValid, setUsernameValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // live validation
    if (name === "username") {
      setUsernameValid(USERNAME_REGEX.test(value))
    }
    if (name === "password1") {
      setPasswordValid(PASSWORD_REGEX.test(value))
      if (formData.password2) setPasswordMatch(value === formData.password2)
    }
    if (name === "password2") {
      setPasswordMatch(value === formData.password1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password1 !== formData.password2) {
      setPasswordMatch(false)
      return
    }

    // final checks
    const uOk = USERNAME_REGEX.test(formData.username)
    const pOk = PASSWORD_REGEX.test(formData.password1)
    setUsernameValid(uOk)
    setPasswordValid(pOk)
    if (!uOk || !pOk) return

    try {
      const response = await register(formData.username, formData.password1)
      console.log("Register successful:", response.username)
      window.location.href = "/"
    } catch (error) {
      console.error("Register failed:", error)
    }
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
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            usernameValid ? "border-gray-300" : "border-red-500"
          }`}
        />
        {!usernameValid && (
          <div className="text-red-500 text-sm mt-1">
            Username ต้องเป็นตัวอักษร ตัวเลข หรือ underscore ได้ 3-20 ตัวอักษร
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password1" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          name="password1"
          id="password1"
          placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร, มีพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข)"
          value={formData.password1}
          onChange={handleInputChange}
          required
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            passwordValid ? "border-gray-300" : "border-red-500"
          }`}
        />
        {!passwordValid && (
          <div className="text-red-500 text-sm mt-1">
            รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร และประกอบด้วย ตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข
          </div>
        )}
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
        disabled={
          !passwordMatch || !formData.password1 || !formData.password2 || !usernameValid || !passwordValid
        }>
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

  const [usernameValid, setUsernameValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "username") setUsernameValid(USERNAME_REGEX.test(value))
    if (name === "password") setPasswordValid(PASSWORD_REGEX.test(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      return
    }

    // validate before submit
    const uOk = USERNAME_REGEX.test(formData.username)
    const pOk = PASSWORD_REGEX.test(formData.password)
    setUsernameValid(uOk)
    setPasswordValid(pOk)
    if (!uOk || !pOk) return
    try {
      const response = await login(formData.username, formData.password)
      console.log("Login successful:", response.username)
      window.location.href = "/"
    } catch (error) {
      console.error("Login failed:", error)
    }
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
