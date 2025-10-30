package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name        *string
	Username    string  `gorm:"unique;not null"`
	Password    string  `gorm:"not null"`
	Role        string  `gorm:"default:Member"`
	PhoneNumber *string `gorm:"size:10"`
	Place       *string
	Cart        *Cart `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
