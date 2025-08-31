package module

import (
	"Bakery_Pos/models"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var jwtKey = []byte("your_secret_key") // Replace with your secret key

func GenerateJWT(User models.User, exp time.Time) (string, error) {
	claims := jwt.MapClaims{
		"user_id": User.ID,
		"username": User.Username,
		"role": User.Role,
		"exp": exp.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
