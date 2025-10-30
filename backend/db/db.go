package db

import (
	"Bakery_Pos/models"
	"log"
	"os"

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

	if err := DB.AutoMigrate(
		&models.User{},
		&models.Cart{},
		&models.CartItem{},
		&models.Product{},
		&models.Image{},
		&models.Promotion{},
		&models.Order{},
		&models.OrderItem{},
	); err != nil {
		log.Fatalf("AutoMigrate failed: %v", err)
	}
	log.Println("✅ Auto Migration completed")

	// Ensure sequences are in sync with table max(id) to avoid duplicate key errors
	// This can happen if rows were inserted manually or restored without updating the sequence.
	// Adjust the sequence for promotions table.
	if err := DB.Exec(
		"SELECT setval(pg_get_serial_sequence('promotions','id'), COALESCE((SELECT MAX(id) FROM promotions), 0))",
	).Error; err != nil {
		log.Printf("Warning: failed to sync promotions sequence: %v", err)
	} else {
		log.Println("✅ promotions sequence synced")
	}
}
