package models

import (
	"github.com/google/uuid"
)

type UserResponse struct {
	Message string `json:"message"`
	User    struct {
		UserID   uuid.UUID   `json:"userid"`
		Role     string 		 `json:"role"`
		Username string 		 `json:"username"`
		Exp      int64  		 `json:"exp"`
	} `json:"user"`
}
