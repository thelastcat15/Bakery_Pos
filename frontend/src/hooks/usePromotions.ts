import { Product } from "@/types/product_type"
import { Promotion } from "@/types/promotion_types"
import { useCallback, useEffect, useState } from "react"
import * as promotionService from "@/services/promotion_service"

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await promotionService.getPromotions()
        if (mounted) setPromotions(data)
      } catch (error) {
        console.error("Failed to load promotions:", error)
      } finally {
        if (mounted) setIsLoaded(true)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const createPromotion = useCallback(
    async (promotionData: Partial<Promotion>) => {
      try {
        const created = await promotionService.createPromotion(
          promotionData as Partial<Promotion>
        )
        setPromotions((prev) => [created, ...prev])
        return created.id
      } catch (error) {
        console.error("Failed to create promotion:", error)
        throw error
      }
    },
    []
  )

  const deletePromotion = useCallback(async (promotionId: number) => {
    try {
      await promotionService.deletePromotion(promotionId)
      setPromotions((prev) => prev.filter((promo) => promo.id !== promotionId))
    } catch (error) {
      console.error("Failed to delete promotion:", error)
      throw error
    }
  }, [])

  const getActivePromotions = useCallback(() => {
    const now = new Date()
    return promotions.filter((promo) => {
      const start = new Date(promo.start_date)
      const end = new Date(promo.end_date)
      return now >= start && now <= end
    })
  }, [promotions])

  const getPromotionForProduct = useCallback(
    (product: Product) => {
      const activePromotions = getActivePromotions()

      let bestPromotion: Promotion | null = null
      let maxDiscount = 0

      for (const promo of activePromotions) {
        const applies = promo.product_id === product.id
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
      .filter((promo) => promo.description && promo.description.trim() !== "")
      .map((promo) => promo.description)
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
