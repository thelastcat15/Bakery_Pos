package models

func (user *User) ToResponse() UserResponse {
	resp := UserResponse{
		UserID:      user.ID,
		Role:        user.Role,
		Username:    user.Username,
		Place:       user.Place,
		PhoneNumber: user.PhoneNumber,
	}
	return resp
}

func (img *Image) ToResponse() ImageResponse {
	resp := ImageResponse{
		Order: img.Order,
	}

	if img.PublicURL != nil && *img.PublicURL != "" {
		resp.PublicURL = img.PublicURL
	}
	return resp
}

func (p *Product) ToResponse() ProductResponse {
	images := make([]ImageResponse, len(p.Images))
	for i, img := range p.Images {
		images[i] = img.ToResponse()
	}

	return ProductResponse{
		ID:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		Tag:         p.Tag,
		Price:       p.Price,
		Stock:       p.Stock,
		IsActive:    p.IsActive,
		Images:      images,
	}
}

func (order *Order) ToResponse() OrderResponse {
	resp := OrderResponse{
		OrderID: order.ID,
		Total:   order.Total,
		Status:  order.Status,
		Items:   order.Items,
	}
	return resp
}
