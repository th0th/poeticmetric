package email

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"html/template"
	"mime"
	"net/smtp"
	"slices"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	EnvService poeticmetric.EnvService
}

type service struct {
	envService poeticmetric.EnvService
	smtpAddr   string
	smtpAuth   smtp.Auth
	templates  *template.Template
}

func New(params NewParams) (poeticmetric.EmailService, error) {
	s := service{
		envService: params.EnvService,
		smtpAddr:   params.EnvService.SmtpAddr(),
		smtpAuth:   params.EnvService.SmtpAuth(),
	}

	// templates
	ts, err := template.New("all").Funcs(s.funcMap()).ParseFS(templates, "files/templates/*.gohtml")
	if err != nil {
		return nil, err
	}

	s.templates = ts

	// templates - check
	var errs []error

	for _, t := range poeticmetric.EmailTemplates() {
		if ts.Lookup(string(t)) == nil {
			errs = append(errs, fmt.Errorf("template %s not found", t))
		}
	}

	for _, t := range ts.Templates() {
		if t.Name() != "all" && slices.Index(poeticmetric.StringSlice(poeticmetric.EmailTemplates()), t.Name()) == -1 {
			errs = append(errs, fmt.Errorf("template %s is not in the list", t.Name()))
		}
	}

	if len(errs) > 0 {
		return nil, errors.Join(errs...)
	}

	return &s, nil
}

func (s *service) Send(params poeticmetric.EmailServiceSendParams) error {
	buffer := bytes.Buffer{}

	err := s.templates.ExecuteTemplate(&buffer, string(params.Template), params.TemplateData)
	if err != nil {
		return err
	}

	// headers
	msg := ""
	msg += "Content-Type: text/html; charset=utf-8\n"
	msg += fmt.Sprintf("From: poeticmetric@dev.poeticmetric.com\n")
	msg += "MIME-Version: 1.0\n"
	msg += fmt.Sprintf("Subject: %s\n", mime.QEncoding.Encode("UTF-8", params.Subject))
	msg += fmt.Sprintf("To: %s\n", params.To.String())
	msg += "\n"
	msg += buffer.String()

	err = smtp.SendMail(s.smtpAddr, s.smtpAuth, "poeticmetric@dev.poeticmetric.com", []string{params.To.Address}, []byte(msg))
	if err != nil {
		return err
	}

	return nil
}

func (s *service) funcMap() template.FuncMap {
	return template.FuncMap{
		"frontendUrl": func(path string) string {
			return s.envService.FrontendUrl(path)
		},
	}
}

//go:embed files/smtp_message.gotxt
var smtpMessageTemplate string

//go:embed files/templates/*.gohtml
var templates embed.FS
