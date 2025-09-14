import { User } from "@/types/user_type"
import { api } from "./api"
const BASE_USER = "/user"

export const login = async (
  username: string,
  password: string
): Promise<{ message: string; user: User }> => {
  try {
    const response = await api.post(`${BASE_USER}/login`, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const register = async (
  username: string,
  password: string
): Promise<{ message: string; user: User }> => {
  try {
    const response = await api.post(`${BASE_USER}/register`, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

export const updateSetting = async (
  phoneNumber: string,
  address: string
): Promise<string> => {
  try {
    const response = await api.put(`${BASE_USER}/settings`, {
      phone_number: phoneNumber,
      place: address,
    })
    return response.data.message
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}
