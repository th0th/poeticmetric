package htmlengine

import (
	"path"

	"github.com/gofiber/template/html/v2"

	"github.com/th0th/poeticmetric/internal/env"
	template2 "github.com/th0th/poeticmetric/internal/template"
)

func New() *html.Engine {
	engine := html.New(path.Join(env.Get().BasePath, "templates"), ".gohtml")

	engine.AddFuncMap(template2.GetFuncMap())

	return engine
}
