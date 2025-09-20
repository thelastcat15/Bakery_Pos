package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	UserID uuid.UUID `gorm:"not null;index"`
	Total  float64
	Status string      `gorm:"type:varchar(20);check:status IN ('pending','confirmed','shipping','delivered')"`
	Items  []OrderItem `gorm:"constraint:OnDelete:CASCADE;"`
}

type OrderItem struct {
	OrderID   uint `gorm:"not null;index:idx_order_product,unique"`
	ProductID uint `gorm:"not null;index:idx_order_product,unique"`
	Quantity  int  `gorm:"not null"`

	Name        string
	Description string
	Tag         string
	Price       float64
	ImageURL    string
}
