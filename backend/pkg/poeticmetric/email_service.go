package poeticmetric

import (
	"net/mail"
)

const (
	EmailServiceTemplatePasswordRecovery EmailServiceTemplate = "password-recovery.gohtml"
)

type EmailService interface {
	Send(params EmailServiceSendParams) error
}

type EmailServiceMessageParams struct {
	Body    string
	From    *mail.Address
	Subject string
	To      []*mail.Address
}

type EmailServiceSendParams struct {
	Subject      string
	Template     EmailServiceTemplate
	TemplateData any
	To           *mail.Address
}

type EmailServiceTemplate string

type EmailServiceTemplatePasswordRecoveryParams struct {
	User User
}

func EmailTemplates() []EmailServiceTemplate {
	return []EmailServiceTemplate{
		EmailServiceTemplatePasswordRecovery,
	}
}
