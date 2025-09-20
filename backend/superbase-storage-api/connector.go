package storageapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func NewClient(projectID, anonKey, bearer string) *Client {
	c := &Client{
		ProjectID: projectID,
		AnonKey:   anonKey,
		Bearer:    bearer,
		Headers: map[string]string{
			"Authorization": "Bearer " + bearer,
			"apikey":        bearer,
			"Content-Type":  "application/json",
		},
	}

	buckets, err := c.ListBuckets()
	if err == nil {
		log.Println("✅ Connected to Supabase Storage")
		for _, b := range buckets {
			fmt.Printf("Bucket: %s, Public: %v\n", b.Name, b.Public)
		}
	} else {
		log.Fatal("❌ Failed to connect to Supabase Storage:", err)
		return nil
	}

	return c
}

func (s *Client) baseURL() string {
	return fmt.Sprintf("https://%s.supabase.co/storage/v1", s.ProjectID)
}

func (c *Client) DoRequest(method, path string, payload any) (*http.Response, error) {
	var body io.Reader

	if payload != nil {
		jsonBytes, err := json.Marshal(payload)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal payload to JSON: %w", err)
		}
		body = bytes.NewReader(jsonBytes)
	}

	req, err := http.NewRequest(method, c.baseURL()+path, body)
	if err != nil {
		return nil, err
	}

	for k, v := range c.Headers {
		req.Header.Set(k, v)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
