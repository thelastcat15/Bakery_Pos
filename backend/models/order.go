package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Order struct {
	ID          string    `gorm:"primaryKey"`
	UserID      uuid.UUID `gorm:"not null;index"`
	Total       float64
	PaymentSlip string `gorm:"type:text"`
	Status      string `gorm:"type:varchar(20);check:status IN ('pending','confirmed','shipping','delivered')"`

	Items     []OrderItem `gorm:"foreignKey:OrderID;references:ID;constraint:OnDelete:CASCADE"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type OrderItem struct {
	ID        uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID   string `gorm:"not null;index:idx_order_product,unique" json:"order_id"`
	ProductID uint   `gorm:"not null;index:idx_order_product,unique" json:"product_id"`
	Quantity  int    `gorm:"not null" json:"quantity"`

	Name        string  `json:"name"`
	Description string  `json:"description"`
	Tag         string  `json:"tag"`
	Price       float64 `json:"price"`
}

func (o *Order) BeforeCreate(tx *gorm.DB) (err error) {
	if o.ID == "" {
		uuidPart := uuid.New().String()[:6]
		timePart := fmt.Sprintf("%04d", time.Now().UnixNano()/1e6%10000)
		o.ID = fmt.Sprintf("ORD-%s%s", uuidPart, timePart)
	}
	return
}
