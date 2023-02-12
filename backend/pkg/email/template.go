package email

import (
	"bytes"
	"fmt"
	"html/template"
	"path/filepath"
	"strings"

	"github.com/go-errors/errors"
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

	TemplateInvite            TemplateName = "invite"
	TemplatePasswordRecovery  TemplateName = "password_recovery"
	TemplateSubscriptionStart TemplateName = "subscription_start"
	TemplateTrialEnd          TemplateName = "trial_end"
	TemplateTrialEnding       TemplateName = "trial_ending"
	TemplateTrialMidway       TemplateName = "trial_midway"
	TemplateTrialStart        TemplateName = "trial_start"
	TemplateWelcome           TemplateName = "welcome"
)

var (
	templates = map[TemplateName]RawTemplate{
		TemplateInvite: {
			Subject: "Join [OrganizationName] on PoeticMetric",
		},
		TemplatePasswordRecovery: {
			Subject: "Password reset request",
		},
		TemplateSubscriptionStart: {
			Subject: "Thank you for choosing PoeticMetric",
		},
		TemplateTrialEnd: {
			Subject: "Your PoeticMetric free trial has ended",
		},
		TemplateTrialEnding: {
			Subject: "Last day of your PoeticMetric free trial",
		},
		TemplateTrialMidway: {
			Subject: "Make the most of your PoeticMetric free trial",
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
			return nil, errors.Wrap(err, 0)
		}
	}

	buffer := &bytes.Buffer{}

	err = t.Html.Execute(buffer, data)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &Template{
		Html:    buffer.Bytes(),
		Subject: strings.ReplaceAll(t.Subject, "[OrganizationName]", data["OrganizationName"]),
	}, nil
}
