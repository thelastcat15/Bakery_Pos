package routes

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"Bakery_Pos/module"
	"errors"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"strings"
	"time"
)

func RegisterHandler(c *fiber.Ctx) error {
	var req models.FormRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	if req.Username == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := &models.User{
		Username: req.Username,
		Password: string(hashedPassword),
	}
	if err := db.DB.Create(user).Error; err != nil {
		return nil, err
	}

	if err := db.DB.Create(&newUser).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Email already in use",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	EXP := time.Now().Add(24 * time.Hour)
	tokenString := module.GenerateJWT(user, EXP)

	c.Cookie(&fiber.Cookie{
		Name:     "Authorization",
		Value:    "Bearer " + tokenString,
		Expires:  EXP,
		HTTPOnly: true,
		Secure:   true,
		SameSite: "None",
	})

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Register successful",
		"user": fiber.Map{
			"userid":   newUser.ID,
			"role":     newUser.Role,
			"name":     newUser.Name,
			"username": newUser.Username,
			"exp":      EXP.Unix(),
		},
	})
}


func LoginHandler(c *fiber.Ctx) error {
	var req models.FormRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	var user models.User
	if err := db.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid username or password",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	}

	EXP := time.Now().Add(24 * time.Hour)
	tokenString, err := module.GenerateJWT(user, EXP)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "Authorization",
		Value:    "Bearer " + tokenString,
		Expires:  EXP,
		HTTPOnly: true,
		Secure:   true,
		SameSite: "None",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login successful",
		"user": fiber.Map{
			"userid":   user.ID,
			"role":     user.Role,
			"username": user.Username,
			"exp":      EXP.Unix(),
		},
	})
}