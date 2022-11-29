package testhelper

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"strings"
)

func GetRandomUrlPath() string {
	return fmt.Sprintf("/%s", strings.SplitN(gofakeit.URL(), "/", 4)[3])
}
