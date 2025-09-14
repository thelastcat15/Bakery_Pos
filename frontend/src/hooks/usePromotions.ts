import { Product } from "@/types/product_type"
import { Promotion } from "@/types/promotion_types"
import { useCallback, useEffect, useState } from "react"

const PROMOTIONS_STORAGE_KEY = "promotion_data"

const savePromotionsToStorage = (promotions: Promotion[]) => {
  try {
    const promotionsData = JSON.stringify(promotions)
    // save to backend
    console.log("Promotions would be saved to backend:", promotions)
  } catch (error) {
    console.error("Failed to save promotions:", error)
  }
}

const loadPromotionsFromStorage = (): Promotion[] => {
  try {
    // call api
    return []
  } catch (error) {
    console.error("Failed to load promotions:", error)
    return []
  }
}

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedPromotions = loadPromotionsFromStorage()
    setPromotions(savedPromotions)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      savePromotionsToStorage(promotions)
    }
  }, [promotions, isLoaded])

  const createPromotion = useCallback(
    (promotionData: Omit<Promotion, "id" | "createdAt" | "updatedAt">) => {
      const newPromotion: Promotion = {
        ...promotionData,
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setPromotions((prev) => [newPromotion, ...prev])
      return newPromotion.id
    },
    []
  )

  const deletePromotion = useCallback((promotionId: number) => {
    setPromotions((prev) => prev.filter((promo) => promo.id !== promotionId))
  }, [])

  const getActivePromotions = useCallback(() => {
    const now = new Date()
    return promotions.filter((promo) => {
      const start = new Date(promo.startDate)
      const end = new Date(promo.endDate)
      return now >= start && now <= end
    })
  }, [promotions])

  const getPromotionForProduct = useCallback(
    (product: Product) => {
      const activePromotions = getActivePromotions()

      // Find the best applicable promotion (highes discount)
      let bestPromotion: Promotion | null = null
      let maxDiscount = 0

      for (const promo of activePromotions) {
        let applies = false

        if (promo.type === "all") {
          applies = true
        } else if (promo.type === "category") {
          applies = product.category === promo.target
        } else if (promo.type === "product") {
          applies = product.name === promo.target
        }

        if (applies && promo.discount > maxDiscount) {
          bestPromotion = promo
          maxDiscount = promo.discount
        }
      }

      return bestPromotion
    },
    [getActivePromotions]
  )

  const getDiscountedPrice = useCallback(
    (product: Product): number => {
      const promotion = getPromotionForProduct(product)

      if (promotion) {
        const discountAmount = (product.price * promotion.discount) / 100
        return Math.round(product.price - discountAmount)
      }

      return product.price
    },
    [getPromotionForProduct]
  )

  const getPriceDisplay = useCallback(
    (product: Product) => {
      const promotion = getPromotionForProduct(product)
      const discountedPrice = getDiscountedPrice(product)

      return {
        originalPrice: product.price,
        discountedPrice,
        hasDiscount: !!promotion,
        discountPercentage: promotion?.discount || 0,
        promotion,
      }
    },
    [getPromotionForProduct, getDiscountedPrice]
  )

  const getActiveAnnouncements = useCallback(() => {
    return getActivePromotions()
      .filter((promo) => promo.announcement.trim() !== "")
      .map((promo) => promo.announcement)
  }, [getActivePromotions])

  return {
    promotions,
    createPromotion,
    deletePromotion,
    getActivePromotions,
    getPromotionForProduct,
    getDiscountedPrice,
    getPriceDisplay,
    getActiveAnnouncements,
    isLoaded,
  }
}
