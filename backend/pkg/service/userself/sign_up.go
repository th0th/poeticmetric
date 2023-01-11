package userself

import (
	"fmt"
	v "github.com/RussellLuo/validating/v3"
	"github.com/dchest/uniuri"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/email"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/frontend"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/userpassword"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
	"github.com/poeticmetric/poeticmetric/backend/pkg/worker"
)

type SignUpPayload struct {
	Email            *string `json:"email"`
	Name             *string `json:"name"`
	OrganizationName *string `json:"organizationName"`
	Password         *string `json:"password"`
}

func SignUp(dp *depot.Depot, payload *SignUpPayload) (*UserSelf, error) {
	err := validateSignUpPayload(dp, payload)
	if err != nil {
		return nil, err
	}

	passwordHash, err := userpassword.GetHash(*payload.Password)
	if err != nil {
		return nil, err
	}

	userSelf := &UserSelf{}

	modelUser := &model.User{
		Email:                  *payload.Email,
		EmailVerificationToken: pointer.Get(uniuri.NewLen(24)),
		IsOrganizationOwner:    true,
		Name:                   *payload.Name,
		Password:               *passwordHash,
	}

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		modelOrganization := &model.Organization{
			Name: *payload.OrganizationName,
		}

		err2 := dp2.Postgres().
			Create(modelOrganization).
			Error
		if err2 != nil {
			return err2
		}

		modelUser.OrganizationId = modelOrganization.Id

		err2 = dp2.Postgres().
			Create(modelUser).
			Error
		if err2 != nil {
			return err2
		}

		err2 = worker.SendEmail(dp2, &worker.SendEmailPayload{
			From:     pointer.Get("support@poeticmetric.com"),
			Template: email.TemplateWelcome,
			TemplateData: map[string]string{
				"FrontEndBaseUrl":      env.Get(env.FrontendBaseUrl),
				"EmailVerificationUrl": frontend.GenerateUrl(fmt.Sprintf("email-address-verification/?t=%s", *modelUser.EmailVerificationToken)),
			},
			To: modelUser.Email,
		})
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	userSelf, err = Read(dp, modelUser.Id)
	if err != nil {
		return nil, err
	}

	return userSelf, nil
}

func validateSignUpPayload(dp *depot.Depot, payload *SignUpPayload) error {
	errs := v.Validate(v.Schema{
		v.F("email", payload.Email): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.Email(*t)
			}).Msg("Please provide a valid e-mail address."),

			v.Is(func(t *string) bool {
				return validator.NonDisposableEmail(dp, *t)
			}).Msg("https://www.youtube.com/watch?v=Vqpzk-qGxMU&t=25s"),

			v.Is(func(t *string) bool {
				return validator.UserUniqueEmail(dp, *t)
			}).Msg("This e-mail address is already in use."),
		),

		v.F("name", payload.Name): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return len(*t) >= model.UserNameMinLength && len(*t) <= model.UserNameMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.UserNameMinLength,
				model.UserNameMaxLength,
			)),
		),

		v.F("organizationName", payload.OrganizationName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return len(*t) >= model.OrganizationNameMinLength && len(*t) <= model.OrganizationNameMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.OrganizationNameMinLength,
				model.OrganizationNameMaxLength,
			)),
		),

		v.F("password", payload.Password): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return len(*t) >= model.UserPasswordMinLength && len(*t) <= model.UserPasswordMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.UserPasswordMinLength,
				model.UserPasswordMaxLength,
			)),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
