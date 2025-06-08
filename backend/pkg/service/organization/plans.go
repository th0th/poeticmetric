package organization

import (
	"context"
	_ "embed"
	"fmt"
	"net/mail"

	"github.com/go-errors/errors"
	"github.com/stripe/stripe-go/v82"
	billingportalsession "github.com/stripe/stripe-go/v82/billingportal/session"
	checkoutsession "github.com/stripe/stripe-go/v82/checkout/session"
	"github.com/stripe/stripe-go/v82/price"
	"github.com/stripe/stripe-go/v82/subscription"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) CreateStripeBillingPortalSession(ctx context.Context, organizationID uint) (*poeticmetric.CreateStripeBillingPortalSessionResponse, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.Organization{}
	err := postgres.Select("StripeCustomerID").First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	stripeBillingPortalSession, err := billingportalsession.New(&stripe.BillingPortalSessionParams{
		Customer:  organization.StripeCustomerID,
		ReturnURL: poeticmetric.Pointer(s.envService.FrontendURL("/billing")),
	})
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	response := poeticmetric.CreateStripeBillingPortalSessionResponse{
		RedirectUrl: stripeBillingPortalSession.URL,
	}

	return &response, nil
}

func (s *service) ChangePlan(ctx context.Context, organizationID uint, request *poeticmetric.ChangePlanRequest) (*poeticmetric.ChangePlanResponse, error) {
	err := s.validationService.ChangePlanRequest(ctx, request)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	response := poeticmetric.ChangePlanResponse{}

	user := poeticmetric.User{}
	err = postgres.
		Joins("Organization").
		Joins("Organization.Plan").
		First(&user, poeticmetric.User{IsOrganizationOwner: true, OrganizationID: organizationID}, "IsOrganizationOwner", "OrganizationID").
		Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	plan := poeticmetric.Plan{}
	err = postgres.Select("ID", "Name").First(&plan, poeticmetric.Plan{Name: *request.PlanName}, "Name").Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}
	defaultPlanName := s.envService.DefaultPlanName()
	isPlanFree := defaultPlanName != nil && plan.Name == *defaultPlanName

	var stripePrice *stripe.Price
	var stripeSubscription *stripe.Subscription

	if !isPlanFree {
		stripePrice, err = s.stripePrice(ctx, plan.Name, *request.MaxEventsPerMonth, *request.SubscriptionPeriod)
		if err != nil {
			return nil, errors.Wrap(err, 0)
		}
	}

	if user.Organization.StripeCustomerID != nil {
		stripeSubscription, err = s.organizationStripeSubscription(ctx, *user.Organization.StripeCustomerID)
		if err != nil {
			return nil, errors.Wrap(err, 0)
		}
	}

	if stripeSubscription == nil {
		if stripePrice != nil {
			stripeCheckoutSessionParams := stripe.CheckoutSessionParams{
				AllowPromotionCodes: poeticmetric.Pointer(s.envService.StripeAllowPromotionCodes()),
				CancelURL:           poeticmetric.Pointer(s.envService.FrontendURL("/billing")),
				Customer:            user.Organization.StripeCustomerID,
				LineItems: []*stripe.CheckoutSessionLineItemParams{{
					Price:    &stripePrice.ID,
					Quantity: poeticmetric.Pointer(int64(1)),
				}},
				Mode: poeticmetric.Pointer(string(stripe.CheckoutSessionModeSubscription)),
				SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
					Metadata: map[string]string{
						"environment": s.envService.StripeMetaEnvironment(),
					},
				},
				SuccessURL: poeticmetric.Pointer(s.envService.FrontendURL(fmt.Sprintf(
					"/billing?plan=%s",
					*request.PlanName,
				))),
			}

			if user.Organization.StripeCustomerID == nil {
				stripeCheckoutSessionParams.CustomerEmail = &user.Email
			}

			stripeCheckoutSession, err2 := checkoutsession.New(&stripeCheckoutSessionParams)
			if err2 != nil {
				return nil, errors.Wrap(err2, 0)
			}

			response.RedirectUrl = stripeCheckoutSession.URL
		} else {
			organization := poeticmetric.Organization{}
			err = postgres.Select("ID").First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
			if err != nil {
				return nil, errors.Wrap(err, 0)
			}

			err = postgres.
				Model(&organization).
				Select("IsOnTrial", "PlanID").
				UpdateColumns(poeticmetric.Organization{PlanID: plan.ID}).
				Error
			if err != nil {
				return nil, errors.Wrap(err, 0)
			}
		}
	} else {
		// organization has a subscription
		stripeBillingPortalSessionParams := stripe.BillingPortalSessionParams{
			Customer:  user.Organization.StripeCustomerID,
			ReturnURL: poeticmetric.Pointer(s.envService.FrontendURL("/billing")),
		}

		if user.Organization.SubscriptionCancelAtPeriodEnd == nil ||
			!*user.Organization.SubscriptionCancelAtPeriodEnd ||
			user.Organization.Plan.Name != plan.Name {
			stripeBillingPortalSessionParams.FlowData = &stripe.BillingPortalSessionFlowDataParams{
				AfterCompletion: &stripe.BillingPortalSessionFlowDataAfterCompletionParams{
					Redirect: &stripe.BillingPortalSessionFlowDataAfterCompletionRedirectParams{
						ReturnURL: poeticmetric.Pointer(s.envService.FrontendURL("/billing")),
					},
					Type: poeticmetric.Pointer(string(stripe.BillingPortalSessionFlowAfterCompletionTypeRedirect)),
				},
			}

			if isPlanFree {
				stripeBillingPortalSessionParams.FlowData.SubscriptionCancel = &stripe.BillingPortalSessionFlowDataSubscriptionCancelParams{
					Subscription: &stripeSubscription.ID,
				}
				stripeBillingPortalSessionParams.FlowData.Type = poeticmetric.Pointer(string(stripe.BillingPortalSessionFlowTypeSubscriptionCancel))
			} else {
				stripeBillingPortalSessionParams.FlowData.SubscriptionUpdateConfirm =
					&stripe.BillingPortalSessionFlowDataSubscriptionUpdateConfirmParams{
						Items: []*stripe.BillingPortalSessionFlowDataSubscriptionUpdateConfirmItemParams{{
							ID:    &stripeSubscription.Items.Data[0].ID,
							Price: &stripePrice.ID,
						}},
						Subscription: &stripeSubscription.ID,
					}

				stripeBillingPortalSessionParams.FlowData.Type = poeticmetric.Pointer(
					string(stripe.BillingPortalSessionFlowTypeSubscriptionUpdateConfirm),
				)
			}
		}

		stripeBillingPortalSession, err2 := billingportalsession.New(&stripeBillingPortalSessionParams)
		if err2 != nil {
			return nil, errors.Wrap(err2, 0)
		}

		response.RedirectUrl = stripeBillingPortalSession.URL
	}

	// TODO: apply plan limits

	return &response, nil
}

