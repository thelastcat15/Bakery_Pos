package routes

import (
	"fmt"

	"Bakery_Pos/db"
	"Bakery_Pos/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// GetAllOrders godoc
// @Summary Get all orders for the current user
// @Description Retrieve all orders of the logged-in user
// @Tags Order
// @Produce json
// @Success 200 {array} models.OrderResponse
// @Router /order [get]
func GetAllOrders(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var orders []models.Order
	if err := db.DB.Preload("items").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}

	var resp []models.OrderResponse
	for _, order := range orders {
		resp = append(resp, order.ToResponse(false))
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// GetOrderByID godoc
// @Summary Get a single order by ID
// @Description Retrieve a single order of the logged-in user
// @Tags Order
// @Produce json
// @Param order_id path string true "Order ID"
// @Success 200 {object} models.OrderResponse
// @Router /order/{order_id} [get]
func GetOrderByID(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	orderID := c.Params("order_id")
	var order models.Order
	if err := db.DB.Preload("items").Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch order"})
	}

	return c.Status(fiber.StatusOK).JSON(order.ToResponse(false))
}

// GenerateOrderSlipURL godoc
// @Summary Generate signed URL for uploading order slip
// @Description Generates a temporary signed URL for uploading an order payment slip
// @Tags Orders
// @Accept json
// @Produce json
// @Param order_id path string true "Order ID"
// @Success 200 {object} models.UploadOrderSlipResponse
// @Router /order/{order_id}/upload-slip [post]
func GenerateOrderSlipURL(c *fiber.Ctx) error {
	orderID := c.Params("order_id")

	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var order models.Order
	if err := db.DB.Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	fileName := fmt.Sprintf("order-%d-slip.png", order.ID)
	filePath := fmt.Sprintf("orders/%d/%s", order.ID, fileName)

	signedUpload, err := db.Storage.CreateSignedUploadUrl("order-slips", filePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	resp := models.UploadOrderSlipResponse{
		UploadURL: signedUpload.Url,
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// DeleteOrder godoc
// @Summary Delete an order
// @Description Delete a single order of the logged-in user
// @Tags Order
// @Produce json
// @Param order_id path string true "Order ID"
// @Success 200 {object} models.MessageResponse
// @Router /order/{order_id} [delete]
func DeleteOrder(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	orderID := c.Params("order_id")
	if err := db.DB.Where("id = ? AND user_id = ?", orderID, userID).Delete(&models.Order{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete order"})
	}

	return c.Status(fiber.StatusOK).JSON(models.MessageResponse{
		Message: "Order deleted successfully",
	})
}
