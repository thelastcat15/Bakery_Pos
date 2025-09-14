package db

import (
	"log"
	"os"

	// "Bakery_Pos/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect_DB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	log.Println("✅ Connected to Supabase PostgreSQL")

	// if err := DB.AutoMigrate(
	// 	&models.User{},
	// 	&models.Cart{},
	// 	&models.CartItem{},
	// 	&models.Product{},
	// 	&models.Image{},
	// 	&models.Promotion{},
	// 	&models.Order{},
	// 	&models.OrderItem{},
	// ); err != nil {
	// 	log.Fatalf("AutoMigrate failed: %v", err)
	// }
	log.Println("✅ Auto Migration completed")
}
