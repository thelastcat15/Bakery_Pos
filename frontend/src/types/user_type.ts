export interface User {
  userid: number
  role: string
  username: string
  exp: number | null
  place: string | null
  phone_number: string | null
}

export interface UserUpdateData {
  name?: string
  phone?: string
  address?: string
}
