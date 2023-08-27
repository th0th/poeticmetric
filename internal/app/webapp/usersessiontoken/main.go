package usersessiontoken

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

const cookieName = "user_session_token"

func Get(c *fiber.Ctx) string {
	return c.Cookies(cookieName)
}

func Clear(c *fiber.Ctx) {
	cookie := getCookie()

	cookie.Expires = time.Now().Add(10 * -365 * 24 * time.Hour)

	c.Cookie(cookie)
}

func Set(c *fiber.Ctx, token string) {
	cookie := getCookie()
	cookie.Value = token

	c.Cookie(cookie)
}

func getCookie() *fiber.Cookie {
	return &fiber.Cookie{
		Name:     cookieName,
		Path:     "/",
		HTTPOnly: true,
	}
}
