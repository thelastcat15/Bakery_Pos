package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"Bakery_Pos/models"
)

func GetCart(c *fiber.Ctx) error {
	userID := c.Locals("userid").(string)

	var cart models.Cart
	err := models.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create new cart for user
			cart = models.Cart{
				UserID: userID,
			}
			if err := models.DB.Create(&cart).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to create cart",
				})
			}
		} else {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Database error",
			})
		}
	}

	var items []fiber.Map
	for _, item := range cart.Items {
		price := item.Product.Price
		if item.Product.IsOnSale && item.Product.SalePrice != nil {
			price = *item.Product.SalePrice
		}

		itemMap := fiber.Map{
			"product_id":   item.ProductID,
			"product_name": item.Product.Name,
			"quantity":     item.Quantity,
			"price":        item.Product.Price,
			"subtotal":     float64(item.Quantity) * price,
		}

		if item.Product.IsOnSale && item.Product.SalePrice != nil {
			itemMap["sale_price"] = *item.Product.SalePrice
		}

		items = append(items, itemMap)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"cart_id": cart.ID,
		"user_id": cart.UserID,
		"items":   items,
	})
}


func Checkout(c *fiber.Ctx) error {
	userID := c.Locals("userid").(uint)

	var cart models.Cart
	if err := models.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart not found",
		})
	}

	if len(cart.Items) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cart is empty",
		})
	}

	var total float64
	for _, item := range cart.Items {
		total += float64(item.Quantity) * item.Product.Price
	}

	order := models.Order{
		UserID: userID,
		Total:  total,
		Status: "pending",
	}
	tx := models.DB.Begin()
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create order"})
	}

	for _, item := range cart.Items {
		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     item.Product.Price,
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

	tx.Commit()

	return c.Status(200).JSON(fiber.Map{
		"message":    "Checkout successful",
		"order_id":   order.ID,
		"total":      total,
		"status":     order.Status,
	})
}
