package validation

import (
	"context"
	"errors"
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/RussellLuo/vext"
	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/searchconsole/v1"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	EnvService poeticmetric.EnvService
	Postgres   *gorm.DB
}

type service struct {
	envService poeticmetric.EnvService
	postgres   *gorm.DB
}

func New(params NewParams) poeticmetric.ValidationService {
	return &service{
		envService: params.EnvService,
		postgres:   params.Postgres,
	}
}

func (s *service) CreateSiteParams(ctx context.Context, organizationID uint, params *poeticmetric.CreateSiteParams) error {
	errs := []error{}

	validationErrs := v.Validate(v.Schema{
		v.F("domain", params.Domain): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, vext.DNSName().Msg("Please provide a valid domain."))
			}),

			v.Is(func(x *string) bool {
				isOk, err := s.uniqueSiteDomain(ctx, *x, nil)
				if err != nil {
					errs = append(errs, err)
				}

				return isOk
			}).Msg("This domain is already in use."),
		),

		v.F("googleSearchConsoleSiteURL", params.GoogleSearchConsoleSiteURL): v.Any(
			v.Zero[*string](),

			v.All(
				v.Is(func(x *string) bool {
					isOk, err := s.googleSearchConsoleSiteURL(ctx, organizationID, *x)
					if err != nil {
						errs = append(errs, err)
					}

					return isOk
				}),
			),
		),

		v.F("isPublic", params.IsPublic): v.All(
			v.Nonzero[*bool]().Msg("This field is required."),
		),

		v.F("name", params.Name): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.SiteNameMinLength, poeticmetric.SiteNameMaxLength).Msg(fmt.Sprintf(
					"The site name must be between %d and %d characters long.",
					poeticmetric.SiteNameMinLength,
					poeticmetric.SiteNameMaxLength,
				)))
			}),
		),
	})

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) ResetUserPasswordParams(ctx context.Context, params *poeticmetric.ResetUserPasswordParams) error {
	errs := []error{}

	validationErrs := v.Validate(v.Schema{
		v.F("passwordResetToken", params.PasswordResetToken): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(x *string) bool {
				isValid, err := s.userPasswordResetToken(ctx, *x)
				if err != nil {
					errs = append(errs, err)
				}

				return isValid
			}).Msg("Password reset token is not valid."),
		),

		v.F("userPassword", params.UserPassword): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserPasswordMinLength, poeticmetric.UserPasswordMaxLength).Msg(fmt.Sprintf(
					"The password must be between %d and %d characters long.",
					poeticmetric.UserPasswordMinLength,
					poeticmetric.UserPasswordMaxLength,
				)))
			}),
		),

		v.F("userPassword2", params.UserPassword2): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.Eq(*params.UserPassword).Msg("Passwords do not match."))
			}),
		),
	})
	if len(errs) > 0 {
		return errors.Join(errs...)
	}
	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

func (s *service) SendUserPasswordRecoveryEmailParams(ctx context.Context, params *poeticmetric.SendUserPasswordRecoveryEmailParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("email", params.Email): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, vext.Email().Msg("Please provide a valid e-mail address."))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

func (s *service) googleSearchConsoleSiteURL(ctx context.Context, organizationID uint, siteURL string) (bool, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.Organization{}
	err := postgres.Select("GoogleOauthRefreshToken").First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
	if err != nil {
		return false, err
	}

	if organization.GoogleOauthRefreshToken == nil {
		return false, poeticmetric.ErrNoOrganizationGoogleOauthRefreshToken
	}

	oAuthConfig, err := s.envService.GoogleOAuthConfig()
	if err != nil {
		return false, err
	}

	searchConsoleService, err := searchconsole.NewService(
		ctx,
		option.WithTokenSource(oAuthConfig.TokenSource(ctx, &oauth2.Token{RefreshToken: *organization.GoogleOauthRefreshToken})),
	)
	if err != nil {
		return false, err
	}

	site, err := searchConsoleService.Sites.Get(siteURL).Do()
	if err != nil {
		return false, err
	}

	if site.SiteUrl != siteURL {
		return false, nil
	}

	return true, nil
}

func (s *service) uniqueSiteDomain(ctx context.Context, domain string, siteID *uint) (bool, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	q := postgres.Session(&gorm.Session{})
	if siteID != nil {
		q = q.Not(poeticmetric.Site{ID: *siteID})
	}
	err := q.First(&poeticmetric.Site{}, poeticmetric.Site{Domain: domain}).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return true, nil
		}

		return false, err
	}

	return false, nil
}

func (s *service) userPasswordResetToken(ctx context.Context, token string) (bool, error) {
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
