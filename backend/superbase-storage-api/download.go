package storageapi

import (
	"fmt"
	"io"
)

func (c *Client) GetPublicURL(bucket, objectPath string) string {
	return fmt.Sprintf("%s/object/public/%s/%s", c.baseURL(), bucket, objectPath)
}

func (c *Client) Download(bucket, path string) ([]byte, error) {
	urlPath := fmt.Sprintf("/object/%s/%s", bucket, path)

	resp, err := c.DoRequest("GET", urlPath, struct{}{})
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("download failed: %s", string(data))
	}

	return data, nil
}
