package main

import (
	"log"
	
	"Bakery_Pos/middleware"
	"Bakery_Pos/db"
	"Bakery_Pos/routes"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	db.Connect_DB()
	db.Connect_Storage()

	app := fiber.New()
	app.Use(cors.New())

	api := app.Group("/api")

	product := api.Group("/user")
	product.Post("/login", routes.LoginHandler)
	product.Get("/register", routes.RegisterHandler)
	product.Get("/setting", routes.UpdateSetting)

	product := api.Group("/product")
	product.Post("/", routes.CreateProduct)
	product.Get("/", routes.GetProducts)
	product.Get("/:id", routes.GetProductByID)

	cart := api.Group("/cart", middleware.Auth)
	cart.Get("/", routes.GetCart)
	cart.Post("/", routes.AddToCart)
	cart.Delete("/", routes.DeleteCart)
	cart.Put("/:product_id", routes.UpdateProductCart)
	cart.Delete("/:product_id", routes.DeleteProductCart)
	cart.Post("/checkout", routes.Checkout)

	order := api.Group("/order", middleware.Auth)
	order.Get("/", routes.GetAllOrders)
	order.Get("/:order_id", routes.GetOrder)

	admin := api.Group("/admin", middleware.Auth, middleware.Admin)
	// admin.Post("/edit-stock", routes.EditStock)
	// admin.Get("/dashboard", routes.ViewDashboard)
	
	productAdmin := admin.Group("/products")
	productAdmin.Put("/:id", routes.UpdateProduct)
	productAdmin.Delete("/:id", routes.DeleteProduct)



	app.Listen(":3000")
}