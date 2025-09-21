package routes

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/google/uuid"
)

// GetCart godoc
// @Summary Get user's cart
// @Description Retrieve the current user's cart items
// @Tags Cart
// @Produce json
// @Success 200 {object} []models.CartItemResponse
// @Router /cart [get]
func GetCart(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var cart models.Cart
	err = db.DB.
		Preload("Items.Product.Promotions").
		Preload("Items.Product.Images").
		Where("user_id = ?", userID).
		First(&cart).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			cart = models.Cart{UserID: userID}
			if err := db.DB.Create(&cart).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create cart"})
			}
			return c.Status(fiber.StatusOK).JSON([]models.CartItemResponse{})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.Status(fiber.StatusOK).JSON(cart.ToResponse())
}

// DeleteCart godoc
// @Summary Delete user's cart
// @Description Remove all items in user's cart
// @Tags Cart
// @Produce json
// @Success 200 {object} models.MessageResponse
// @Router /cart [delete]
func DeleteCart(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	if err := db.DB.Where("user_id = ?", userID).Delete(&models.Cart{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete cart",
		})
	}

	res := models.MessageResponse{
		Message: "Cart deleted successfully",
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

// UpdateProductCart godoc
// @Summary Update product quantity in cart
// @Description Increase or decrease quantity of a product in the user's cart
// @Tags Cart
// @Accept json
// @Produce json
// @Param product_id path int true "Product ID"
// @Param request body models.FormEditCart true "Quantity change"
// @Success 200 {object} []models.CartItemResponse
// @Router /cart/{product_id} [put]
func UpdateProductCart(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	productIDParam := c.Params("product_id")
	productIDUint, err := strconv.ParseUint(productIDParam, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid product ID",
		})
	}

	var body models.FormEditCart
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var cart models.Cart
	if err := db.DB.Preload("Items.Product.Promotions").
		Preload("Items.Product.Images").
		Where("user_id = ?", userID).
		First(&cart).Error; err != nil {

		if err == gorm.ErrRecordNotFound {
			cart = models.Cart{UserID: userID}
			if err := db.DB.Create(&cart).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to create cart"})
			}
		} else {
			return c.Status(500).JSON(fiber.Map{"error": "Database error"})
		}
	}

	var cartItem models.CartItem
	err = db.DB.Where("cart_id = ? AND product_id = ?", cart.ID, productIDUint).First(&cartItem).Error

	if err == gorm.ErrRecordNotFound {
		if body.Quantity > 0 {
			newItem := models.CartItem{
				CartID:    cart.ID,
				ProductID: uint(productIDUint),
				Quantity:  body.Quantity,
			}
			if err := db.DB.Create(&newItem).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to add product"})
			}
		} else {
			return c.Status(400).JSON(fiber.Map{"error": "Item does not exist"})
		}
	} else if err == nil {
		if body.Quantity <= 0 {
			if err := db.DB.Delete(&cartItem).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to remove item"})
			}
		} else {
			cartItem.Quantity = body.Quantity
			if err := db.DB.Save(&cartItem).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to update quantity"})
			}
		}
	} else {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	if err := db.DB.
		Preload("Items.Product.Promotions").
		Preload("Items.Product.Images").
		First(&cart, cart.ID).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to load updated cart"})
	}

	return c.Status(fiber.StatusOK).JSON(cart.ToResponse())
}

// Checkout godoc
// @Summary Checkout cart
// @Description Convert user's cart to an order
// @Tags Cart
// @Produce json
// @Success 200 {object} models.CheckoutResponse
// @Router /cart/checkout [post]
func Checkout(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var cart models.Cart
	if err := db.DB.Preload("Items.Product.Promotions").Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Cart not found"})
	}

	if len(cart.Items) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cart is empty"})
	}

	var total float64
	for _, item := range cart.Items {
		price := item.Product.FinalPrice()
		total += float64(item.Quantity) * price
	}

	order := models.Order{
		UserID: userID,
		Total:  total,
		Status: "pending",
	}

	tx := db.DB.Begin()
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create order"})
	}

	for _, item := range cart.Items {
		price := item.Product.FinalPrice()
		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     price,
		}

		if err := tx.Create(&orderItem).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"error": "Failed to create order item"})
		}
	}

	if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{"error": "Failed to clear cart"})
	}

	filePath := fmt.Sprintf("orders/%d/receipt.png", order.ID)
	signedURL, publicURL, err := db.Storage.GenerateUploadURL("orders_bucket", filePath)
	if err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate upload URL"})
	}

	if err := tx.Model(&order).Update("receipt_url", publicURL).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save receipt URL"})
	}

	tx.Commit()

	res := models.CheckoutResponse{
		Message:   "Checkout successful",
		OrderID:   order.ID,
		Total:     total,
		Status:    order.Status,
		UploadURL: &signedURL,
		PublicURL: &publicURL,
	}

	return c.Status(200).JSON(res)
}
