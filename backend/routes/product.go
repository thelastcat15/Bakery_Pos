package routes

import (
	"strconv"
	"Bakery_Pos/db"
	"Bakery_Pos/models"

	"github.com/gofiber/fiber/v2"
)

// GetProducts godoc
// @Summary Get all products
// @Description Retrieve all products with their images
// @Tags product
// @Accept json
// @Produce json
// @Success 200 {array} models.ProductResponse
// @Router /products [get]
func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	if err := db.DB.Preload("Images").Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	role, ok := c.Locals("role").(string)
	var isAdmin bool
	if ok && role == "Admin" {
		isAdmin = true
	} else {
		isAdmin = false
	}

	responses := make([]models.ProductResponse, len(products))
	for i := range products {
		responses[i] = products[i].ToResponse(isAdmin)
	}

	return c.Status(fiber.StatusOK).JSON(responses)
}

// GetProductByID godoc
// @Summary Get a single product by ID
// @Description Retrieve a single product with its images, sorted by order ascending
// @Tags product
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} models.ProductResponse
// @Router /products/{id} [get]
func GetProductByID(c *fiber.Ctx) error {
	role, ok := c.Locals("role").(string)
	var isAdmin bool
	if ok && role == "Admin" {
		isAdmin = true
	} else {
		isAdmin = false
	}
	
	id := c.Params("id")
	var product models.Product
	if err := db.DB.Preload("Images").First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}
	return c.Status(fiber.StatusOK).JSON(product.ToResponse(isAdmin))
}

// GetImagesProduct godoc
// @Summary Get all images for a product
// @Description Retrieve all images for a product, sorted by order ascending
// @Tags product-images
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} models.ImagesArrayResponse
// @Router /products/{id}/images [get]
func GetImagesProduct(c *fiber.Ctx) error {
	idStr := c.Params("id")
	productID, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	var product models.Product
	if err := db.DB.First(&product, productID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	var images []models.Image
	if err := db.DB.Where("product_id = ?", productID).Order("`order` ASC").Find(&images).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	
	role, ok := c.Locals("role").(string)
	var isAdmin bool
	if ok && role == "Admin" {
		isAdmin = true
	} else {
		isAdmin = false
	}

	responses := make([]models.ImageResponse, 0, len(images))
	for _, img := range images {
		responses = append(responses, img.ToResponse(isAdmin))
	}
	
	return c.Status(fiber.StatusOK).JSON(models.ImagesArrayResponse{
		Images: responses,
	})
}