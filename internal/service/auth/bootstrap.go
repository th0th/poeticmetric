package auth

import (
	"context"
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"
	"gorm.io/gorm"

	context2 "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
	"github.com/th0th/poeticmetric/internal/pointer"
	"github.com/th0th/poeticmetric/internal/validator"
)

type BootstrapData struct {
	OrganizationName     string
	ShouldCreateDemoSite bool
	UserEmail            string
	UserName             string
	UserNewPassword      string
	UserNewPassword2     string
}

func Bootstrap(ctx context.Context, data *BootstrapData) (*model.UserSessionToken, error) {
	err := validateBootstrapData(ctx, data)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	plans := []model.Plan{
		{
			MaxEventsPerMonth: pointer.Get(uint(100000)),
			MaxUsers:          pointer.Get(uint(1)),
			Name:              "Basic",
			StripeProductId:   pointer.Get("prod_KXK6a9Zmy3qcLz"),
		},
		{
			MaxEventsPerMonth: pointer.Get(uint(1000000)),
			MaxUsers:          pointer.Get(uint(3)),
			Name:              "Pro",
			StripeProductId:   pointer.Get("prod_KXK7HFnQGBmP6D"),
		},
		{
			MaxEventsPerMonth: pointer.Get(uint(5000000)),
			MaxUsers:          pointer.Get(uint(50)),
			Name:              "Business",
			StripeProductId:   pointer.Get("prod_KXK83fu8EQrKfM"),
		},
	}

	organization := model.Organization{
		IsOnTrial: false,
		Name:      data.OrganizationName,
		PlanId:    &plans[len(plans)-1].Id,
	}

	user := model.User{
		Email:               data.UserEmail,
		IsActive:            true,
		IsEmailVerified:     true,
		IsOrganizationOwner: true,
		Name:                data.UserName,
	}

	err = user.SetPassword(data.UserNewPassword)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	userSessionToken := model.UserSessionToken{}

	userSessionToken.SetToken()

	err = context2.PgTransaction(ctx, func(pg *gorm.DB) error {
		err = pg.Create(&plans).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		err = pg.Create(&organization).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		user.OrganizationId = organization.Id

		err = pg.Create(&user).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		userSessionToken.UserId = user.Id

		err = pg.Create(&userSessionToken).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &userSessionToken, nil
}

func validateBootstrapData(ctx context.Context, data *BootstrapData) error {
	errs := v.Validate(v.Schema{
		v.F("OrganizationName", data.OrganizationName): v.All(
			v.Nonzero[string]().Msg("This field is required."),

			v.LenString(model.OrganizationNameMinLength, model.OrganizationNameMaxLength).
				Msg(
					fmt.Sprintf(
						"This field should be between %d and %d characters in length.",
						model.OrganizationNameMinLength,
						model.OrganizationNameMaxLength,
					),
				),
		),

		v.F("UserEmail", data.UserEmail): v.All(
			v.Nonzero[string]().Msg("This field is required."),

			v.Is[string](validator.Email).Msg("Please provide a valid e-mail address."),
		),
	})

	if len(errs) > 0 {
		return errors.Wrap(errs, 0)
	}

	return nil
}
