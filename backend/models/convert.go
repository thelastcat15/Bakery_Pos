package models

func (img *Image) ToResponse(isAdmin bool) ImageResponse {
	resp := ImageResponse{
		Order:     img.Order,
		PublicURL: img.PublicURL,
	}

	if isAdmin {
		resp.FileName = img.FileName
		resp.UploadURL = img.UploadURL
	}
	return resp
}

func (p *Product) ToResponse(isAdmin bool) ProductResponse {
	images := make([]ImageResponse, len(p.Images))
	for i, img := range p.Images {
		images[i] = img.ToResponse(isAdmin)
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

func (order *Order) ToResponse(isAdmin bool) OrderResponse {
	resp := OrderResponse{
		OrderID: order.ID,
		Total:   order.Total,
		Status:  order.Status,
		Items:   order.Items,
	}
	return resp
}