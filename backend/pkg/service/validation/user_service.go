package validation

import (
	"context"
	_ "embed"
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/RussellLuo/vext"
	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) InviteOrganizationUserParams(ctx context.Context, organizationID uint, params *poeticmetric.InviteOrganizationUserParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("detail", params): v.All(
			v.Value(organizationID, s.organizationCanAddUser(ctx).Msg("Your organization has reached the maximum number of users.")),
		),

		v.F("email", params.Email): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.All(
					vext.Email().Msg("Please provide a valid e-mail address."),
					s.userUniqueEmail(ctx, nil).Msg("This e-mail address is already in use."),
				))
			}),
		),

		v.F("name", params.Name): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserNameMinLength, poeticmetric.UserNameMaxLength).Msg(fmt.Sprintf(
					"This field should be between %d and %d characters in length.",
					poeticmetric.UserNameMinLength,
					poeticmetric.UserNameMaxLength,
				)))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}
