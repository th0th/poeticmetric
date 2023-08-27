package auth

import (
	"context"

	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
	"github.com/th0th/poeticmetric/internal/validator"
)

type SignInData struct {
	Email    string
	Password string
}

func SignIn(ctx context.Context, data *SignInData) (*model.UserSessionToken, error) {
	err := validateSignInData(ctx, data)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	user := model.User{
		Email: data.Email,
	}

	err = ic.Pg(ctx).Where(user, "Email").First(&user).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	userSessionToken := model.UserSessionToken{
		UserId: user.Id,
	}

	userSessionToken.SetToken()

	err = ic.Pg(ctx).Create(&userSessionToken).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &userSessionToken, nil
}

func validateSignInData(ctx context.Context, data *SignInData) error {
	errs := v.Validate(v.Schema{
		v.F("Detail", data): v.Is[*SignInData](func(d *SignInData) bool {
			return validator.UserEmailPassword(ctx, d.Email, d.Password)
		}).Msg("Invalid credentials."),

		v.F("Email", data.Email): v.All(
			v.Nonzero[string]().Msg("This field is required."),

			v.Is[string](validator.Email).Msg("Please enter a valid e-mail address."),
		),
	})

	if len(errs) > 0 {
		return errors.Wrap(errs, 0)
	}

	return nil
}
