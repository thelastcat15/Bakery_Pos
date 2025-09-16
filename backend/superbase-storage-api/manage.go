package storageapi

import (
	"fmt"
	"io"
)

func (c *Client) RemoveFile(bucket, path string) error {
	urlPath := fmt.Sprintf("/object/%s/%s", bucket, path)

	resp, err := c.DoRequest("DELETE", urlPath, nil)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return fmt.Errorf("delete failed: %s", string(data))
	}

	return nil
}
