package main

import (
	"Bakery_Pos/backend/middleware"
	"Bakery_Pos/backend/module/db"
	"Bakery_Pos/backend/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	db.Connect()

	app := fiber.New()
	app.Use(cors.New())

	api := app.Group("/api")

	product := api.Group("/products")
	product.Post("/", routes.CreateProduct)
	product.Get("/", routes.GetProducts)
	product.Get("/:id", routes.GetProductByID)
	product.Put("/:id", routes.UpdateProduct)
	product.Delete("/:id", routes.DeleteProduct)

	admin := api.Group("/admin", middleware.Auth, middleware.Admin)
	admin.Post("/edit-stock", routes.EditStock)
	admin.Get("/dashboard", routes.ViewDashboard)

	app.Listen(":3000")
}