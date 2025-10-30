import { useContext } from "react"
import { PromotionContext } from "@/context/PromotionContext"

export const usePromotions = () => {
  const ctx = useContext(PromotionContext)
  if (!ctx) {
    throw new Error("usePromotions must be used within a PromotionProvider")
  }
  return ctx
}
