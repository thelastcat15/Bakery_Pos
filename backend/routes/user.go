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

	"github.com/google/uuid"
)

// RegisterHandler godoc
// @Summary Register a new user
// @Description Create a new user account and return JWT token
// @Tags user
// @Accept json
// @Produce json
// @Param request body models.FormRequest true "User registration data"
// @Success 201 {object} models.UserResponse
// @Router /user/register [post]
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

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	// Create user struct
	user := &models.User{
		Username: req.Username,
		Password: string(hashedPassword),
	}

	// Save user to DB
	if err := db.DB.Create(user).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Username already in use",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	// Generate token
	EXP := time.Now().Add(24 * time.Hour)
	tokenString, err := module.GenerateJWT(user, EXP)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	// Set cookie
	c.Cookie(&fiber.Cookie{
		Name:     "Authorization",
		Value:    "Bearer " + tokenString,
		Expires:  EXP,
		HTTPOnly: true,
		Secure:   true,
		SameSite: "None",
	})

	// Return response
	resp := models.UserResponse{
		Message: "Register successful",
	}
	resp.User.UserID = user.ID
	resp.User.Role = user.Role
	resp.User.Username = user.Username
	resp.User.Exp = EXP.Unix()

	return c.Status(fiber.StatusCreated).JSON(resp)
}

// LoginHandler godoc
// @Summary Login user
// @Description Authenticate user and return JWT token
// @Tags user
// @Accept json
// @Produce json
// @Param request body models.FormRequest true "User login data"
// @Success 200 {object} models.UserResponse
// @Router /user/login [post]
func LoginHandler(c *fiber.Ctx) error {
	var req models.FormRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	var user models.User
	if err := db.DB.Where("user_id = ?", req.Username).First(&user).Error; err != nil {
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
	tokenString, err := module.GenerateJWT(&user, EXP)
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

	resp := models.UserResponse{
		Message: "Login successful",
	}
	resp.User.UserID = user.ID
	resp.User.Role = user.Role
	resp.User.Username = user.Username
	resp.User.Exp = EXP.Unix()

	return c.Status(fiber.StatusOK).JSON(resp)
}

// UpdateSetting godoc
// @Summary Update user settings
// @Description Update phone number or place for authenticated user
// @Tags user
// @Accept json
// @Produce json
// @Param request body models.FormSetting true "Update settings"
// @Success 200 {object} models.MessageResponse
// @Router /user/settings [put]
// @Security BearerAuth
func UpdateSetting(c *fiber.Ctx) error {
	userIDStr := c.Locals("userid").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID",
    })
	}

	var input models.FormSetting
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var user models.User
	if err := db.DB.First(&user, "id = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	updated := false
	if input.PhoneNumber != nil {
		phone := strings.TrimSpace(*input.PhoneNumber)
		if len(phone) != 10 || !isDigitsOnly(phone) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Phone number must be 10 digits",
			})
		}
		user.PhoneNumber = phone
		updated = true
	}

	if input.Place != nil {
		place := strings.TrimSpace(*input.Place)
		if place == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Place cannot be empty",
			})
		}
		user.Place = place
		updated = true
	}

	if !updated {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No fields to update",
		})
	}

	// Save changes
	if err := db.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	
	res := models.MessageResponse{
		Message: "User updated successfully",
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func isDigitsOnly(s string) bool {
	for _, r := range s {
		if r < '0' || r > '9' {
			return false
		}
	}
	return true
}
