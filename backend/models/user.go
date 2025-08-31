package models

import "gorm.io/gorm"

type User struct {
  gorm.Model
	ID       		uint   		`gorm:"primaryKey"`
	Username 		string 		`gorm:"unique;not null"`
	Password 		string 		`gorm:"not null"`
	Role     		string 		`gorm:"not null";default:member"`
	PhoneNumber string
	Place       string
}

