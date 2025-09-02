package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Cart struct {
	gorm.Model
	ID 	   		string 				`gorm:"primaryKey;index"`
	UserID 		string 				`gorm:"unique;not null"`
	User 			User 					`gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Items  		[]CartItem 		`gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE"`
}

type CartItem struct {
	gorm.Model
	CartID    string    `gorm:"not null"`
	ProductID uint    	`gorm:"not null"`
	Quantity  int     	`gorm:"not null"`
	Product   Product 	`gorm:"foreignKey:ProductID"`
}

func (c *Cart) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = "ORD" + uuid.New().String()[:8]
	return
}
