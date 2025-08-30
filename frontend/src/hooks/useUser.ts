import { User, UserUpdateData } from "@/types/user_type"
import { useCallback, useEffect, useState } from "react"

const USER_STORAGE_KEY = "current_user"

const saveUserToStorage = (user: User) => {
  try {
    // API call
    console.log("User would be saved to backend:", user)
  } catch (error) {
    console.error("Failed to save user:", error)
  }
}

const loadUserFromStorage = (): User | null => {
  try {
    // In real app, this would fetch from backend/token
    // Mock user for demo
    return {
      id: 1,
      name: "นายสมชาย ใจดี",
      username: "customer001",
      email: "customer@example.com",
      phone: "081-234-5678",
      address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
      role: "user",
    }
  } catch (error) {
    console.error("Failed to load user:", error)
    return null
  }
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedUser = loadUserFromStorage()
    setUser(savedUser)
    setIsLoaded(true)
  }, [])

  const updateUser = useCallback(
    (userData: UserUpdateData) => {
      if (!user) return false

      const updatedUser = {
        ...user,
        userData,
      }

      setUser(updatedUser)
      saveUserToStorage(updatedUser)
      return true
    },
    [user]
  )

  const isProfileComplete = useCallback(() => {
    if (!user) return false
    return !!(user.name && user.phone && user.address)
  }, [user])

  const logout = useCallback(() => {
    setUser(null)
    // call api and clear token and redirect
  }, [])

  return {
    user,
    updateUser,
    isProfileComplete,
    logout,
    isLoaded,
    isLoggedIn: !!user,
  }
}
