package main

import (
	"log"
	"strings"

	"Bakery_Pos/db"
	"Bakery_Pos/middleware"
	"Bakery_Pos/routes"
	"Bakery_Pos/routes_admin"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	_ "Bakery_Pos/docs"

	"github.com/gofiber/swagger"
)

// @title Bakery POS API
// @version 1.0
// @description This is a Bakery POS API documentation
// @host localhost:5000
// @BasePath /api
// @schemes http
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	db.Connect_DB()
	db.Connect_Storage()

	app := fiber.New(fiber.Config{
		StrictRouting: false,
	})
	app.Use(func(c *fiber.Ctx) error {
		forwarded := c.Get("X-Forwarded-For")
		realIP := c.Get("X-Real-IP")

		ip := c.IP()
		if forwarded != "" {
			parts := strings.Split(forwarded, ",")
			ip = strings.TrimSpace(parts[0])
		} else if realIP != "" {
			ip = realIP
		}
		log.Printf("Request: %s %s, IP: %s", c.Method(), c.OriginalURL(), ip)
		return c.Next()
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000, http://127.0.0.1:3000, https://silver-guacamole-p6xpxx5xg4ph7j4-3000.app.github.dev/",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowCredentials: true,
	}))

	api := app.Group("/api")

	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})

	user := api.Group("/user")
	user.Post("/login", routes.LoginHandler)
	user.Post("/register", routes.RegisterHandler)
	user.Get("/setting", routes.UpdateSetting)

	product := api.Group("/products")
	product.Get("/", middleware.AuthOptional, routes.GetProducts)
	product.Post("/", middleware.Auth, middleware.Admin, routes_admin.CreateProduct)

	product_select := product.Group("/:id")
	product_select.Get("/", middleware.AuthOptional, routes.GetProductByID)
	product_select.Put("/", middleware.Auth, middleware.Admin, routes_admin.UpdateProduct)
	product_select.Delete("/", middleware.Auth, middleware.Admin, routes_admin.DeleteProduct)
	product_select.Get("/images", middleware.AuthOptional, routes.GetImagesProduct)
	product_select.Post("/images", middleware.Auth, middleware.Admin, routes_admin.UploadImagesProduct)
	product_select.Delete("/images", middleware.Auth, middleware.Admin, routes_admin.DeleteImagesByID)

	// Promotions (admin)
	promotions := api.Group("/promotions")
	promotions.Get("/", routes_admin.GetPromotions)
	promotions.Post("/", middleware.Auth, middleware.Admin, routes_admin.CreatePromotion)
	promotions.Get(":id", routes_admin.GetPromotionByID)
	promotions.Put(":id", middleware.Auth, middleware.Admin, routes_admin.UpdatePromotion)
	promotions.Delete(":id", middleware.Auth, middleware.Admin, routes_admin.DeletePromotion)

	cart := api.Group("/cart", middleware.Auth)
	cart.Get("/", routes.GetCart)
	cart.Delete("/", routes.DeleteCart)
	cart.Put("/:product_id", routes.UpdateProductCart)
	cart.Post("/checkout", routes.Checkout)

	order := api.Group("/order", middleware.Auth)
	order.Get("/", routes.GetAllOrders)
	order.Get("/:order_id", routes.GetOrderByID)
	order.Put("/:order_id", routes.UpdateOrderStatus)
	order.Delete("/:order_id", routes.DeleteOrder)
	order.Post("/:order_id/upload-slip", routes.GenerateOrderSlipURL)

	reports := api.Group("/reports", middleware.Auth, middleware.Admin)
	reports.Get("/products/top", routes_admin.GetTopProducts)
	reports.Get("/sales/hourly", routes_admin.GetSalesByHour)
	reports.Get("/sales/daily", routes_admin.GetSalesByDay)
	// Product level reports
	reports.Get("/products/sales", routes_admin.GetProductSalesSummary)
	reports.Get("/products/:id/customers", routes_admin.GetProductCustomers)

	app.Get("/*", swagger.HandlerDefault)
	app.Listen(":5000")
}
