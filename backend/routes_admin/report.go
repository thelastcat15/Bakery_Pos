package routes_admin

import (
	"Bakery_Pos/db"
	"Bakery_Pos/models"
	"log"
	"strconv"
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

	// Ensure we always return an array of 24 hours (00:00..23:00) so frontend chart
	// receives a consistent payload even when there are no rows for some hours.
	hourMapTotal := make(map[string]models.SalesByHourReport)
	for _, r := range results {
		hourMapTotal[r.Hour] = r
	}

	full := make([]models.SalesByHourReport, 0, 24)
	for h := 0; h < 24; h++ {
		key := ""
		if h < 10 {
			key = "0" + strconv.Itoa(h) + ":00"
		} else {
			key = strconv.Itoa(h) + ":00"
		}
		if v, ok := hourMapTotal[key]; ok {
			full = append(full, v)
		} else {
			full = append(full, models.SalesByHourReport{Hour: key, Total: 0, Orders: 0})
		}
	}

	return c.JSON(full)
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

// @Summary Get products sales summary
// @Description Get sales summary per product for a date range (optional)
// @Tags reports
// @Accept json
// @Produce json
// @Param start query string false "Start date YYYY-MM-DD"
// @Param end query string false "End date YYYY-MM-DD"
// @Success 200 {array} models.ProductSalesSummary
// @Router /reports/products/sales [get]
func GetProductSalesSummary(c *fiber.Ctx) error {
	startStr := c.Query("start")
	endStr := c.Query("end")

	var start time.Time
	var end time.Time
	var err error

	if startStr != "" {
		start, err = time.Parse("2006-01-02", startStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid start date format"})
		}
	}
	if endStr != "" {
		end, err = time.Parse("2006-01-02", endStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid end date format"})
		}
		// include the full day
		end = end.AddDate(0, 0, 1)
	}

	var results []models.ProductSalesSummary

	// pagination params (optional). If limit <= 0, return full list (backwards compatible)
	limit := c.QueryInt("limit", 0)
	page := c.QueryInt("page", 1)
	if page < 1 {
		page = 1
	}

	// base query used for both count and data
	base := db.DB.Table("order_items").
		Select("order_items.product_id as product_id, products.name as product_name, SUM(order_items.quantity) as total_quantity, SUM(order_items.quantity * order_items.price) as total_revenue").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Joins("JOIN products ON products.id = order_items.product_id")

	if !start.IsZero() && !end.IsZero() {
		base = base.Where("orders.created_at >= ? AND orders.created_at < ?", start, end)
	} else if !start.IsZero() {
		base = base.Where("orders.created_at >= ?", start)
	} else if !end.IsZero() {
		base = base.Where("orders.created_at < ?", end)
	}

	// if pagination requested, compute total distinct products first
	var total int64
	if limit > 0 {
		// count distinct product ids matching filters
		countQ := db.DB.Table("order_items").Joins("JOIN orders ON orders.id = order_items.order_id")
		if !start.IsZero() && !end.IsZero() {
			countQ = countQ.Where("orders.created_at >= ? AND orders.created_at < ?", start, end)
		} else if !start.IsZero() {
			countQ = countQ.Where("orders.created_at >= ?", start)
		} else if !end.IsZero() {
			countQ = countQ.Where("orders.created_at < ?", end)
		}
		if err := countQ.Distinct("order_items.product_id").Count(&total).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to count product sales"})
		}

		offset := (page - 1) * limit
		q := base.Group("order_items.product_id, products.name").Order("total_quantity DESC").Limit(limit).Offset(offset)
		if q = q.Scan(&results); q.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch product sales"})
		}

		// return paginated response
		return c.JSON(fiber.Map{"data": results, "total": total, "page": page, "limit": limit})
	}

	// no pagination requested — return full list for backward compatibility
	q := base.Group("order_items.product_id, products.name").Order("total_quantity DESC").Scan(&results)
	if q.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch product sales"})
	}

	return c.JSON(results)
}

// @Summary Get customers for a product
// @Description Get customers who bought a specific product with order counts and totals
// @Tags reports
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param start query string false "Start date YYYY-MM-DD"
// @Param end query string false "End date YYYY-MM-DD"
// @Success 200 {array} models.ProductCustomerDetail
// @Router /reports/products/{id}/customers [get]
func GetProductCustomers(c *fiber.Ctx) error {
	idStr := c.Params("id")
	if idStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "product id is required"})
	}
	// parse product id to integer to ensure correct SQL parameter type
	pid, parseErr := strconv.ParseUint(idStr, 10, 64)
	if parseErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid product id"})
	}
	productID := uint(pid)

	startStr := c.Query("start")
	endStr := c.Query("end")

	var start time.Time
	var end time.Time
	var err error

	if startStr != "" {
		start, err = time.Parse("2006-01-02", startStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid start date format"})
		}
	}
	if endStr != "" {
		end, err = time.Parse("2006-01-02", endStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid end date format"})
		}
		end = end.AddDate(0, 0, 1)
	}

	var results []models.ProductCustomerDetail

	// Cast orders.user_id to uuid to avoid Postgres type-mismatch errors when the
	// column is stored as text in the orders table while users.id is uuid.
	q := db.DB.Table("order_items").
		Select("orders.user_id::uuid as customer_id, COALESCE(users.name, users.username) as customer_name, COUNT(DISTINCT orders.id) as order_count, SUM(order_items.quantity) as total_quantity, SUM(order_items.quantity * order_items.price) as total_amount").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Joins("JOIN users ON orders.user_id::uuid = users.id").
		Where("order_items.product_id = ?", productID)

	if !start.IsZero() && !end.IsZero() {
		q = q.Where("orders.created_at >= ? AND orders.created_at < ?", start, end)
	} else if !start.IsZero() {
		q = q.Where("orders.created_at >= ?", start)
	} else if !end.IsZero() {
		q = q.Where("orders.created_at < ?", end)
	}

	// Group by the casted uuid to match the SELECT alias
	q = q.Group("orders.user_id::uuid, users.name, users.username").Order("total_amount DESC").Scan(&results)

	if q.Error != nil {
		// Log full DB error server-side and return the error message in the response
		// (useful for development; consider hiding details in production)
		log.Printf("GetProductCustomers query error: %v", q.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": q.Error.Error()})
	}

	return c.JSON(results)
}
