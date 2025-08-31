package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	UserID 		uint 			`gorm:"not null;index"`
	OrderID 	uint 			`gorm:"not null;index"`
	Total  		float64
	Status 		string
	Items  		[]OrderItem
}

type OrderItem struct {
	gorm.Model
	OrderID   uint    `gorm:"not null"`
	ProductID uint    `gorm:"not null"`
	Quantity  int     `gorm:"not null"`
	Price     float64
	Product   Product `gorm:"foreignKey:ProductID"`
}
