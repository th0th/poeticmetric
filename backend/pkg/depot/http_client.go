package depot

import (
	"net/http"
	"time"
)

func (dp *Depot) HttpClient() *http.Client {
	if dp.httpClient == nil {
		dp.httpClient = &http.Client{
			Timeout: 10 * time.Second,
		}
	}

	return dp.httpClient
}
