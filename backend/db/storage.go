package db

import (
	"log"
	"os"

	storage_go "github.com/supabase-community/storage-go"
)
var Storage *storage_go.Client

func Connect_Storage() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	Storage = storage_go.NewClient("https://16b92140b9fb3fcd19a34f9e1d1eadc6.supabase.co/storage/v1", "5655cfde514a96b4bf68a94948cc703aac29b44dd55d64bd64d6125fd4fea152", nil)
	log.Println("✅ Connect Supabase Storage completed")
}
