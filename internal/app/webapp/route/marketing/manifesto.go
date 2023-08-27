package marketing

import (
	"html/template"
	"os"
	"path"

	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/markdown"
)

func manifesto(c *fiber.Ctx) error {
	payload := fiber.Map{
		"Description": "Discover the principles that guide PoeticMetric. Our privacy-first approach, commitment to transparency, dedication to sustainability, and focus on efficiency set us apart in the analytics industry. Read our manifesto now.",
		"Title":       "Manifesto",
	}

	manifestoFileBuf, err := os.ReadFile(path.Join(env.Get().BasePath, "MANIFESTO.md"))
	if err != nil {
		return errors.Wrap(err, 0)
	}

	payload["Manifesto"] = template.HTML(markdown.Html(string(manifestoFileBuf)))

	return c.Render("marketing/manifesto", payload)
}
