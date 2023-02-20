package email

import (
	"fmt"
	"net/smtp"

	"github.com/go-errors/errors"
	"github.com/th0th/poeticmetric/backend/pkg/env"
)

type SendInput struct {
	From         *string
	Template     TemplateName
	TemplateData map[string]string
	To           string
}

func Send(input *SendInput) error {
	template, err := GetTemplate(input.Template, input.TemplateData)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	// from
	from := env.Get(env.SmtpUser)

	if input.From != nil {
		from = *input.From
	}

	headers := map[string]string{
		"Content-Type": "text/html; charset=utf-8",
		"From":         fmt.Sprintf("PoeticMetric <%s>", from),
		"MIME-Version": "1.0",
		"Subject":      template.Subject,
		"To":           input.To,
	}

	msg := []byte{}

	for k, v := range headers {
		msg = append(msg, []byte(fmt.Sprintf("%s: %s\n", k, v))...)
	}

	msg = append(msg, []byte("\n")...)
	msg = append(msg, template.Html...)

	var auth smtp.Auth

	addr := fmt.Sprintf("%s:%s", env.Get(env.SmtpHost), env.Get(env.SmtpPort))

	smtpUser := env.Get(env.SmtpUser)
	smtpPassword := env.Get(env.SmtpPassword)

	if smtpPassword != "" && smtpUser != "" {
		auth = smtp.PlainAuth("", env.Get(env.SmtpUser), env.Get(env.SmtpPassword), env.Get(env.SmtpHost))
	}

	return smtp.SendMail(addr, auth, from, []string{input.To}, msg)
}
