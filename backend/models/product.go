package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string  `json:"name" gorm:"type:varchar(255);not null"`
	Description string  `json:"description" gorm:"type:text"`
	Price       float64 `json:"price" gorm:"not null"`
	Stock       int     `json:"stock" gorm:"not null"`
	IsActive    bool    `json:"is_active" gorm:"default:true"`
}
