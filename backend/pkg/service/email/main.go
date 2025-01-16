package email

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"html/template"
	"net/smtp"
	"slices"
	texttemplate "text/template"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	EnvService poeticmetric.EnvService
}

type smtpMessageParams struct {
	Body    string
	From    string
	Subject string
	To      string
}

type service struct {
	envService poeticmetric.EnvService
	templates  *template.Template
}

func New(params NewParams) (poeticmetric.EmailService, error) {
	// parse all template files first
	templates, err := template.New("").Funcs(funcMap(params.EnvService)).ParseFS(templatesFs, "files/templates/*.gohtml")
	if err != nil {
		return nil, err
	}

	// check if all templates are present
	var errs []error
	for _, t := range poeticmetric.EmailTemplates() {
		if templates.Lookup(string(t)) == nil {
			errs = append(errs, fmt.Errorf("template %s not found", t))
		}
	}

	// check if there are any excess templates
	for _, t := range templates.Templates() {
		if t.Name() != "" && slices.Index(poeticmetric.StringSlice(poeticmetric.EmailTemplates()), t.Name()) == -1 {
			errs = append(errs, fmt.Errorf("template %s is not in the list", t.Name()))
		}
	}

	if len(errs) > 0 {
		return nil, errors.Join(errs...)
	}

	return &service{
		envService: params.EnvService,
		templates:  templates,
	}, nil
}

func (s *service) Send(params poeticmetric.SendEmailParams) error {
	templateBuffer := bytes.Buffer{}
	err := s.templates.ExecuteTemplate(&templateBuffer, string(params.Template), params.TemplateData)
	if err != nil {
		return err
	}

	smtpMessageTemplate, err := texttemplate.New("").Parse(smtpMessageTemplateString)
	if err != nil {
		return err
	}

	smtpMessageTemplateBuffer := bytes.Buffer{}
	err = smtpMessageTemplate.Execute(&smtpMessageTemplateBuffer, smtpMessageParams{
		Body:    templateBuffer.String(),
		From:    s.envService.SmtpFrom().String(),
		Subject: params.Subject,
		To:      params.To.String(),
	})
	if err != nil {
		return err
	}

	err = smtp.SendMail(
		s.envService.SmtpAddr(),
		s.envService.SmtpAuth(),
		s.envService.SmtpFrom().Address,
		[]string{params.To.Address},
		smtpMessageTemplateBuffer.Bytes(),
	)
	if err != nil {
		return err
	}

	return nil
}

func funcMap(envService poeticmetric.EnvService) template.FuncMap {
	return template.FuncMap{
		"frontendUrl": func(path string) string {
			return envService.FrontendUrl(path)
		},
	}
}

//go:embed files/smtp_message.gotxt
var smtpMessageTemplateString string

//go:embed files/templates/*.gohtml
var templatesFs embed.FS
