package routes_admin

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// CreateProduct godoc
// @Summary Create a new product
// @Description Add a new product to the database. Optionally, use ?images_amount to create image rows and get upload URLs.
// @Tags product
// @Accept json
// @Produce json
// @Param request body models.BodyProductRequest true "Product data"
// @Param images_amount query int false "Number of images to create and get upload URLs for"
// @Success 201 {object} models.ProductResponse
// @Router /products [post]
func CreateProduct(c *fiber.Ctx) error {
	var req models.BodyProductRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	// Create product
	product := models.Product{
		Name:        req.Name,
		Description: req.Description,
		Tag:         req.Tag,
		Price:       req.Price,
		Stock:       req.Stock,
		IsActive:    req.IsActive,
	}

	if err := db.DB.Create(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create product",
		})
	}

	// Handle images_amount query
	imagesAmountStr := c.Query("images_amount", "0")
	imagesAmount, err := strconv.Atoi(imagesAmountStr)
	if err != nil || imagesAmount < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid images_amount query parameter",
		})
	}

	var images []models.Image
	var imageResponses []models.ImageResponse

	if imagesAmount > 0 {
		for i := 1; i <= imagesAmount; i++ {
			fileName := fmt.Sprintf("%d-%d.png", product.ID, i)
			filePath := fmt.Sprintf("products/%d/%s", product.ID, fileName)
			fmt.Println(filePath)
			signedURL, publicURL, err := db.Storage.GenerateUploadURL("product-images", filePath)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			image := models.Image{
				ProductID: product.ID,
				FilePath:  filePath,
				PublicURL: &publicURL,
				Order:     i,
			}
			if err := db.DB.Create(&image).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			imgResp := image.ToResponse()
			imgResp.UploadURL = &signedURL
			imageResponses = append(imageResponses, imgResp)
			images = append(images, image)
		}
		product.Images = images
	}

	resp := product.ToResponse()
	if imagesAmount > 0 {
		resp.Images = imageResponses
	}

	return c.Status(fiber.StatusCreated).JSON(resp)
}

// UpdateProduct godoc
// @Summary Update a product
// @Description Update an existing product by ID
// @Tags product
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param request body models.BodyProductRequest true "Updated product data"
// @Success 200 {object} models.ProductResponse
// @Router /products/{id} [put]
func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")

	var product models.Product
	if err := db.DB.Preload("Images").First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	var body models.BodyProductRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	product.Name = body.Name
	product.Description = body.Description
	product.Tag = body.Tag
	product.Price = body.Price
	product.Stock = body.Stock
	product.IsActive = body.IsActive

	if err := db.DB.Save(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update product",
		})
	}

	return c.Status(fiber.StatusOK).JSON(product.ToResponse())
}

// DeleteProduct godoc
// @Summary Delete a product
// @Description Remove a product from the database by ID
// @Tags product
// @Param id path int true "Product ID"
// @Success 204
// @Router /products/{id} [delete]
func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := db.DB.Delete(&models.Product{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete product",
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// UploadImagesProduct godoc
// @Summary Upload multiple images for a product (replace all)
// @Description Delete all old images, then generate signed URLs for uploading new images and store them in the database. Use ?image_amount to specify the number of images.
// @Tags product-images
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param image_amount query int true "Number of images to create and get upload URLs for"
// @Success 200 {object} models.ImagesArrayResponse
// @Router /products/{id}/images [post]
func UploadImagesProduct(c *fiber.Ctx) error {
	idStr := c.Params("id")
	productID, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	// Parse image_amount query
	imageAmountStr := c.Query("image_amount", "0")
	imageAmount, err := strconv.Atoi(imageAmountStr)
	if err != nil || imageAmount < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid image_amount query parameter"})
	}

	var product models.Product
	if err := db.DB.First(&product, productID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Delete all old images for this product
	if err := db.DB.Where("product_id = ?", productID).Delete(&models.Image{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete old images"})
	}

	var results []models.ImageResponse

	for i := 1; i <= imageAmount; i++ {
		fileName := fmt.Sprintf("%d-%d.png", product.ID, i)
		filePath := fmt.Sprintf("products/%d/%s", product.ID, fileName)
		signedURL, publicURL, err := db.Storage.GenerateUploadURL("product-images", filePath)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		image := models.Image{
			ProductID: product.ID,
			FilePath:  filePath,
			PublicURL: &publicURL,
			Order:     i,
		}
		if err := db.DB.Create(&image).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		imgResp := image.ToResponse()
		imgResp.UploadURL = &signedURL
		results = append(results, imgResp)
	}

	return c.Status(fiber.StatusOK).JSON(models.ImagesArrayResponse{
		Images: results,
	})
}

// DeleteImagesProduct godoc
// @Summary Delete one or multiple images for a product
// @Description Remove images from storage and database
// @Tags product-images
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param request body models.ImagesRequest true "Image Orders to delete"
// @Success 200 {object} models.MessageResponse
// @Router /products/{id}/images [delete]
func DeleteImagesProduct(c *fiber.Ctx) error {
	idStr := c.Params("id")
	productID, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	var body models.ImagesRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	if len(body.Orders) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No image orders provided"})
	}

	orders := body.Orders

	var images []models.Image
	if err := db.DB.Where("product_id = ? AND `order` IN ?", productID, orders).Find(&images).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if len(images) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No images found"})
	}

	for _, img := range images {
		if err := db.Storage.RemoveFile("product-images", img.FilePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
	}

	if err := db.DB.Where("product_id = ? AND `order` IN ?", productID, orders).Delete(&models.Image{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(models.MessageResponse{
		Message: "Images deleted successfully",
	})
}
