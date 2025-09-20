import { Product } from "@/types/product_type"
import { api } from "./api"
const BASE_PRODUCT = "/products"

export const createProduct = async (newProduct: Product): Promise<Product> => {
  try {
    const response = await api.post<Product>(`${BASE_PRODUCT}?images_amount=1`, newProduct)
    return response.data
  } catch (error) {
    console.error("Create product error:", error)
    throw error
  }
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get(`${BASE_PRODUCT}`)
    return response.data
  } catch (error) {
    console.error("Get all product error:", error)
    throw error
  }
}

export const updateProduct = async (productId: number): Promise<Product> => {
  try {
    const response = await api.put<Product>(`${BASE_PRODUCT}/${productId}`)
    return response.data
  } catch (error) {
    console.error("Update product error:", error)
    throw error
  }
}

export const deleteProduct = async (productId: number) => {
  try {
    await api.delete(`${BASE_PRODUCT}/${productId}`)
  } catch (error) {
    console.error("Delete product error:", error)
    throw error
  }
}

export const uploadImageProduct = async (productId: number, file: File) => {
  try {
    const response1 = await api.post(`${BASE_PRODUCT}/${productId}/images`, {
      images: [
        {
          order: 1,
        },
      ],
    })

    await uploadImage(file, response1.data.images[0].upload_url)
    return response1.data.images[0]
  } catch (error) {
    console.error("Upload image of product error:", error)
    throw error
  }
}

export const uploadImage = async (file: File, uploadUrl: string) => {
  try {
    const response = await api.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      withCredentials: false,
    })

    console.log("Upload success:", response.status)
  } catch (error) {
    console.error("Upload failed:", error)
  }
}

export const getImagesById = async (productId: number) => {
  try {
    const response = await api.get(`${BASE_PRODUCT}/${productId}/images`)

    console.log("Upload success:", response.status)
    return response.data.images[0].public_url
  } catch (error) {
    console.error("Upload failed:", error)
  }
}