func (s *service) ReadOrganizationUsage(ctx context.Context, organizationID uint) (*poeticmetric.OrganizationUsageResponse, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	response := poeticmetric.OrganizationUsageResponse{}
	err := postgres.Raw(readOrganizationPlanLimitsQuery, map[string]any{
		"organizationID": organizationID,
	}).First(&response).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	// sites
	var siteCount int64
	err = postgres.
		Model(&poeticmetric.Site{}).
		Where(poeticmetric.Site{OrganizationID: organizationID}, "OrganizationID").
		Count(&siteCount).
		Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	// users
	var userCount int64
	err = postgres.
		Model(&poeticmetric.User{}).
		Where(poeticmetric.User{OrganizationID: organizationID}, "OrganizationID").
		Count(&userCount).
		Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	response.SiteCount = int(siteCount)
	response.UserCount = int(userCount)

	return &response, nil
}

func (s *service) ReadPlan(ctx context.Context, planID uint) (*poeticmetric.PlanResponse, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	response := poeticmetric.PlanResponse{}
	err := postgres.First(&response, poeticmetric.Plan{ID: planID}).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &response, nil
}

func (s *service) UpdateOrganizationSubscription(ctx context.Context, request *poeticmetric.UpdateOrganizationSubscriptionRequest) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)
	shouldSendSubscriptionStartNotification := false

	stripeSubscription, err := subscription.Get(*request.StripeSubscriptionID, &stripe.SubscriptionParams{
		Expand: []*string{
			poeticmetric.Pointer("customer"),
			poeticmetric.Pointer("items.data.plan.product"),
		},
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	user := poeticmetric.User{}
	organization := poeticmetric.Organization{}
	organizationUpdate := poeticmetric.Organization{}
	organizationUpdateFields := []string{}
	err = postgres.
		Select("ID").
		First(&organization, poeticmetric.Organization{StripeCustomerID: &stripeSubscription.Customer.ID}, "StripeCustomerID").
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err2 := postgres.
				Select("Email", "Name", "OrganizationID").
				First(&user, poeticmetric.User{Email: stripeSubscription.Customer.Email, IsOrganizationOwner: true}).
				Error
			if err2 != nil {
				return errors.Wrap(errors.Join(errors.Wrap(err, 0), errors.Wrap(err2, 0)), 0)
			}

			err2 = postgres.First(&organization, poeticmetric.Organization{ID: user.OrganizationID}, "ID").Error
			if err2 != nil {
				return errors.Wrap(errors.Join(errors.Wrap(err, 0), errors.Wrap(err2, 0)), 0)
			}

			if stripeSubscription.Status != stripe.SubscriptionStatusCanceled {
				shouldSendSubscriptionStartNotification = true
			}
		} else {
			return errors.Wrap(err, 0)
		}

		organizationUpdate.StripeCustomerID = &stripeSubscription.Customer.ID
		organizationUpdateFields = append(organizationUpdateFields, "StripeCustomerID")
	}

	planWhere := poeticmetric.Plan{}
	planWhereFields := []string{}

	if stripeSubscription.Status == stripe.SubscriptionStatusCanceled {
		planWhere.Name = *s.envService.DefaultPlanName()
	} else {
		subscriptionPeriod, err2 := poeticmetric.StripeIntervalOrganizationSubscriptionPeriod(stripeSubscription.Items.Data[0].Plan.Interval)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		organizationUpdate.SubscriptionPeriod = &subscriptionPeriod
		organizationUpdate.SubscriptionCancelAtPeriodEnd = poeticmetric.Pointer(stripeSubscription.CancelAtPeriodEnd)

		planWhere.Name = stripeSubscription.Items.Data[0].Plan.Product.Name

		planMaxEventsPerMonth, err2 := poeticmetric.StripePriceLookupKeyPlanMaxEventsPerMonth(stripeSubscription.Items.Data[0].Price.LookupKey)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}
		planWhere.MaxEventsPerMonth = &planMaxEventsPerMonth
		planWhereFields = append(planWhereFields, "MaxEventsPerMonth")
	}
	organizationUpdateFields = append(organizationUpdateFields, "SubscriptionPeriod", "SubscriptionCancelAtPeriodEnd")
	planWhereFields = append(planWhereFields, "Name")

	plan := poeticmetric.Plan{}
	err = postgres.Select("ID").First(&plan, planWhere, planWhereFields).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	organizationUpdate.PlanID = plan.ID
	organizationUpdateFields = append(organizationUpdateFields, "IsOnTrial", "PlanID")

	err = poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx context.Context) error {
		err2 := postgres.Model(&organization).Select(organizationUpdateFields).UpdateColumns(organizationUpdate).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		if shouldSendSubscriptionStartNotification {
			err2 = s.emailService.Send(poeticmetric.SendEmailParams{
				Subject:  "Your PoeticMetric subscription is activated. Welcome on board!",
				Template: poeticmetric.SubscriptionStartEmailTemplate,
				To:       &mail.Address{Address: user.Email, Name: user.Name},
			})
			if err2 != nil {
				return errors.Wrap(err2, 0)
			}
		}

		return nil
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) stripePrice(ctx context.Context, planName string, maxEventsPerMonth int, subscriptionPeriod string) (*stripe.Price, error) {
	lookupKey := poeticmetric.PlanStripePriceLookupKey(planName, maxEventsPerMonth, subscriptionPeriod)

	var stripePrice *stripe.Price
	priceIter := price.List(&stripe.PriceListParams{
		LookupKeys: []*string{&lookupKey},
		Active:     poeticmetric.Pointer(true),
		ListParams: stripe.ListParams{
			Limit: poeticmetric.Pointer(int64(1)),
		},
	})
	if priceIter.Next() {
		stripePrice = priceIter.Price()
	} else {
		return nil, errors.Wrap(poeticmetric.ErrNotFound, 0)
	}

	return stripePrice, nil
}

func (s *service) organizationStripeSubscription(ctx context.Context, stripeCustomerID string) (*stripe.Subscription, error) {
	var stripeSubscription *stripe.Subscription
	subscriptionIter := subscription.List(&stripe.SubscriptionListParams{Customer: &stripeCustomerID})
	if subscriptionIter.Next() {
		stripeSubscription = subscriptionIter.Subscription()
	}

	return stripeSubscription, nil
}

//go:embed files/organization_plan_limits.sql
var readOrganizationPlanLimitsQuery string
