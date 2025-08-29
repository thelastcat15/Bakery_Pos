package module

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"golang.org/x/crypto/bcrypt"
)


func CreateUser(req models.RegisterRequest) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := &models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     req.Role,
		Name:     req.Username,
	}
	if err := db.DB.Create(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func CheckPasswordHash(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
