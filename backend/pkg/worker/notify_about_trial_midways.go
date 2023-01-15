package worker

import (
	"github.com/getsentry/sentry-go"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/poeticmetric/poeticmetric/backend/pkg/email"
	"github.com/poeticmetric/poeticmetric/backend/pkg/frontend"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
)

const NotifyAboutTrialMidwaysQueue rabbitmq.QueueName = "notifyAboutTrialMidways"

func NotifyAboutTrialMidways(dp *depot.Depot) error {
	return publish(dp, NotifyAboutTrialMidwaysQueue, nil)
}

func notifyAboutTrialMidways(dp *depot.Depot, _ []byte) error {
	emails := []string{}

	err := dp.Postgres().
		Model(&model.User{}).
		Joins("inner join organizations on organizations.id = users.organization_id").
		Where("organizations.is_on_trial is true").
		Where("organizations.trial_ends_at = current_date + interval '16 day'").
		Where("users.is_organization_owner is true").
		Pluck("users.email", &emails).
		Error
	if err != nil {
		return err
	}

	for _, e := range emails {
		err = SendEmail(dp, &SendEmailPayload{
			From:     pointer.Get("support@poeticmetric.com"),
			Template: email.TemplateTrialMidway,
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
