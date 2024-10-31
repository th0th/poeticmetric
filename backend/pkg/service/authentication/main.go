package authentication

import (
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	Postgres *gorm.DB
}

type service struct {
	postgres *gorm.DB
}

func New(params NewParams) poeticmetric.AuthenticationService {
	return &service{
		postgres: params.Postgres,
	}
}

func (s *service) CreateUserAccessToken(ctx context.Context, userID uint) (*poeticmetric.AuthenticationServiceUserAccessToken, error) {
	modelUserAccessToken := poeticmetric.UserAccessToken{UserID: userID}
	modelUserAccessToken.SetToken()

	var userAccessToken *poeticmetric.AuthenticationServiceUserAccessToken

	err := poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx2 context.Context) error {
		postgres := poeticmetric.ServicePostgres(ctx2, s)

		err2 := postgres.Create(&modelUserAccessToken).Error
		if err2 != nil {
			return err2
		}

		userAccessToken, err2 = s.ReadUserAccessToken(ctx2, modelUserAccessToken.ID)
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return userAccessToken, nil
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) ReadUserAccessToken(ctx context.Context, userAccessTokenID uint) (*poeticmetric.AuthenticationServiceUserAccessToken, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	userAccessToken := poeticmetric.AuthenticationServiceUserAccessToken{
		ID: userAccessTokenID,
	}
	err := postgres.First(&userAccessToken, userAccessToken, "ID").Error
	if err != nil {
		return nil, err
	}

	return &userAccessToken, nil
}

func (s *service) ReadUserByEmailPassword(ctx context.Context, email string, password string) (*poeticmetric.User, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{Email: email}
	err := postgres.Joins("Organization").Joins("Organization.Plan").First(&user, user, "Email").Error
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return nil, poeticmetric.ErrNotFound
		}

		return nil, err
	}

	return &user, nil
}

func (s *service) ReadUserByUserAccessToken(ctx context.Context, token string) (*poeticmetric.User, *poeticmetric.UserAccessToken, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	userAccessToken := poeticmetric.UserAccessToken{Token: token}
	err := postgres.First(&userAccessToken, userAccessToken, "Token").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, poeticmetric.ErrNotFound
		}

		return nil, nil, err
	}

	user := poeticmetric.User{ID: userAccessToken.UserID}
	err = postgres.Joins("Organization").Joins("Organization.Plan").First(&user, user, "Id").Error
	if err != nil {
		return nil, nil, err
	}

	return &user, &userAccessToken, nil
}
