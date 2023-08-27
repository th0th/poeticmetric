package colormode

import (
	url2 "net/url"

	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"
	"github.com/savsgio/gotils/strings"
)

const (
	cookieName = "colorMode"
	localsKey  = "ColorMode"
	queryKey   = "colorMode"
)

var colorModes = []string{"auto", "dark", "light"}

func New(c *fiber.Ctx) error {
	colorModeFromQuery := c.Query(queryKey)

	if colorModeFromQuery != "" {
		if strings.Include(colorModes, colorModeFromQuery) {
			c.Cookie(&fiber.Cookie{
				Name:  cookieName,
				Value: colorModeFromQuery,
			})
		} else {
			c.ClearCookie(cookieName)
		}

		url, err := url2.Parse(c.OriginalURL())
		if err != nil {
			return errors.Wrap(err, 0)
		}

		q := url.Query()
		q.Del(queryKey)
		url.RawQuery = q.Encode()

		return c.Redirect(url.String())
	}

	colorMode := "auto"

	colorModeFromCookie := c.Cookies(cookieName)

	if strings.Include(colorModes, colorModeFromCookie) {
		colorMode = colorModeFromCookie
	}

	c.Locals(localsKey, colorMode)

	return c.Next()
}
