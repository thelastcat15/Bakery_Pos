package db

import (
	"log"
	"os"

	storage_go "github.com/supabase-community/storage-go"
)
var Storage *storage_go.Client

func Connect_Storage() {
	accessKey := os.Getenv("STORAGE_ACCESS")
	if accessKey == "" {
		log.Fatal("STORAGE_ACCESS is not set")
	}
	secretKey := os.Getenv("STORAGE_SECRET")
	if secretKey == "" {
		log.Fatal("STORAGE_SECRET is not set")
	}

  Storage = storage_go.NewClient("https://"+accessKey+"/storage/v1", secretKey, nil)
}
