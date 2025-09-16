package storageapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
)

func (c *Client) Upload(bucket, path string, file []byte, contentType string) error {
	urlPath := fmt.Sprintf("/object/%s/%s", bucket, path)

	reqBody := bytes.NewReader(file)
	resp, err := c.DoRequest("POST", urlPath, reqBody)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return fmt.Errorf("upload failed: %s", string(data))
	}

	return nil
}

func (c *Client) GenerateUploadURL(bucket, objectPath string) (signedURL, publicURL string, err error) {
	urlPath := fmt.Sprintf("/object/upload/sign/%s/%s", bucket, objectPath)

	resp, err := c.DoRequest("POST", urlPath, nil)
	if err != nil {
		return "", "", fmt.Errorf("failed request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		data, _ := io.ReadAll(resp.Body)
		return "", "", fmt.Errorf("supabase error: %s", string(data))
	}

	var res struct {
		SignedURL string `json:"signedURL"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return "", "", err
	}

	publicURL = fmt.Sprintf("%s/object/public/%s/%s", c.baseURL(), bucket, objectPath)
	return res.SignedURL, publicURL, nil
}
