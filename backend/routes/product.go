package routes

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"

	"github.com/gofiber/fiber/v2"
)


func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	if err := db.DB.Preload("Images").Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	responses := make([]ProductResponse, len(products))
	for i := range products {
		responses[i] = products[i].ToResponse(false)
	}

	return c.Status(fiber.StatusOK).JSON(responses)
}

func GetProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product
	if err := db.DB.Preload("Images").First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}
	return c.Status(fiber.StatusOK).JSON(product.ToResponse(false))
}
