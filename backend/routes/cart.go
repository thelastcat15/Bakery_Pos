package routes

import (
  "strconv"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"Bakery_Pos/models"
	"Bakery_Pos/db"
)

func GetCart(c *fiber.Ctx) error {
	userID := c.Locals("userid").(string)

	var cart models.Cart
	err := db.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			cart = models.Cart{
				UserID: userID,
			}
			if err := db.DB.Create(&cart).Error; err != nil {
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
		itemMap := fiber.Map{
			"product_id":   item.ProductID,
			"product_name": item.Product.Name,
			"quantity":     item.Quantity,
			"price":        item.Product.Price,
		}

		if item.Product.IsOnSale && item.Product.SalePrice != nil {
			itemMap["sale_price"] = *item.Product.SalePrice
		}

		items = append(items, itemMap)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user_id": cart.UserID,
		"items":   items,
	})
}

func UpdateProductCart(c *fiber.Ctx) error {
	userID := c.Locals("userid").(string)

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

	if body.QuantityChange == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Quantity change is required",
		})
	}

	var cart models.Cart
	if err := db.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
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
		if body.QuantityChange > 0 {
			newItem := models.CartItem{
				CartID:    cart.ID,
				ProductID: uint(productIDUint),
				Quantity:  body.QuantityChange,
			}
			if err := db.DB.Create(&newItem).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to add product"})
			}
		} else {
			return c.Status(400).JSON(fiber.Map{"error": "Cannot reduce quantity of a non-existing item"})
		}
	} else if err == nil {
		newQuantity := cartItem.Quantity + body.QuantityChange
		if newQuantity <= 0 {
			if err := db.DB.Delete(&cartItem).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to remove item"})
			}
		} else {
			cartItem.Quantity = newQuantity
			if err := db.DB.Save(&cartItem).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to update quantity"})
			}
		}
	} else {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	if err := db.DB.Preload("Items.Product").First(&cart, cart.ID).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to load updated cart"})
	}

	var items []fiber.Map
	for _, item := range cart.Items {
		itemMap := fiber.Map{
			"product_id":   item.ProductID,
			"product_name": item.Product.Name,
			"quantity":     item.Quantity,
			"price":        item.Product.Price,
		}

		if item.Product.IsOnSale && item.Product.SalePrice != nil {
			itemMap["sale_price"] = *item.Product.SalePrice
		}

		items = append(items, itemMap)
	}

	return c.Status(200).JSON(fiber.Map{
		"user_id": cart.UserID,
		"items":   items,
	})
}


func Checkout(c *fiber.Ctx) error {
	userID := c.Locals("userid").(string)

	var cart models.Cart
	if err := db.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
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
		price := item.Product.Price
		if item.Product.IsOnSale && item.Product.SalePrice != nil {
			price = *item.Product.SalePrice
		}
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
		price := item.Product.Price
		if item.Product.IsOnSale && item.Product.SalePrice != nil {
			price = *item.Product.SalePrice
		}

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

	tx.Commit()

	return c.Status(200).JSON(fiber.Map{
		"message":    "Checkout successful",
		"order_id":   order.ID,
		"total":      total,
		"status":     order.Status,
	})
}
