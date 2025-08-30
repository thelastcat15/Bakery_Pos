export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  address: string
  role: string
}

export interface UserUpdateData {
  name?: string
  phone?: string
  address?: string
}
