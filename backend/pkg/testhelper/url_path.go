package testhelper

import (
	"fmt"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
)

func GetRandomUrlPath() string {
	return fmt.Sprintf("/%s", strings.SplitN(gofakeit.URL(), "/", 4)[3])
}
