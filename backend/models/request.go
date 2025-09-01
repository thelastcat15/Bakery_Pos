package models

type FormRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type FormSetting struct {
	PhoneNumber *string `json:"phone_number"`
	Place       *string `json:"place"`
}