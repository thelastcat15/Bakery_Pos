package middleware

import (
	"github.com/gofiber/fiber/v2"
	"strings"
	"github.com/golang-jwt/jwt/v5"
	"os"
)

func Auth(c *fiber.Ctx) error {
	authCookie := c.Cookies("Authorization")
	if authCookie == "" || !strings.HasPrefix(authCookie, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing or invalid token",
		})
	}
	tokenString := strings.TrimPrefix(authCookie, "Bearer ")

	secret := os.Getenv("JWT_SECRET")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	// Set user info in Locals for downstream use
	c.Locals("role", claims["role"])
	c.Locals("userid", claims["userid"])
	return c.Next()
}
