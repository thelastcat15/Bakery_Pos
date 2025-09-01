package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string   `json:"name" gorm:"type:varchar(255);not null"`
	Description string   `json:"description" gorm:"type:text"`
	Tag         string   `json:"tag" gorm:"not null"`
	Price       float64  `json:"price" gorm:"not null"`
	SalePrice   *float64 `json:"sale_price"`
	Stock       int      `json:"stock" gorm:"not null"`
	IsActive    bool     `json:"is_active" gorm:"default:true"`
	IsOnSale    bool     `json:"is_on_sale" gorm:"default:false"`
}