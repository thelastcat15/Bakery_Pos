package routes_admin

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// CreatePromotion godoc
// @Summary Create a new promotion
// @Description Add a new promotion to the database
// @Tags promotion
// @Accept json
// @Produce json
// @Param request body models.BodyPromotionRequest true "Promotion data"
// @Success 201 {object} models.PromotionResponse
// @Router /promotions [post]
func CreatePromotion(c *fiber.Ctx) error {
	var req models.BodyPromotionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	promo := models.Promotion{
		ProductID:   req.ProductID,
		Name:        req.Name,
		Description: req.Description,
		Discount:    req.Discount,
		StartDate:   req.StartDate,
		EndDate:     req.EndDate,
		IsActive:    req.IsActive,
	}

	if err := db.DB.Create(&promo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create promotion"})
	}

	return c.Status(fiber.StatusCreated).JSON(promo.ToResponse())
}

// GetPromotions godoc
// @Summary List promotions
// @Description Get all promotions, optional ?product_id= to filter
// @Tags promotion
// @Produce json
// @Success 200 {array} models.PromotionResponse
// @Router /promotions [get]
func GetPromotions(c *fiber.Ctx) error {
	productIDStr := c.Query("product_id", "")
	var promotions []models.Promotion
	query := db.DB
	if productIDStr != "" {
		pid, err := strconv.Atoi(productIDStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product_id"})
		}
		query = query.Where("product_id = ?", pid)
	}

	if err := query.Find(&promotions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var resp []models.PromotionResponse
	for _, p := range promotions {
		resp = append(resp, p.ToResponse())
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// GetPromotionByID godoc
// @Summary Get promotion by ID
// @Tags promotion
// @Produce json
// @Param id path int true "Promotion ID"
// @Success 200 {object} models.PromotionResponse
// @Router /promotions/{id} [get]
func GetPromotionByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid id"})
	}

	var promo models.Promotion
	if err := db.DB.First(&promo, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Promotion not found"})
	}

	return c.Status(fiber.StatusOK).JSON(promo.ToResponse())
}

// UpdatePromotion godoc
// @Summary Update a promotion
// @Tags promotion
// @Accept json
// @Produce json
// @Param id path int true "Promotion ID"
// @Param request body models.BodyPromotionRequest true "Updated promotion data"
// @Success 200 {object} models.PromotionResponse
// @Router /promotions/{id} [put]
func UpdatePromotion(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid id"})
	}

	var promo models.Promotion
	if err := db.DB.First(&promo, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Promotion not found"})
	}

	var body models.BodyPromotionRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	promo.ProductID = body.ProductID
	promo.Name = body.Name
	promo.Description = body.Description
	promo.Discount = body.Discount
	promo.StartDate = body.StartDate
	promo.EndDate = body.EndDate
	promo.IsActive = body.IsActive

	if err := db.DB.Save(&promo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update promotion"})
	}

	return c.Status(fiber.StatusOK).JSON(promo.ToResponse())
}

// DeletePromotion godoc
// @Summary Delete a promotion
// @Tags promotion
// @Param id path int true "Promotion ID"
// @Success 204
// @Router /promotions/{id} [delete]
func DeletePromotion(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid id"})
	}

	if err := db.DB.Delete(&models.Promotion{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete promotion"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
