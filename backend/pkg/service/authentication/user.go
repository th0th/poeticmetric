package authentication

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ActivateUser(ctx context.Context, params *poeticmetric.ActivateUserParams) error {
	err := s.validationService.ActivateUserParams(ctx, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{}
	err = postgres.
		Model(&poeticmetric.User{}).
		Select("ID").
		First(&user, poeticmetric.User{ActivationToken: params.ActivationToken}, "ActivationToken").
		Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	user.IsActive = true
	user.IsEmailVerified = true
	user.Name = *params.Name
	err = user.SetPassword(*params.NewPassword)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = postgres.Model(&user).Select("ActivationToken", "IsActive", "IsEmailVerified", "Name", "Password").Updates(user).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) SignUp(ctx context.Context, params *poeticmetric.SignUpParams) (*poeticmetric.AuthenticationUser, error) {
	defaultPlanName := s.envService.DefaultPlanName()
	if defaultPlanName == nil {
		return nil, poeticmetric.ErrNoDefaultPlan
	}

	err := s.validationService.SignUpParams(ctx, params)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if params.OrganizationTimeZone == nil {
		params.OrganizationTimeZone = poeticmetric.Pointer("UTC")
	}

	authenticationUser := &poeticmetric.AuthenticationUser{}
	err = poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx context.Context) error {
		postgres := poeticmetric.ServicePostgres(ctx, s)

		plan := poeticmetric.Plan{}
		err2 := postgres.Select("ID").First(&plan, poeticmetric.Plan{Name: *defaultPlanName}, "ID").Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		// organization
		organization := poeticmetric.Organization{
			IsOnTrial: false,
			Name:      *params.OrganizationName,
			PlanID:    plan.ID,
			TimeZone:  *params.OrganizationTimeZone,
		}
		err2 = postgres.Create(&organization).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		// user
		user := poeticmetric.User{
			Email:                    *params.UserEmail,
			IsActive:                 true,
			IsOrganizationOwner:      true,
			Name:                     *params.UserName,
			OrganizationID:           organization.ID,
		}
		user.SetEmailVerificationCode()
		err2 = user.SetPassword(*params.UserPassword)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}
		err2 = postgres.Create(&user).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		authenticationUser, err2 = s.ReadUser(ctx, user.ID)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return authenticationUser, nil
}

func (s *service) UpdateUser(ctx context.Context, userID uint, params *poeticmetric.UpdateAuthenticationUserParams) error {
	err := s.validationService.UpdateAuthenticationUserParams(ctx, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	update := poeticmetric.User{}
	var fields []string

	if params.Name != nil {
		update.Name = *params.Name
		fields = append(fields, "Name")
	}

	if len(fields) > 0 {
		postgres := poeticmetric.ServicePostgres(ctx, s)
		err = postgres.Model(&poeticmetric.User{ID: userID}).Select(fields).Updates(update).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}
	}

	return nil
}
