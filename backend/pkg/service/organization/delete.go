package organization

import (
	"fmt"
	"log"
	"strings"
	"time"

	v "github.com/RussellLuo/validating/v3"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/worker"
)

type DeletionPayload struct {
	Details *string `json:"details"`
	Reason  *string `json:"reason"`
}

func Delete(dp *depot.Depot, id uint64, payload *DeletionPayload) error {
	dateTime := time.Now()

	err := validateDeletionPayload(payload)
	if err != nil {
		return err
	}

	var organizationDeletion *model.OrganizationDeletion

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		result := &struct {
			OrganizationCreatedAt        time.Time
			OrganizationId               uint64
			OrganizationName             string
			OrganizationStripeCustomerId *string
			PlanName                     string
			UserId                       uint64
			UserEmail                    string
			UserName                     string
		}{
			OrganizationId: id,
		}

		err = dp2.Postgres().
			Select(
				"organizations.created_at as organization_created_at",
				"organizations.id as organization_id",
				"organizations.name as organization_name",
				"organizations.stripe_customer_id as organization_stripe_customer_id",
				"plans.name as plan_name",
				"users.id as user_id",
				"users.email as user_email",
				"users.name as user_name",
			).
			Model(&model.User{}).
			Joins("inner join organizations on organizations.id = ?", id).
			Joins("inner join plans on plans.id = organizations.plan_id").
			Where("users.organization_id = ?", id).
			Where("users.is_organization_owner = ?", true).
			First(result).
			Error
		if err != nil {
			return err
		}

		organizationDeletion = &model.OrganizationDeletion{
			DateTime:                     dateTime,
			Details:                      payload.Details,
			OrganizationCreatedAt:        result.OrganizationCreatedAt,
			OrganizationId:               result.OrganizationId,
			OrganizationName:             result.OrganizationName,
			OrganizationPlanName:         result.PlanName,
			OrganizationStripeCustomerId: result.OrganizationStripeCustomerId,
			Reason:                       *payload.Reason,
			UserEmail:                    result.UserEmail,
			UserId:                       result.UserId,
			UserName:                     result.UserName,
		}

		err = dp2.Postgres().
			Create(organizationDeletion).
			Error
		if err != nil {
			return err
		}

		err = dp2.Postgres().
			Model(&model.Organization{}).
			Where("organizations.id = ?", id).
			Joins("inner join plans on plans.id = organizations.plan_id").
			Select(strings.Join([]string{
				"organizations.created_at as organization_created_at",
				"organizations.name as organization_name",
				"organizations.stripe_customer_id as organization_stripe_customer_id",
				"plans.name as plan_name",
			}, ", ")).
			First(result).
			Error
		if err != nil {
			return err
		}

		siteIds := []uint64{}

		err = dp2.Postgres().
			Model(&model.Site{}).
			Where("organization_id = ?", id).
			Pluck("id", &siteIds).
			Error
		if err != nil {
			return err
		}

		err = dp2.Postgres().
			Where("id = ?", id).
			Delete(&model.Organization{}).
			Error
		if err != nil {
			return err
		}

		err = dp2.ClickHouse().
			Exec("optimize table events_buffer").
			Error
		if err != nil {
			panic(err)
		}

		err = dp2.ClickHouse().
			Exec("alter table events delete where site_id in ?", siteIds).
			Error
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return err
	}

	err = worker.SendWebhook(dp, &worker.SendWebhookPayload{
		Event: worker.SendWebhookEventOrganizationDeleted,
		Data:  *organizationDeletion,
	})
	if err != nil {
		log.Print(err)
	}

	return nil
}

func validateDeletionPayload(payload *DeletionPayload) error {
	errs := v.Validate(v.Schema{
		v.F("details", payload.Details): v.Any(
			v.Zero[*string](),

			v.Is(func(t *string) bool {
				return len(*t) >= model.OrganizationDeletionDetailsMinLength && len(*t) <= model.OrganizationDeletionDetailsMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.OrganizationDeletionDetailsMinLength,
				model.OrganizationDeletionDetailsMaxLength,
			)),
		),

		v.F("reason", payload.Reason): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return len(*t) >= model.OrganizationDeletionReasonMinLength && len(*t) <= model.OrganizationDeletionReasonMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.OrganizationDeletionReasonMinLength,
				model.OrganizationDeletionReasonMaxLength,
			)),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
