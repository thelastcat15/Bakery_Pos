package middleware

import (
	"github.com/gofiber/fiber/v2"
)

func Admin(c *fiber.Ctx) error {
	role, ok := c.Locals("role").(string)
	if !ok || role != "Admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied: admin only",
		})
	}
	return c.Next()
}
