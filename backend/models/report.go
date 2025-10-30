package models

import "github.com/google/uuid"

type TopProductReport struct {
	ProductID uint    `json:"product_id"`
	Name      string  `json:"name"`
	TotalSold int     `json:"quantity"`
	Revenue   float64 `json:"revenue"`
}

type SalesByHourReport struct {
	Hour   string  `json:"hour"`
	Total  float64 `json:"total"`
	Orders int     `json:"orders"`
}

type SalesByDayReport struct {
	Date   string  `json:"date"`
	Total  float64 `json:"total"`
	Orders int     `json:"orders"`
}

// Product level summaries used by admin UI
type ProductSalesSummary struct {
	ProductID     uint    `json:"product_id"`
	ProductName   string  `json:"product_name"`
	TotalQuantity int     `json:"total_quantity"`
	TotalRevenue  float64 `json:"total_revenue"`
}

// Customer level details for a specific product
type ProductCustomerDetail struct {
	CustomerID    uuid.UUID `json:"customer_id"`
	CustomerName  string    `json:"customer_name"`
	OrderCount    int       `json:"order_count"`
	TotalQuantity int       `json:"total_quantity"`
	TotalAmount   float64   `json:"total_amount"`
}
