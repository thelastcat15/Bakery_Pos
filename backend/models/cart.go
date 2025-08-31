package models

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	CartID uint 		 	`gorm:"not null;index"`
	UserID uint      	`gorm:"not null"`
	Items  []CartItem `gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE"`
}

type CartItem struct {
	gorm.Model
	CartID    uint    `gorm:"not null"`
	ProductID uint    `gorm:"not null"`
	Quantity  int     `gorm:"not null"`
	Product   Product `gorm:"foreignKey:ProductID"`
}
