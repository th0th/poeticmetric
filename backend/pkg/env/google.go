package env

import (
	"fmt"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/searchconsole/v1"
)

func GetGoogleOauthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     Get(GoogleClientId),
		ClientSecret: Get(GoogleClientSecret),
		Endpoint:     google.Endpoint,
		RedirectURL:  fmt.Sprintf(Get(FrontendBaseUrl)),
		Scopes:       []string{searchconsole.WebmastersReadonlyScope},
	}
}
