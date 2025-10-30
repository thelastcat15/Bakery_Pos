package routes

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GetProducts godoc
// @Summary Get all products
// @Description Retrieve all products with optional filters
// @Tags product
// @Accept json
// @Produce json
// @Param lowStock query bool false "Filter products with stock < 10"
// @Param q query string false "Search term to filter products by name or tag"
// @Param simple query bool false "Return lightweight list (id,name,tag) for selection"
// @Param limit query int false "Number of products per page (default 20)"
// @Param page query int false "Page number (default 1)"
// @Success 200 {array} models.ProductResponse
// @Success 200 {array} object "When `simple=true` returns array of {id,name,tag} objects"
// @Router /products [get]
func GetProducts(c *fiber.Ctx) error {
	var products []models.Product

	// query params
	lowStock := c.QueryBool("lowStock", false)
	limit := c.QueryInt("limit", 20)
	page := c.QueryInt("page", 1)

	// db query
	// support simple mode: return only id, name, tag for product selection
	simple := c.QueryBool("simple", false)
	q := c.Query("q", "")

	query := db.DB.Order("updated_at DESC")
	if !simple {
		query = query.Preload("Images")
	}
	if lowStock {
		query = query.Where("stock < ?", 10)
	}
	if q != "" {
		like := fmt.Sprintf("%%%s%%", q)
		query = query.Where("name LIKE ? OR tag LIKE ?", like, like)
	}

	// pagination
	offset := (page - 1) * limit
	if simple {
		// return lightweight list
		type SimpleProduct struct {
			ID   uint   `json:"id"`
			Name string `json:"name"`
			Tag  string `json:"tag"`
		}
		var simples []SimpleProduct
		if err := query.Model(&models.Product{}).Select("id, name, tag").Limit(limit).Offset(offset).Find(&simples).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch products"})
		}
		return c.Status(fiber.StatusOK).JSON(simples)
	}

	if err := query.Limit(limit).Offset(offset).Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch products"})
	}

	responses := make([]models.ProductResponse, len(products))
	for i := range products {
		responses[i] = products[i].ToResponse()
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
	id := c.Params("id")
	var product models.Product
	// Change "images" to "Images" to match the struct field name
	if err := db.DB.Preload("Images").First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}
	return c.Status(fiber.StatusOK).JSON(product.ToResponse())
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

	responses := make([]models.ImageResponse, 0, len(images))

	for i := range images {
		img := &images[i]
		if img.PublicURL == nil || *img.PublicURL == "" {
			SignedURL, PublicURL, _ := db.Storage.GenerateUploadURL("test", img.FilePath)
			if SignedURL != "" {
				img.PublicURL = &SignedURL

				if err := db.DB.Model(img).Update("public_url", PublicURL).Error; err != nil {
					fmt.Println("Failed to update public URL for image", img.ID, ":", err)
				}
			}
		}

		responses = append(responses, img.ToResponse())
	}

	return c.Status(fiber.StatusOK).JSON(models.ImagesArrayResponse{
		Images: responses,
	})
}
