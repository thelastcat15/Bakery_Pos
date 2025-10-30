export interface User {
  userid: number
  role: string
  name: string | null
  username: string
  exp: number | null
  address: string | null
  phone: string | null
}

export interface UserUpdateData {
  name?: string
  phone?: string
  address?: string
}
