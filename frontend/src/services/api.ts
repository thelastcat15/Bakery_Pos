import axios from "axios"

const BASE_URL = "http://127.0.0.1:5000/api"

export const api = axios.create({
  baseURL: BASE_URL,
})
