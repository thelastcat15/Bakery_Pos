package models

import (
	"github.com/google/uuid"
)

type MessageResponse struct {
	Message string `json:"message"`
}

type UserResponse struct {
	UserID      uuid.UUID `json:"userid"`
	Role        string    `json:"role"`
	Username    string    `json:"username"`
	Exp         *int64    `json:"exp"`
	Place       *string   `json:"place,omitempty"`
	PhoneNumber *string   `json:"phone_number,omitempty"`
}

type ProductResponse struct {
	ID          uint            `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"detail"`
	Tag         string          `json:"category"`
	Price       float64         `json:"price"`
	Stock       int             `json:"quantity"`
	IsActive    bool            `json:"is_active"`
	Images      []ImageResponse `json:"images,omitempty"`
}

type ImagesArrayResponse struct {
	Images []ImageResponse `json:"images"`
}

type ImageResponse struct {
	PublicURL *string `json:"public_url,omitempty"`
	UploadURL *string `json:"upload_url,omitempty"`
	Order     int     `json:"order"`
}

type CartItemResponse struct {
	ProductID   uint            `json:"id"`
	ProductName string          `json:"name"`
	Quantity    int             `json:"quantity"`
	Price       float64         `json:"price"`
	SalePrice   float64         `json:"sale_price"`
	Images      []ImageResponse `json:"images,omitempty"`
}

type CheckoutResponse struct {
	Message   string  `json:"message"`
	OrderID   uint    `json:"order_id"`
	Total     float64 `json:"total"`
	Status    string  `json:"status"`
	PublicURL *string `json:"public_url,omitempty"`
	UploadURL *string `json:"upload_url,omitempty"`
}

type OrderResponse struct {
	OrderID uint        `json:"order_id"`
	Total   float64     `json:"total"`
	Status  string      `json:"status"`
	Items   []OrderItem `json:"items"`
}

type UploadOrderSlipResponse struct {
	PublicURL string `json:"public_url"`
	UploadURL string `json:"upload_url"`
}
