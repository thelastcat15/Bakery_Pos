package models

func (img *Image) ToResponse(isAdmin bool) ImageResponse {
	resp := ImageResponse{
		ID:        img.ID,
		FileName:  img.FileName,
		Order:     img.Order,
		PublicURL: img.PublicURL,
	}

	if isAdmin {
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