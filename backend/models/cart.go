package models

import (
	"github.com/google/uuid"
)

type Cart struct {
	ID     uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID uuid.UUID  `gorm:"not null;uniqueIndex"`
	Items  []CartItem `gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE"`
}

type CartItem struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	CartID    uuid.UUID `gorm:"not null;index:idx_cart_product,unique"`
	ProductID uint      `gorm:"not null;index:idx_cart_product,unique"`
	Quantity  int       `gorm:"not null"`
	Product   *Product  `gorm:"foreignKey:ProductID"`
}
