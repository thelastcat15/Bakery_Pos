package routes_admin

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

// @Summary Get top selling products
// @Description Get top N selling products for a given period
// @Tags reports
// @Accept json
// @Produce json
// @Param period query string false "Period (day|week|month)" default(week)
// @Param limit query int false "Number of products" default(5)
// @Success 200 {array} models.TopProductReport
// @Router /reports/products/top [get]
func GetTopProducts(c *fiber.Ctx) error {
	period := c.Query("period", "week")
	limit := c.QueryInt("limit", 5)

	// คำนวณช่วงเวลา
	now := time.Now()
	var start time.Time
	switch period {
	case "day":
		start = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	case "month":
		start = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	default: // week
		weekday := int(now.Weekday())
		if weekday == 0 {
			weekday = 7
		}
		start = now.AddDate(0, 0, -weekday+1) // Monday
		start = time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0, start.Location())
	}

	var results []models.TopProductReport

	err := db.DB.Table("order_items").
		Select("order_items.product_id, products.name, SUM(order_items.quantity) as total_sold, SUM(order_items.quantity * order_items.price) as revenue").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Joins("JOIN products ON products.id = order_items.product_id").
		Where("orders.created_at >= ?", start).
		Group("order_items.product_id, products.name").
		Order("total_sold DESC").
		Limit(limit).
		Scan(&results).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch report"})
	}

	return c.JSON(results)
}

// @Summary Get sales by hour
// @Description Get sales aggregated by hour for a specific date (default: today)
// @Tags reports
// @Accept json
// @Produce json
// @Param date query string false "Date in format YYYY-MM-DD (default: today)"
// @Success 200 {array} models.SalesByHourReport
// @Router /reports/sales/hourly [get]
func GetSalesByHour(c *fiber.Ctx) error {
	dateStr := c.Query("date")

	var date time.Time
	var err error

	if dateStr == "" {
		// ถ้าไม่ส่ง date → ใช้วันนี้
		now := time.Now()
		date = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	} else {
		date, err = time.Parse("2006-01-02", dateStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid date format"})
		}
	}

	start := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	end := start.AddDate(0, 0, 1)

	var results []models.SalesByHourReport

	err = db.DB.Table("orders").
		Select("TO_CHAR(orders.created_at, 'HH24:00') as hour, SUM(orders.total) as total, COUNT(*) as orders").
		Where("orders.created_at >= ? AND orders.created_at < ?", start, end).
		Group("hour").
		Order("hour").
		Scan(&results).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch report"})
	}

	return c.JSON(results)
}

// @Summary Get sales by day
// @Description Get sales aggregated by day for a date range
// @Tags reports
// @Accept json
// @Produce json
// @Param start query string true "Start date in format YYYY-MM-DD"
// @Param end query string true "End date in format YYYY-MM-DD"
// @Success 200 {array} models.SalesByDayReport
// @Router /reports/sales/daily [get]
func GetSalesByDay(c *fiber.Ctx) error {
	startStr := c.Query("start")
	endStr := c.Query("end")

	if startStr == "" || endStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "start and end dates are required"})
	}

	start, err1 := time.Parse("2006-01-02", startStr)
	end, err2 := time.Parse("2006-01-02", endStr)
	if err1 != nil || err2 != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid date format"})
	}

	end = end.AddDate(0, 0, 1)

	var results []models.SalesByDayReport

	err := db.DB.Table("orders").
		Select("TO_CHAR(created_at, 'YYYY-MM-DD') as date, SUM(total) as total, COUNT(*) as orders").
		Where("created_at >= ? AND created_at < ?", start, end).
		Group("date").
		Order("date").
		Scan(&results).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch report"})
	}

	return c.JSON(results)
}
