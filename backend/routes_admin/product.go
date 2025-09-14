package routes_admin

import (
	"fmt"
	"strconv"
	"Bakery_Pos/db"
	"Bakery_Pos/models"

	"github.com/gofiber/fiber/v2"
)

// CreateProduct godoc
// @Summary Create a new product
// @Description Add a new product to the database
// @Tags product
// @Accept json
// @Produce json
// @Param request body models.BodyProductRequest true "Product data"
// @Success 201 {object} models.ProductResponse
// @Router /products [post]
// CreateProduct godoc
// @Summary Create a new product
// @Description Add a new product to the database
// @Tags product
// @Accept json
// @Produce json
// @Param request body models.BodyProductRequest true "Product data"
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

  return c.Status(fiber.StatusOK).Status(fiber.StatusCreated).JSON(product.ToResponse(true))
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

  return c.Status(fiber.StatusOK).JSON(product.ToResponse(true))
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
// @Summary Upload multiple images for a product
// @Description Generate signed URLs for uploading multiple images and store them in the database
// @Tags product-images
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param request body models.ImagesRequest true "Images data"
// @Success 200 {array} models.ImagesArrayResponse
// @Router /products/{id}/images [post]
func UploadImagesProduct(c *fiber.Ctx) error {
	idStr := c.Params("id")
	productID, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	var body models.ImagesRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	var product models.Product
	if err := db.DB.First(&product, productID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	var results []models.ImageResponse

	for _, imgReq := range body.Images {
		order := imgReq.Order

		fileName := fmt.Sprintf("%d-%d.png", product.ID, order)
		filePath := fmt.Sprintf("products/%d/%s", product.ID, fileName)

		signedUpload, err := db.Storage.CreateSignedUploadUrl("product-images", filePath)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		var image models.Image
		err = db.DB.Where("product_id = ? AND `order` = ?", product.ID, order).First(&image).Error
		if err == nil {
			image.FileName = fileName
			image.FilePath = filePath
			image.UploadURL = &signedUpload.Url
			db.DB.Save(&image)
		} else {
			image = models.Image{
				ProductID: product.ID,
				FileName:  fileName,
				FilePath:  filePath,
				UploadURL: &signedUpload.Url,
				Order:     order,
			}
			db.DB.Create(&image)
		}

		results = append(results, image.ToResponse(true))
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
// @Param request body models.ImagesRequest true "Image IDs"
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

	if len(body.Images) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No images provided"})
	}

	// collect orders
	var orders []int
	for _, img := range body.Images {
		orders = append(orders, img.Order)
	}

	var images []models.Image
	if err := db.DB.Where("product_id = ? AND `order` IN ?", productID, orders).Find(&images).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if len(images) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No images found"})
	}

	// collect file paths
	var filePaths []string
	for _, img := range images {
		filePaths = append(filePaths, img.FilePath)
	}

	if _, err := db.Storage.RemoveFile("product-images", filePaths); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// delete from db
	if err := db.DB.Where("product_id = ? AND `order` IN ?", productID, orders).Delete(&models.Image{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(models.MessageResponse{
		Message: "Images deleted successfully",
	})
}

