import axios from "axios"

const BASE_URL = "https://easybakery.onrender.com/"

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})
