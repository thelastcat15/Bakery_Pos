package models

import (
  "gorm.io/gorm"
)

type SlideShow struct {
  gorm.Model
  Name   string  `json:"name"`
  Slides []Slide `json:"slides" gorm:"foreignKey:SlideShowID;constraint:OnDelete:CASCADE"`
}

type Slide struct {
	SlideShowID 	uint    	`json:"slide_show_id"`
	Title       	string  	`json:"title"`
	ImageURL    	*string 	`json:"image_url"`
	Link        	string  	`json:"link"`
	Order       	int     	`json:"order"`
	IsActive    	bool    	`json:"is_active"`
}