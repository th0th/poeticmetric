package frontend

import (
	"fmt"

	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
)

func GenerateUrl(path string) string {
	return fmt.Sprintf("%s%s", env.Get(env.FrontendBaseUrl), path)
}
