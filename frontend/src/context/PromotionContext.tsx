"use client"
import React, { createContext, useCallback, useEffect, useState } from "react"
import { Promotion } from "@/types/promotion_types"
import * as promotionService from "@/services/promotion_service"

type PromotionContextType = {
  promotions: Promotion[]
  isLoaded: boolean
  createPromotion: (body: Partial<Promotion>) => Promise<Promotion>
  deletePromotion: (id: number) => Promise<void>
  getActivePromotions: () => Promotion[]
  getPromotionForProduct: (product: any) => Promotion | null
  getDiscountedPrice: (product: any) => number
  getPriceDisplay: (product: any) => {
    originalPrice: number
    discountedPrice: number
    hasDiscount: boolean
    discountPercentage: number
    promotion?: Promotion | null
  }
  getActiveAnnouncements: () => string[]
}

export const PromotionContext = createContext<PromotionContextType | null>(null)

export const PromotionProvider = ({ children }: { children: React.ReactNode }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await promotionService.getPromotions()
        if (mounted) setPromotions(data)
      } catch (err) {
        console.error("Failed to load promotions:", err)
      } finally {
        if (mounted) setIsLoaded(true)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const createPromotion = useCallback(async (promotionData: Partial<Promotion>) => {
    const created = await promotionService.createPromotion(promotionData)
    setPromotions((prev) => [created, ...prev])
    return created
  }, [])

  const deletePromotion = useCallback(async (id: number) => {
    await promotionService.deletePromotion(id)
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getActivePromotions = useCallback(() => {
    const now = new Date()
    return promotions.filter((promo) => {
      try {
        const start = new Date(promo.start_date)
        const end = new Date(promo.end_date)
        return now >= start && now <= end && promo.is_active
      } catch {
        return false
      }
    })
  }, [promotions])

  const getPromotionForProduct = useCallback(
    (product: any) => {
      const activePromotions = getActivePromotions()
      let best: Promotion | null = null
      let maxDiscount = 0
      for (const promo of activePromotions) {
        if (promo.product_id === product.id && promo.discount > maxDiscount) {
          best = promo
          maxDiscount = promo.discount
        }
      }
      return best
    },
    [getActivePromotions]
  )

  const getDiscountedPrice = useCallback(
    (product: any): number => {
      const promo = getPromotionForProduct(product)
      if (promo) {
        const discountAmount = (product.price * promo.discount) / 100
        return Math.round(product.price - discountAmount)
      }
      return product.price
    },
    [getPromotionForProduct]
  )

  const getPriceDisplay = useCallback(
    (product: any) => {
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
      .filter((p) => p.description && p.description.trim() !== "")
      .map((p) => p.description)
  }, [getActivePromotions])

  const value: PromotionContextType = {
    promotions,
    isLoaded,
    createPromotion,
    deletePromotion,
    getActivePromotions,
    getPromotionForProduct,
    getDiscountedPrice,
    getPriceDisplay,
    getActiveAnnouncements,
  }

  return (
    <PromotionContext.Provider value={value}>{children}</PromotionContext.Provider>
  )
}

export default PromotionProvider
