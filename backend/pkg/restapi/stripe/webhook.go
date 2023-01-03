package stripe

import (
	"encoding/json"
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/customer"
	webhook2 "github.com/stripe/stripe-go/v74/webhook"
	"gorm.io/gorm"
	"log"
	"strings"
)

func webhook(c *fiber.Ctx) error {
	dp := dm.Get(c)

	stripeEvent, err := webhook2.ConstructEvent(c.Body(), c.Get("Stripe-Signature"), env.Get(env.StripeWebhookSigningSecret))
	if err != nil {
		log.Println(err)

		return c.
			Status(fiber.StatusUnprocessableEntity).
			SendString("https://www.youtube.com/watch?v=VN29X2HCKpU")
	}

	if strings.HasPrefix(stripeEvent.Type, "customer.subscription") {
		stripeSubscription := &stripe.Subscription{}

		err = json.Unmarshal(stripeEvent.Data.Raw, stripeSubscription)
		if err != nil {
			return err
		}

		if stripeEvent.Type == "customer.subscription.created" || stripeEvent.Type == "customer.subscription.updated" {
			// There are two cases:
			// 1. This event can be for an existing customer. In this case, we will have a matching organization with the
			//	  stripe_customer_id in our database.
			// 2. This can be a new customer. If that is the case, we won't have a matching organization on our database. We
			//    need to create a new customer.

			modelPlan := &model.Plan{}
			modelOrganization := &model.Organization{}

			err = dp.Postgres().
				Model(&model.Plan{}).
				Select("id").
				Where("stripe_product_id = ?", stripeSubscription.Items.Data[0].Price.Product.ID).
				First(modelPlan).
				Error
			if err != nil {
				return err
			}

			err = dp.Postgres().
				Model(&model.Organization{}).
				Select("id").
				Where("stripe_customer_id = ?", stripeSubscription.Customer.ID).
				First(modelOrganization).
				Error
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					// we don't have a customer with this StripeCustomerId,
					// so we need to attach it the related organization
					var stripeCustomer *stripe.Customer

					stripeCustomer, err = customer.Get(stripeSubscription.Customer.ID, nil)
					if err != nil {
						return err
					}

					err = dp.Postgres().
						Model(&model.User{}).
						Joins("inner join organizations on organizations.id = users.organization_id").
						Select(
							"organizations.id",
						).
						Where("users.email = ?", stripeCustomer.Email).
						Where("users.is_organization_owner = ?", true).
						First(modelOrganization).
						Error
					if err != nil {
						return err
					}
				} else {
					return err
				}
			}

			err = dp.Postgres().
				Select(
					"is_on_trial",
					"plan_id",
					"stripe_customer_id",
					"subscription_period",
				).
				Where("id = ?", modelOrganization.Id).
				Updates(&model.Organization{
					IsOnTrial:          false,
					PlanId:             &modelPlan.Id,
					StripeCustomerId:   &stripeSubscription.Customer.ID,
					SubscriptionPeriod: pointer.Get(model.OrganizationSubscriptionPeriod(strings.ToUpper(string(stripeSubscription.Items.Data[0].Plan.Interval)))),
				}).
				Error
			if err != nil {
				return err
			}
		}

		if stripeEvent.Type == "customer.subscription.deleted" {
			err = dp.Postgres().
				Model(&model.Organization{}).
				Select(
					"plan_id",
					"subscription_period",
				).
				Where("stripe_customer_id = ?", stripeSubscription.Customer.ID).
				Updates(&model.Organization{
					PlanId:             nil,
					SubscriptionPeriod: nil,
				}).
				Error
			if err != nil {
				return err
			}
		}
	}

	return c.JSON(nil)
}
