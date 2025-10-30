package db

import (
	"log"
	"os"

	storageapi "Bakery_Pos/superbase-storage-api"
)

var Storage *storageapi.Client

func Connect_Storage() {
	projectID := os.Getenv("PROJECT_ID")
	if projectID == "" {
		log.Fatal("STORAGE_ACCESS is not set")
	}
	anonKey := os.Getenv("ANON_KEY")
	if anonKey == "" {
		log.Fatal("STORAGE_SECRET is not set")
	}
	secretKey := os.Getenv("SECRET_KEY")
	if secretKey == "" {
		log.Fatal("STORAGE_SECRET is not set")
	}

	Storage = storageapi.NewClient(projectID, anonKey, secretKey)
	Storage.CreateBucket("product-images", true)
	Storage.CreateBucket("order-slips", true)
}
