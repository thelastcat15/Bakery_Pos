package routes

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"

	"github.com/gofiber/fiber/v2"
)


func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	if err := db.DB.Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}
	return c.JSON(products)
}

func GetProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product
	if err := db.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}
	return c.JSON(product)
}