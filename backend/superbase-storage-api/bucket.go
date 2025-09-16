package storageapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
)

func (c *Client) ListBuckets() ([]BucketInfo, error) {
	resp, err := c.DoRequest("GET", "/bucket", nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("failed to list buckets: %s", string(data))
	}

	var buckets []BucketInfo
	if err := json.Unmarshal(data, &buckets); err != nil {
		return nil, err
	}

	return buckets, nil
}

func (c *Client) CreateBucket(name string, public bool) error {
	urlPath := "/bucket"

	payload := struct {
		Name   string `json:"name"`
		Public bool   `json:"public"`
	}{
		Name:   name,
		Public: public,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	resp, err := c.DoRequest("POST", urlPath, bytes.NewReader(data))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to create bucket: %s", string(body))
	}

	return nil
}
