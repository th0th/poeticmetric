package organization

import (
	"fmt"
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/frontend"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"
	"github.com/stripe/stripe-go/v74/price"
	"github.com/stripe/stripe-go/v74/product"
	"strings"
)

type CreateStripeCheckoutSessionData struct {
	OrganizationPlanId           *uint64
	OrganizationStripeCustomerId *string
	UserEmail                    string
}

type CreateStripeCheckoutSessionPayload struct {
	PlanName           *string `json:"planName"`
	SubscriptionPeriod *string `json:"subscriptionPeriod"`
}

func CreateStripeCheckoutSession(dp *depot.Depot, id uint64, payload *CreateStripeCheckoutSessionPayload) (*stripe.CheckoutSession, error) {
	data := &CreateStripeCheckoutSessionData{}

	err := dp.Postgres().
		Model(&model.User{}).
		Joins("inner join organizations on organizations.id = users.organization_id").
		Select(
			"organizations.plan_id as organization_plan_id",
			"organizations.stripe_customer_id as organization_stripe_customer_id",
			"users.email as user_email",
		).
		Where("users.organization_id = ?", id).
		Where("users.is_organization_owner = ?", true).
		First(data).
		Error
	if err != nil {
		return nil, err
	}

	err = validateCreateStripeCheckoutSessionPayload(dp, payload, data)
	if err != nil {
		return nil, err
	}

	modelPlan := &model.Plan{}

	err = dp.Postgres().
		Model(&model.Plan{}).
		Where("name = ?", payload.PlanName).
		First(modelPlan).
		Error
	if err != nil {
		return nil, err
	}

	stripeProduct, err := product.Get(*modelPlan.StripeProductId, nil)
	if err != nil {
		return nil, err
	}

	stripePrices := price.List(&stripe.PriceListParams{
		Active: pointer.Get(true),
		ListParams: stripe.ListParams{
			Limit: pointer.Get(int64(1)),
		},
		Product: &stripeProduct.ID,
		Recurring: &stripe.PriceListRecurringParams{
			Interval: pointer.Get(strings.ToLower(*payload.SubscriptionPeriod)),
		},
	})

	stripeCheckoutSessionParams := &stripe.CheckoutSessionParams{
		AutomaticTax:        &stripe.CheckoutSessionAutomaticTaxParams{Enabled: pointer.Get(true)},
		CancelURL:           pointer.Get(frontend.GenerateUrl("/billing")),
		Customer:            data.OrganizationStripeCustomerId,
		LineItems: []*stripe.CheckoutSessionLineItemParams{{
			Price:    &stripePrices.PriceList().Data[0].ID,
			Quantity: pointer.Get(int64(1)),
		}},
		Mode:               pointer.Get(string(stripe.CheckoutSessionModeSubscription)),
		SuccessURL:         pointer.Get(frontend.GenerateUrl("/billing")),
	}

	if data.OrganizationStripeCustomerId == nil {
		stripeCheckoutSessionParams.CustomerEmail = pointer.Get(data.UserEmail)
	}

	stripeCheckoutSession, err := session.New(stripeCheckoutSessionParams)
	if err != nil {
		return nil, err
	}

	return stripeCheckoutSession, nil
}

func validateCreateStripeCheckoutSessionPayload(dp *depot.Depot, payload *CreateStripeCheckoutSessionPayload, data *CreateStripeCheckoutSessionData) error {
	subscriptionPeriods := []string{
		string(model.OrganizationSubscriptionPeriodMonth),
		string(model.OrganizationSubscriptionPeriodYear),
	}

	subscriptionPeriodsMap := map[string]bool{}
	for i := range subscriptionPeriods {
		subscriptionPeriodsMap[subscriptionPeriods[i]] = true
	}

	errs := v.Validate(v.Schema{
		v.F("detail", payload): v.Is(func(t any) bool {
			return data.OrganizationPlanId == nil || data.OrganizationStripeCustomerId == nil
		}).Msg("You need to use billing portal to change plan."),

		v.F("planName", payload.PlanName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.PlanName(dp, *t)
			}).Msg("Please select a valid plan."),
		),

		v.F("subscriptionPeriod", payload.SubscriptionPeriod): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return subscriptionPeriodsMap[*t]
			}).Msg(fmt.Sprintf("This field should be one of these: %s", strings.Join(subscriptionPeriods, ", "))),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
