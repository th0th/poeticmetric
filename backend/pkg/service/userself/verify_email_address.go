package userself

import (
	v "github.com/RussellLuo/validating/v3"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/email"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/frontend"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
	"github.com/th0th/poeticmetric/backend/pkg/worker"
)

type VerifyEmailAddressPayload struct {
	EmailVerificationToken *string `json:"emailVerificationToken"`
}

func VerifyEmailAddress(dp *depot.Depot, payload *VerifyEmailAddressPayload) (*UserSelf, error) {
	err := validateVerifyEmailPayload(dp, payload)
	if err != nil {
		return nil, err
	}

	modelUser := &model.User{}

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		err2 := dp2.Postgres().
			Clauses(clause.Locking{Options: "NOWAIT", Strength: "UPDATE"}).
			Model(&model.User{}).
			Select("email", "id", "organization_id").
			Where("email_verification_token = ?", *payload.EmailVerificationToken).
			First(modelUser).
			Error
		if err2 != nil {
			return err2
		}

		err2 = dp2.Postgres().
			Model(&model.User{}).
			Select("email_verification_token", "is_email_verified").
			Where("email_verification_token = ?", *payload.EmailVerificationToken).
			Updates(&model.User{
				EmailVerificationToken: nil,
				IsEmailVerified:        true,
			}).
			Error
		if err2 != nil {
			return err2
		}

		if env.GetIsHosted() {
			err2 = dp2.Postgres().
				Model(&model.Organization{}).
				Where("id = ?", modelUser.OrganizationId).
				Updates(map[string]any{
					"is_on_trial":   true,
					"plan_id":       gorm.Expr("(select id from plans where name = 'Business')"),
					"trial_ends_at": gorm.Expr("(select current_date + interval '30 day')"),
				}).
				Error
			if err2 != nil {
				return err2
			}

			err2 = worker.SendEmail(dp2, &worker.SendEmailPayload{
				Template: email.TemplateTrialStart,
				TemplateData: map[string]string{
					"FrontendBaseUrl": frontend.GenerateUrl(""),
				},
				To: modelUser.Email,
			})
			if err2 != nil {
				return err2
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return Read(dp, modelUser.Id)
}

func validateVerifyEmailPayload(dp *depot.Depot, payload *VerifyEmailAddressPayload) error {
	errs := v.Validate(v.Schema{
		v.F("emailVerificationToken", payload.EmailVerificationToken): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.UserEmailVerificationToken(dp, *t)
			}).Msg("This e-mail verification token is not valid."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
