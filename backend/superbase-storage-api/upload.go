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

	resp, err := c.DoRequest("POST", urlPath, struct{}{})
	if err != nil {
		return "", "", fmt.Errorf("failed request: %w", err)
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", "", fmt.Errorf("failed to read body: %w", err)
	}

	if resp.StatusCode >= 300 {
		return "", "", fmt.Errorf("supabase error: %s", string(data))
	}

	var res SignUploadFile
	if err := json.Unmarshal(data, &res); err != nil {
		return "", "", fmt.Errorf("failed to decode JSON: %w", err)
	}

	signedURL = fmt.Sprintf("%s%s", c.baseURL(), res.URL)
	publicURL = fmt.Sprintf("%s/object/public/%s/%s", c.baseURL(), bucket, objectPath)
	return signedURL, publicURL, nil
}
