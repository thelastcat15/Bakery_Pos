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

	db.Connect()

	app := fiber.New()
	app.Use(cors.New())

	api := app.Group("/api")

	product := api.Group("/products")
	product.Post("/", routes.CreateProduct)
	product.Get("/", routes.GetProducts)
	product.Get("/:id", routes.GetProductByID)

	admin := api.Group("/admin", middleware.Auth, middleware.Admin)
	// admin.Post("/edit-stock", routes.EditStock)
	// admin.Get("/dashboard", routes.ViewDashboard)
	
	productAdmin := admin.Group("/products")
	productAdmin.Put("/:id", routes.UpdateProduct)
	productAdmin.Delete("/:id", routes.DeleteProduct)



	app.Listen(":3000")
}