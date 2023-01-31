package user

import (
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/dchest/uniuri"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/email"
	"github.com/poeticmetric/poeticmetric/backend/pkg/frontend"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
	"github.com/poeticmetric/poeticmetric/backend/pkg/worker"
)

type InvitePayload struct {
	Email *string `json:"email"`
	Name  *string `json:"name"`
}

func Invite(dp *depot.Depot, organizationId uint64, payload *InvitePayload) (*User, error) {
	err := validateInvitePayload(dp, payload)
	if err != nil {
		return nil, err
	}

	modelOrganization := &model.Organization{}
	modelUser := &model.User{
		ActivationToken: pointer.Get(uniuri.NewLen(24)),
		Email:           *payload.Email,
		Name:            *payload.Name,
		OrganizationId:  organizationId,
	}

	err = dp.Postgres().
		Model(&model.Organization{}).
		Select("name").
		Where("id = ?", organizationId).
		First(modelOrganization).
		Error
	if err != nil {
		return nil, err
	}

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		err2 := dp2.Postgres().
			Create(modelUser).
			Error
		if err2 != nil {
			return err2
		}

		err2 = worker.SendEmail(dp2, &worker.SendEmailPayload{
			From:     pointer.Get("support@poeticmetric.com"),
			Template: email.TemplateInvite,
			TemplateData: map[string]string{
				"ActivationUrl":    frontend.GenerateUrl(fmt.Sprintf("/activation?t=%s", *modelUser.ActivationToken)),
				"FrontendBaseUrl":  frontend.GenerateUrl(""),
				"OrganizationName": modelOrganization.Name,
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

	return Read(dp, modelUser.Id)
}

func validateInvitePayload(dp *depot.Depot, payload *InvitePayload) error {
	errs := v.Validate(v.Schema{
		v.F("email", payload.Email): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.Email(*t)
			}).Msg("Please provide a valid e-mail address."),

			v.Is(func(t *string) bool {
				return validator.NonDisposableEmail(dp, *t)
			}).Msg("https://www.youtube.com/watch?v=VN29X2HCKpU"),

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
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
