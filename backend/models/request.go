package models

import "time"

type FormRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type FormSetting struct {
	PhoneNumber *string `json:"phone_number"`
	Place       *string `json:"place"`
}

type FormEditCart struct {
	Quantity int `json:"quantity"`
}

type BodyProductRequest struct {
	Name        string  `json:"name" gorm:"type:varchar(255);not null"`
	Description string  `json:"detail" gorm:"type:text"`
	Tag         string  `json:"category" gorm:"not null"`
	Price       float64 `json:"price" gorm:"not null"`
	Stock       int     `json:"quantity" gorm:"not null"`
	IsActive    bool    `json:"is_active" gorm:"default:true"`
}
type ImageIDsRequest struct {
	IDs []uint `json:"ids"`
}

type BodyPromotionRequest struct {
	ProductID   uint      `json:"product_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Discount    float64   `json:"discount"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	IsActive    bool      `json:"is_active"`
}

type BodyUpdateOrder struct {
	Status string `json:"status"`
}
