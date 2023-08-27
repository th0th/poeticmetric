package markdown

import (
	"strings"

	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
)

func Html(md string) string {
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)
	doc := p.Parse([]byte(md))

	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{Flags: htmlFlags}
	renderer := html.NewRenderer(opts)

	h := string(markdown.Render(doc, renderer))

	h = strings.ReplaceAll(h, "<table>", "<div class=\"fs-sm table-responsive\"><table>")
	h = strings.ReplaceAll(h, "</table>", "</table></div>")

	return h
}
