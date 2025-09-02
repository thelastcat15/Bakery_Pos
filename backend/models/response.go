package models

import (
	"github.com/google/uuid"
)

type UserResponse struct {
	Message string `json:"message"`
	User    struct {
		UserID   uuid.UUID   `json:"userid"`
		Role     string 		 `json:"role"`
		Username string 		 `json:"username"`
		Exp      int64  		 `json:"exp"`
	} `json:"user"`
}

type CartItemResponse struct {
	ProductID   uint     `json:"product_id"`
	ProductName string   `json:"product_name"`
	Quantity    int      `json:"quantity"`
	Price       float64  `json:"price"`
	SalePrice   *float64 `json:"sale_price,omitempty"`
}

type CheckoutResponse struct {
	Message string  `json:"message"`
	OrderID uint    `json:"order_id"`
	Total   float64 `json:"total"`
	Status  string  `json:"status"`
}

type MessageResponse struct {
	Message 	string     `json:"message"`
}