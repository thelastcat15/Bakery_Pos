package models

func (user *User) ToResponse() UserResponse {
	resp := UserResponse{
		UserID:      user.ID,
		Role:        user.Role,
		Name:        user.Name,
		Username:    user.Username,
		Place:       user.Place,
		PhoneNumber: user.PhoneNumber,
	}
	return resp
}

func (img *Image) ToResponse() ImageResponse {
	resp := ImageResponse{
		ID: img.ID,
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
		OrderID:   order.ID,
		Total:     order.Total,
		Status:    order.Status,
		Items:     order.Items,
		CreatedAt: order.CreatedAt,
	}
	return resp
}

func (c *Cart) ToResponse() []CartItemResponse {
	var items []CartItemResponse

	for _, item := range c.Items {
		if item.Product == nil {
			continue
		}

		images := make([]ImageResponse, len(item.Product.Images))
		for i, img := range item.Product.Images {
			images[i] = img.ToResponse()
		}

		items = append(items, CartItemResponse{
			ProductID:   item.ProductID,
			ProductName: item.Product.Name,
			Quantity:    item.Quantity,
			Price:       item.Product.Price,
			SalePrice:   item.Product.FinalPrice(),
			Images:      images,
		})
	}

	if items == nil {
		items = []CartItemResponse{}
	}

	return items
}
