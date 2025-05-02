package poeticmetric

import (
	"net/mail"
)

const (
	InvitationEmailTemplate       EmailTemplate = "invitation.gohtml"
	PasswordRecoveryEmailTemplate EmailTemplate = "password-recovery.gohtml"
	WelcomeEmailTemplate          EmailTemplate = "welcome.gohtml"
)

type EmailService interface {
	Send(params SendEmailParams) error
}

type EmailMessageParams struct {
	Body    string
	From    *mail.Address
	Subject string
	To      []*mail.Address
}

type SendEmailParams struct {
	Subject      string
	Template     EmailTemplate
	TemplateData any
	To           *mail.Address
}

type EmailTemplate string

type InviteEmailTemplateParams struct {
	User *User
}

type PasswordRecoveryEmailTemplateParams struct {
	User *User
}

type WelcomeEmailTemplateParams struct {
	User *User
}

func EmailTemplates() []EmailTemplate {
	return []EmailTemplate{
		InvitationEmailTemplate,
		PasswordRecoveryEmailTemplate,
		WelcomeEmailTemplate,
	}
}
