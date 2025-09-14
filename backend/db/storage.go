package db

import (
	"log"
	"os"

	storage_go "github.com/supabase-community/storage-go"
)

var Storage *storage_go.Client

func Connect_Storage() {
	storageUrl := os.Getenv("STORAGE_URL")
	if storageUrl == "" {
		log.Fatal("STORAGE_ACCESS is not set")
	}
	accessKey := os.Getenv("STORAGE_ACCESS")
	if accessKey == "" {
		log.Fatal("STORAGE_SECRET is not set")
	}

	Storage = storage_go.NewClient(storageUrl, "Bearer "+accessKey, nil)
	Storage.CreateBucket("product-images", storage_go.BucketOptions{
		Public: true,
	})
	log.Println("✅ Connected to Supabase Storage")
}
