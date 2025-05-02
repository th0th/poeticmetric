package authentication

import (
	"context"
	"errors"
	"net/mail"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	EmailService      poeticmetric.EmailService
	EnvService        poeticmetric.EnvService
	Postgres          *gorm.DB
	ValidationService poeticmetric.ValidationService
}

type service struct {
	emailService      poeticmetric.EmailService
	envService        poeticmetric.EnvService
	postgres          *gorm.DB
	validationService poeticmetric.ValidationService
}

func New(params NewParams) poeticmetric.AuthenticationService {
	return &service{
		emailService:      params.EmailService,
		envService:        params.EnvService,
		postgres:          params.Postgres,
		validationService: params.ValidationService,
	}
}

func (s *service) CreateUserAccessToken(ctx context.Context, userID uint) (*poeticmetric.AuthenticationUserAccessToken, error) {
	modelUserAccessToken := poeticmetric.UserAccessToken{UserID: userID}
	modelUserAccessToken.SetToken()

	var userAccessToken *poeticmetric.AuthenticationUserAccessToken

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

func (s *service) DeleteUserAccessTokens(ctx context.Context, userID uint) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	err := postgres.Delete(&poeticmetric.UserAccessToken{}, poeticmetric.UserAccessToken{UserID: userID}, "UserID").Error
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteUserAccessToken(ctx context.Context, userAccessTokenID uint) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	userAccessToken := poeticmetric.UserAccessToken{}
	err := postgres.First(&userAccessToken, poeticmetric.UserAccessToken{ID: userAccessTokenID}, "ID").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return poeticmetric.ErrNotFound
		}

		return err
	}

	err = postgres.Delete(poeticmetric.UserAccessToken{ID: userAccessTokenID}).Error
	if err != nil {
		return err
	}

	return nil
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) ReadUser(ctx context.Context, userID uint) (*poeticmetric.AuthenticationUser, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.AuthenticationUser{}
	err := postgres.Model(&poeticmetric.User{}).First(&user, poeticmetric.User{ID: userID}, "ID").Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *service) ReadUserAccessToken(ctx context.Context, userAccessTokenID uint) (*poeticmetric.AuthenticationUserAccessToken, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	userAccessToken := poeticmetric.AuthenticationUserAccessToken{}
	err := postgres.
		First(&userAccessToken, poeticmetric.AuthenticationUserAccessToken{ID: userAccessTokenID}, "ID").
		Error
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
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, poeticmetric.ErrNotFound
		}

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

	user := poeticmetric.User{}
	err = postgres.Joins("Organization").Joins("Organization.Plan").First(&user, poeticmetric.User{ID: userAccessToken.UserID}, "ID").Error
	if err != nil {
		return nil, nil, err
	}

	return &user, &userAccessToken, nil
}

func (s *service) ResetUserPassword(ctx context.Context, params *poeticmetric.ResetUserPasswordParams) error {
	err := s.validationService.ResetUserPasswordParams(ctx, params)
	if err != nil {
		return err
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{PasswordResetToken: params.PasswordResetToken}
	err = postgres.Select("ID").First(&user, user, "PasswordResetToken").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return poeticmetric.ErrNotFound
		}

		return err
	}

	err = user.SetPassword(*params.UserPassword)
	if err != nil {
		return err
	}

	user.PasswordResetToken = nil

	err = postgres.Model(&user).Select("Password", "PasswordResetToken").UpdateColumns(&user).Error
	if err != nil {
		return errors.Unwrap(err)
	}

	return nil
}

func (s *service) SendUserPasswordRecoveryEmail(ctx context.Context, params *poeticmetric.SendUserPasswordRecoveryEmailParams) error {
	err := s.validationService.SendUserPasswordRecoveryEmailParams(ctx, params)
	if err != nil {
		return err
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{Email: *params.Email}
	err = postgres.First(&user, user, "Email").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return poeticmetric.ErrNotFound
		}

		return err
	}
	user.SetPasswordResetToken()

	err = poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx2 context.Context) error {
		postgres2 := poeticmetric.ServicePostgres(ctx2, s)

		err2 := postgres2.Model(&user).Select("PasswordResetToken").UpdateColumns(&user).Error
		if err2 != nil {
			return err2
		}

		err2 = s.emailService.Send(poeticmetric.SendEmailParams{
			Subject:  "PoeticMetric password recovery",
			Template: poeticmetric.PasswordRecoveryEmailTemplate,
			TemplateData: poeticmetric.PasswordRecoveryEmailTemplateParams{
				User: &user,
			},
			To: &mail.Address{Address: user.Email, Name: user.Name},
		})
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *service) ValidateUserPasswordResetToken(ctx context.Context, token string) (bool, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	err := postgres.Select("PasswordResetToken").First(&poeticmetric.User{}, poeticmetric.User{PasswordResetToken: &token}).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}

		return false, err
	}

	return true, nil
}
