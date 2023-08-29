package auth

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

type SignUpData struct {
	OrganizationName string
	UserEmail        string
	UserName         string
	UserPassword     string
}

func SignUp(ctx context.Context, data *SignUpData) (*model.Organization, *model.User, *model.UserSessionToken, error) {
	err := validateSignUpData(ctx, data)
	if err != nil {
		return nil, nil, nil, errors.Wrap(err, 0)
	}

	organization := model.Organization{
		Name: data.OrganizationName,
	}

	user := model.User{
		Email: data.UserEmail,
		Name:  data.UserName,
	}

	err = user.SetPassword(data.UserPassword)
	if err != nil {
		return nil, nil, nil, errors.Wrap(err, 0)
	}

	userSessionToken := model.UserSessionToken{}

	userSessionToken.SetToken()

	err = ic.PostgresTransaction(ctx, func(ctx2 context.Context) error {
		err = ic.Postgres(ctx2).Create(&organization).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		user.OrganizationId = organization.Id

		err = ic.Postgres(ctx2).Create(&user).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		userSessionToken.UserId = user.Id

		err = ic.Postgres(ctx2).Create(userSessionToken).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})
	if err != nil {
		return nil, nil, nil, errors.Wrap(err, 0)
	}

	return &organization, &user, &userSessionToken, nil
}

func validateSignUpData(ctx context.Context, data *SignUpData) error {
	return nil
}
