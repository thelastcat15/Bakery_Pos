package storageapi

type Client struct {
	ProjectID string
	AnonKey   string
	Bearer    string
	Headers   map[string]string
}

type SignUploadFile struct {
	URL   string `json:"url"`
	Token string `json:"token"`
}

type BucketInfo struct {
	Name      string `json:"name"`
	ID        string `json:"id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Public    bool   `json:"public"`
	Owner     string `json:"owner"`
}
