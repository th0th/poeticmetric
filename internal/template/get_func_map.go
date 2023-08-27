package template

import (
	"crypto/md5"
	"fmt"
	"html/template"
	"strings"

	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/internal/app/webapp/toast"
)

func GetFuncMap() template.FuncMap {
	return template.FuncMap{
		"clearToasts": func(c *fiber.Ctx) string {
			toast.Clear(c)

			return ""
		},
		"gravatarUrl": func(email string, size int) string {
			hash := md5.New()
			hash.Write([]byte(email))

			return fmt.Sprintf("https://www.gravatar.com/avatar/%x?s=%d", hash.Sum(nil), size)
		},
		"map": func(args ...any) (fiber.Map, error) {
			if len(args)%2 != 0 {
				return nil, errors.New("number of params should be even")
			}

			m := fiber.Map{}

			for i := 0; i < len(args); i += 2 {
				m[args[i].(string)] = args[i+1]
			}

			return m, nil
		},
		"stringHasPrefix": func(s string, prefix string) bool {
			return strings.HasPrefix(s, prefix)
		},
	}
}
