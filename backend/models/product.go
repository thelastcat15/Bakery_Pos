package models

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name        string      `json:"name" gorm:"unique;type:varchar(255);not null"`
	Description string      `json:"description" gorm:"type:text"`
	Tag         string      `json:"tag" gorm:"not null"`
	Price       float64     `json:"price" gorm:"not null"`
	Stock       int         `json:"stock" gorm:"not null"`
	IsActive    bool        `json:"is_active" gorm:"default:true"`
	Images      []Image     `json:"images" gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE"`
	Promotions  []Promotion `json:"promotions" gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE"`
}

type Image struct {
	ID        uint
	ProductID uint
	FilePath  string
	PublicURL *string
}

type Promotion struct {
	gorm.Model
	ProductID   uint      `json:"product_id" gorm:"not null;index"` // foreign key
	Name        string    `json:"name" gorm:"type:varchar(255);not null"`
	Description string    `json:"description" gorm:"type:text"`
	Discount    float64   `json:"discount" gorm:"not null"`
	StartDate   time.Time `json:"start_date" gorm:"not null"`
	EndDate     time.Time `json:"end_date" gorm:"not null"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
}

func (p *Product) FinalPrice() float64 {
	price := p.Price
	maxDiscount := 0.0
	for _, promo := range p.Promotions {
		if promo.IsActive {
			if promo.Discount > maxDiscount {
				maxDiscount = promo.Discount
			}
		}
	}
	return price - (price * maxDiscount / 100)
}
