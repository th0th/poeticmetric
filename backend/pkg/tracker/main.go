package tracker

import (
	"bytes"
	"text/template"

	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/js"
	"github.com/th0th/poeticmetric/backend/pkg/env"
)

var output *string

func Get() string {
	if output == nil {
		t, err := template.ParseFiles("/poeticmetric/assets/templates/pm.js")
		if err != nil {
			panic(err)
		}

		var b bytes.Buffer

		err = t.Execute(&b, map[string]string{
			"RestApiBaseUrl": env.Get(env.RestApiBaseUrl),
		})
		if err != nil {
			panic(err)
		}

		m := minify.New()

		m.AddFunc("application/javascript", js.Minify)

		out, err := m.String("application/javascript", b.String())
		if err != nil {
			panic(err)
		}

		output = &out
	}

	return *output
}
