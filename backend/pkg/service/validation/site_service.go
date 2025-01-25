package validation

import (
	"context"
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/RussellLuo/vext"
	"github.com/go-errors/errors"
	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/searchconsole/v1"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) CreateOrganizationSiteParams(ctx context.Context, organizationID uint, params *poeticmetric.CreateOrganizationSiteParams) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.Organization{}
	err := postgres.Select("GoogleOauthRefreshToken").First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	errs := []error{}

	validationErrs := v.Validate(v.Schema{
		v.F("domain", params.Domain): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, vext.DNSName().Msg("Please provide a valid domain."))
			}),

			v.Is(func(x *string) bool {
				isOk, err2 := s.uniqueSiteDomain(ctx, *x, nil)
				if err2 != nil {
					errs = append(errs, errors.Wrap(err2, 0))
				}

				return isOk
			}).Msg("This domain is already in use."),
		),

		v.F("googleSearchConsoleSiteURL", params.GoogleSearchConsoleSiteURL): v.Any(
			v.Zero[*string](),

			v.All(
				v.Is(func(_ any) bool {
					return organization.GoogleOauthRefreshToken != nil
				}).Msg("You need to connect your Google Search Console account to use this feature."),

				v.Is(func(x *string) bool {
					isOk, err2 := s.googleSearchConsoleSiteURL(ctx, organizationID, *x)
					if err2 != nil {
						errs = append(errs, err2)
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
		return errors.Wrap(errors.Join(errs...), 0)
	}

	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

func (s *service) UpdateOrganizationSiteParams(ctx context.Context, organizationID uint, siteID uint, params *poeticmetric.UpdateOrganizationSiteParams) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.Organization{}
	err := postgres.Select("GoogleOauthRefreshToken").First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	validationErrs := v.Validate(v.Schema{
		v.F("domain", params.Domain): v.Any(
			v.Zero[*string](),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.All(
					vext.DNSName().Msg("Please provide a valid domain."),
					s.siteUniqueDomain(ctx, &siteID).Msg("This domain is already in use."),
				))
			}),
		),

		v.F("googleSearchConsoleSiteURL", params.GoogleSearchConsoleSiteURL): v.Any(
			v.Zero[*string](),

			v.All(
				v.Is(func(_ any) bool {
					return organization.GoogleOauthRefreshToken != nil
				}).Msg("You need to connect your Google Search Console account to use this feature."),
			),
		),

		v.F("name", params.Name): v.Any(
			v.Zero[*string](),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.All(
					v.LenString(poeticmetric.SiteNameMinLength, poeticmetric.SiteNameMaxLength).Msg(fmt.Sprintf(
						"The site name must be between %d and %d characters long.",
						poeticmetric.SiteNameMinLength,
						poeticmetric.SiteNameMaxLength,
					)),
				))
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
