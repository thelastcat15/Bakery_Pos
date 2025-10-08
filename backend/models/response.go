package models

import (
	"time"

	"github.com/google/uuid"
)

type MessageResponse struct {
	Message string `json:"message"`
}

type UserResponse struct {
	UserID      uuid.UUID `json:"userid"`
	Role        string    `json:"role"`
	Name        *string   `json:"name"`
	Username    string    `json:"username"`
	Exp         *int64    `json:"exp"`
	Place       *string   `json:"address,omitempty"`
	PhoneNumber *string   `json:"phone,omitempty"`
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
	ID        uint    `json:"id"`
	PublicURL *string `json:"public_url,omitempty"`
	UploadURL *string `json:"upload_url,omitempty"`
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
	Message string  `json:"message"`
	OrderID string  `json:"order_id"`
	Total   float64 `json:"total"`
	Status  string  `json:"status"`
}

type OrderResponse struct {
	OrderID   string  `json:"order_id"`
	Total     float64 `json:"total"`
	Status    string  `json:"status"`
	PublicURL *string `json:"public_url,omitempty"`
	UploadURL *string `json:"upload_url,omitempty"`

	CreatedAt time.Time `json:"create_at"`

	Items []OrderItem `json:"items"`
}

type UploadOrderSlipResponse struct {
	PublicURL string `json:"public_url"`
	UploadURL string `json:"upload_url"`
}
