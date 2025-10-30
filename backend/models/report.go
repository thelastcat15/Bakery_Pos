package models

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
