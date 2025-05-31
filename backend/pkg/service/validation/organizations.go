package validation

import (
	"context"
	"fmt"
	"slices"
	"strings"

	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ChangePlanRequest(ctx context.Context, request *poeticmetric.ChangePlanRequest) error {
	validationErrs := v.Validate(v.Schema{
		v.F("maxEventsPerMonth", request.MaxEventsPerMonth): v.Any(
			v.Is(func(x *string) bool {
				defaultPlanName := s.envService.DefaultPlanName()

				return defaultPlanName != nil && request.PlanName != nil && *request.PlanName == *defaultPlanName
			}),

			v.All(
				v.Nonzero[*int]().Msg("This field is required."),

				v.Nested(func(x *int) v.Validator {
					return v.Value(*x, v.In(poeticmetric.PlanMaxEventsPerMonthChoices()...).Msg(
						fmt.Sprintf(
							"Please select one of the options: %s.",
							strings.Join(poeticmetric.StringSlice(poeticmetric.PlanMaxEventsPerMonthChoices()), ", "),
						),
					))
				}),
			),
		),

		v.F("planName", request.PlanName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, s.planName(ctx).Msg("Please select a valid plan."))
			}),
		),

		v.F("subscriptionPeriod", request.SubscriptionPeriod): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(
					*x,
					v.In(
						poeticmetric.OrganizationSubscriptionPeriodMonth,
						poeticmetric.OrganizationSubscriptionPeriodYear,
					).Msg(fmt.Sprintf(
						"Please select one of the options: %s, %s.",
						poeticmetric.OrganizationSubscriptionPeriodMonth,
						poeticmetric.OrganizationSubscriptionPeriodYear,
					)),
				)
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}

func (s *service) DeleteOrganizationRequest(ctx context.Context, request *poeticmetric.OrganizationDeletionRequest) error {
	reasons := []*poeticmetric.OrganizationDeletionReason{}
	postgres := poeticmetric.ServicePostgres(ctx, s)
	err := postgres.Find(&reasons).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}
	reasonStrings := make([]string, len(reasons))
	for i := range reasons {
		reasonStrings[i] = reasons[i].Reason
	}

	validationErrs := v.Validate(v.Schema{
		v.F("detail", request.Detail): v.Any(
			v.Is(func(_ *string) bool {
				return request.Reason == nil
			}),

			v.Is(func(x *string) bool {
				reasonIndex := slices.IndexFunc(reasons, func(reason *poeticmetric.OrganizationDeletionReason) bool {
					return reason.Reason == *request.Reason
				})

				return reasonIndex < 0 || reasons[reasonIndex].DetailTitle == nil
			}),

			v.All(
				v.Nonzero[*string]().Msg("This field is required."),

				v.Nested(func(x *string) v.Validator {
					return v.Value(*x, v.
						LenString(poeticmetric.OrganizationDeletionDetailMinLength, poeticmetric.OrganizationDeletionDetailMaxLength).
						Msg(fmt.Sprintf(
							"This field should be between %d and %d characters in length.",
							poeticmetric.OrganizationDeletionDetailMinLength,
							poeticmetric.OrganizationDeletionDetailMaxLength,
						)),
					)
				}),
			),
		),

		v.F("reason", request.Reason): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.In(reasonStrings...).Msg("Please select one of the options."))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}

func (s *service) UpdateOrganizationRequest(ctx context.Context, request *poeticmetric.UpdateOrganizationRequest) error {
	validationErrs := v.Validate(v.Schema{
		v.F("name", request.Name): v.Any(
			v.Zero[*string](),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.OrganizationNameMinLength, poeticmetric.OrganizationNameMaxLength).Msg(fmt.Sprintf(
					"This field should be between %d and %d characters in length.",
					poeticmetric.OrganizationNameMinLength,
					poeticmetric.OrganizationNameMaxLength,
				)))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}
