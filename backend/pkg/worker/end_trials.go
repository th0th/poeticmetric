package worker

import (
	"github.com/getsentry/sentry-go"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/th0th/poeticmetric/backend/pkg/email"
	"github.com/th0th/poeticmetric/backend/pkg/frontend"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

const EndTrialsQueue rabbitmq.QueueName = "endTrials"

func EndTrials(dp *depot.Depot) error {
	return publish(dp, EndTrialsQueue, nil)
}

func endTrials(dp *depot.Depot, _ []byte) error {
	organizationIds := []uint64{}

	query := dp.Postgres().
		Model(&model.Organization{}).
		Where("is_on_trial is true").
		Where("trial_ends_at <= current_date")

	err := query.
		Session(&gorm.Session{}).
		Pluck("id", &organizationIds).
		Error
	if err != nil {
		return err
	}

	err = query.
		Session(&gorm.Session{}).
		Select("is_on_trial", "plan_id").
		Updates(&model.Organization{
			IsOnTrial: false,
			PlanId:    nil,
		}).
		Error
	if err != nil {
		return err
	}

	emails := []string{}

	err = dp.Postgres().
		Model(&model.User{}).
		Where("organization_id in ?", organizationIds).
		Where("is_organization_owner is true").
		Pluck("email", &emails).
		Error
	if err != nil {
		return err
	}

	for _, e := range emails {
		err = SendEmail(dp, &SendEmailPayload{
			Template: email.TemplateTrialEnd,
			TemplateData: map[string]string{
				"FrontendBaseUrl": frontend.GenerateUrl(""),
			},
			To: e,
		})
		if err != nil {
			sentry.CaptureException(err)
		}
	}

	return nil
}
