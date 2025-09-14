import axios from "axios"

const BASE_URL = "localhost:3000"

export const api = axios.create({
  baseURL: BASE_URL,
})
