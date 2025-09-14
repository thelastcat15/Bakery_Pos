package models

import (
	"github.com/google/uuid"
)

type MessageResponse struct {
	Message 	string     `json:"message"`
}

type UserResponse struct {
	Message string `json:"message"`
	User    struct {
		UserID   uuid.UUID   `json:"userid"`
		Role     string 		 `json:"role"`
		Username string 		 `json:"username"`
		Exp      int64  		 `json:"exp"`
	} `json:"user"`
}

type ProductResponse struct {
	ID 				  uint         			`json:"id"`
  Name        string       				`json:"name"`
  Description string       				`json:"description"`
  Tag         string       				`json:"tag"`
  Price       float64      				`json:"price"`
  Stock       int          				`json:"stock"`
  IsActive    bool         				`json:"is_active"`
  Images      []ImageResponse     `json:"images,omitempty"`
}

type ImagesArrayResponse struct {
  Images []ImageResponse `json:"images"`
}

type ImageResponse struct {
  ID        uint	 `json:"id"`
  FileName  string `json:"file_name"`
	PublicURL *string `json:"public_url,omitempty"`
  UploadURL *string `json:"upload_url,omitempty"`
  Order     int    `json:"order"`
}

type CartItemResponse struct {
	ProductID   uint    `json:"product_id"`
	ProductName string  `json:"product_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	SalePrice   float64 `json:"sale_price"`
}

type CheckoutResponse struct {
	Message string  `json:"message"`
	OrderID uint    `json:"order_id"`
	Total   float64 `json:"total"`
	Status  string  `json:"status"`
}

type OrderResponse struct {
	OrderID uint        `json:"order_id"`
	Total   float64     `json:"total"`
	Status  string      `json:"status"`
	Items   []OrderItem `json:"items"`
}

type UploadOrderSlipResponse struct {
	UploadURL string `json:"upload_url"`
}