package marketing

import "github.com/gofiber/fiber/v2"

func home(c *fiber.Ctx) error {
	payload := fiber.Map{
		"Title":       "Free and open source, privacy-friendly Google Analytics alternative",
		"Description": "PoeticMetric is a free as in freedom, open source, privacy-first and regulation-compliant website analytics tool. You can keep track of your website&apos;s traffic without invading your visitors' privacy.",
	}

	return c.Render("marketing/home", payload)
}
