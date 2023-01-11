package email

import (
	"bytes"
	"fmt"
	"html/template"
	"path/filepath"
)

type RawTemplate *struct {
	Html    *template.Template
	Subject string
}

type Template struct {
	Html    []byte
	Subject string
}

type TemplateName string

const (
	basePath = "/poeticmetric/assets/email_templates"

	TemplatePasswordRecovery TemplateName = "password_recovery"
	TemplateTrialStart       TemplateName = "trial_start"
	TemplateWelcome          TemplateName = "welcome"
)

var (
	templates = map[TemplateName]RawTemplate{
		TemplatePasswordRecovery: {
			Subject: "Password recovery for PoeticMetric",
		},
		TemplateTrialStart: {
			Subject: "30-Day Free Trial: Gain valuable insights into your website's traffic with PoeticMetric",
		},
		TemplateWelcome: {
			Subject: "Welcome to PoeticMetric",
		},
	}
)

func GetTemplate(name TemplateName, data map[string]string) (*Template, error) {
	var err error

	t := templates[name]

	if t.Html == nil {
		templatePath := filepath.Join(basePath, fmt.Sprintf("%s.gohtml", name))

		t.Html, err = template.ParseFiles(templatePath)
		if err != nil {
			return nil, err
		}
	}

	buffer := &bytes.Buffer{}

	err = t.Html.Execute(buffer, data)
	if err != nil {
		return nil, err
	}

	return &Template{
		Html:    buffer.Bytes(),
		Subject: t.Subject,
	}, nil
}
