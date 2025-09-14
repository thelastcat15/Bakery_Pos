package main

import (
	"log"
	
	"Bakery_Pos/middleware"
	"Bakery_Pos/db"
	"Bakery_Pos/routes"
	"Bakery_Pos/routes_admin"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	
	_ "Bakery_Pos/docs"
  "github.com/gofiber/swagger"
)

// @title Bakery POS API
// @version 1.0
// @description This is a Bakery POS API documentation
// @host localhost:3000
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
	app.Use(cors.New())

	api := app.Group("/api")

	user := api.Group("/user")
	user.Post("/login", routes.LoginHandler)
	user.Get("/register", routes.RegisterHandler)
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
	product_select.Post("/images", middleware.Auth, middleware.Admin, routes_admin.DeleteImagesProduct)

	cart := api.Group("/cart", middleware.Auth)
	cart.Get("/", routes.GetCart)
	cart.Delete("/", routes.DeleteCart)
	cart.Put("/:product_id", routes.UpdateProductCart)
	cart.Post("/checkout", routes.Checkout)

	order := api.Group("/order", middleware.Auth)
	order.Get("/", routes.GetAllOrders)
	order.Get("/:order_id", routes.GetOrderByID)
	order.Delete("/:order_id", routes.DeleteOrder)
	order.Post("/:order_id/upload-slip", routes.GenerateOrderSlipURL)

	// admin := api.Group("/admin", middleware.Auth, middleware.Admin)
	// admin.Post("/edit-stock", routes.EditStock)
	// admin.Get("/dashboard", routes.ViewDashboard)
	// admin.Get("/promotion", routes.ViewDashboard)
	
  app.Get("/*", swagger.HandlerDefault)
	app.Listen(":3000")
}