package models

import "gorm.io/gorm"

type Cart struct {
    gorm.Model
    ID 	   string `gorm:"primaryKey;index"`
    UserID string `gorm:"unique;not null"`
    Items  []CartItem `gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE"`
}

type CartItem struct {
	gorm.Model
	CartID    uint    `gorm:"not null"`
	ProductID uint    `gorm:"not null"`
	Quantity  int     `gorm:"not null"`
	Product   Product `gorm:"foreignKey:ProductID"`
}

func (c *Cart) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = "ORD" + uuid.New().String()[:8]
	return
}
