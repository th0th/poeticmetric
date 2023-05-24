package userself

import (
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/dchest/uniuri"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/email"
	"github.com/th0th/poeticmetric/backend/pkg/frontend"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
	"github.com/th0th/poeticmetric/backend/pkg/worker"
)

type RecoverPasswordPayload struct {
	Email *string `json:"email"`
}

func RecoverPassword(dp *depot.Depot, payload *RecoverPasswordPayload) error {
	err := validateRecoverPasswordPayload(dp, payload)
	if err != nil {
		return err
	}

	modelUser := &model.User{}
	passwordResetToken := uniuri.NewLen(36)

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		err2 := dp2.Postgres().
			Model(&model.User{}).
			Where("email = ?", *payload.Email).
			Update("password_reset_token", passwordResetToken).
			Updates(modelUser).
			Error
		if err2 != nil {
			return err2
		}

		err2 = worker.SendEmail(dp2, &worker.SendEmailPayload{
			Template: email.TemplatePasswordRecovery,
			TemplateData: map[string]string{
				"FrontendBaseUrl":  frontend.GenerateUrl(""),
				"PasswordResetUrl": frontend.GenerateUrl(fmt.Sprintf("/password-reset?t=%s", passwordResetToken)),
			},
			To: *payload.Email,
		})
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return err
	}

	return nil
}

func validateRecoverPasswordPayload(dp *depot.Depot, payload *RecoverPasswordPayload) error {
	errs := v.Validate(v.Schema{
		v.F("email", payload.Email): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.UserEmail(dp, *t)
			}).Msg("There is no user associated with this e-mail address."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
