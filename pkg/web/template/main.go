package template

import (
	"crypto/md5"
	"embed"
	"fmt"
	template2 "html/template"
	"io/fs"
	"net/http"
	"strings"

	"github.com/Masterminds/sprig/v3"
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
	"github.com/gorilla/csrf"
	"github.com/ztrue/tracerr"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

const (
	RenderParamsTypeHtml = "html"
)

type NewParams struct {
	EnvService poeticmetric.EnvService
}

type RenderParams struct {
	Data     Data
	Patterns []string
	Template string
}

type Template struct {
	envService poeticmetric.EnvService
	fs         fs.FS
}

func New(params NewParams) (*Template, error) {
	subFs, err := fs.Sub(files, "files")
	if err != nil {
		return nil, err
	}

	return &Template{
		envService: params.EnvService,
		fs:         subFs,
	}, nil
}

func (t *Template) Render(w http.ResponseWriter, r *http.Request, params RenderParams) error {
	template := template2.New(params.Template).
		Funcs(sprig.FuncMap()).
		Funcs(t.funcMap(r))

	template, err := template.ParseFS(t.fs, params.Patterns...)
	if err != nil {
		return tracerr.Wrap(err)
	}

	data := Data{}

	for k, v := range GetData(r) {
		data[k] = v
	}

	for k, v := range params.Data {
		data[k] = v
	}

	err = template.Execute(w, data)
	if err != nil {
		return tracerr.Wrap(err)
	}

	return nil
}

func (t *Template) RenderHtml(w http.ResponseWriter, r *http.Request, template string, data ...Data) error {
	var data2 Data
	if len(data) > 0 {
		data2 = data[0]
	}

	err := t.Render(w, r, RenderParams{
		Data:     data2,
		Patterns: []string{"layouts/base.gohtml", "partials/*.gohtml", fmt.Sprintf("%s.gohtml", template)},
		Template: "layout",
	})
	if err != nil {
		return tracerr.Wrap(err)
	}

	return nil
}

func (t *Template) funcMap(r *http.Request) template2.FuncMap {
	return template2.FuncMap{
		"csrf": func() template2.HTML {
			return csrf.TemplateField(r)
		},
		"href": func(path string) string {
			return path
		},
		"isCurrentPath": func(path string, exact ...bool) bool {
			if len(exact) > 0 && exact[0] {
				return r.URL.Path == path
			} else {
				return strings.HasPrefix(r.URL.Path, path)
			}
		},
		"markdown": func(text string) template2.HTML {
			extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
			p := parser.NewWithExtensions(extensions)
			doc := p.Parse([]byte(text))

			htmlFlags := html.CommonFlags | html.HrefTargetBlank
			opts := html.RendererOptions{Flags: htmlFlags}
			renderer := html.NewRenderer(opts)

			h := string(markdown.Render(doc, renderer))

			h = strings.ReplaceAll(h, "<table>", "<div class=\"fs-sm table-responsive\"><table>")
			h = strings.ReplaceAll(h, "</table>", "</table></div>")

			return template2.HTML(h) //nolint:gosec
		},
		"md5": func(text string) string {
			hash := md5.New() //nolint:gosec
			hash.Write([]byte(text))

			return fmt.Sprintf("%x", hash.Sum(nil))
		},
	}
}

//go:embed files/**
var files embed.FS
