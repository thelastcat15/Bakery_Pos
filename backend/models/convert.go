package models


func (p *Product) ToResponse() ProductResponse {
	images := make([]ImageResponse, len(p.Images))
	for i, img := range p.Images {
		images[i] = ImageResponse{
			FileName:  img.FileName,
			PublicURL: img.PublicURL,
			UploadURL: img.UploadURL,
			Order:     img.Order,
		}
	}

	return ProductResponse{
		ID:          &p.ID,
		Name:        p.Name,
		Description: p.Description,
		Tag:         p.Tag,
		Price:       p.Price,
		Stock:       p.Stock,
		IsActive:    p.IsActive,
		Images:      images,
	}
}

func ToProductResponseList(products []Product) []ProductResponse {
	responses := make([]ProductResponse, len(products))
	for i := range products {
		responses[i] = products[i].ToResponse()
	}
	return responses
}