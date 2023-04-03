package user

import (
	v "github.com/RussellLuo/validating/v3"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
)

type MakeOwnerPayload struct {
	Id *uint64 `json:"id"`
}

func MakeOwner(dp *depot.Depot, payload *MakeOwnerPayload) (*User, error) {
	err := validateMakeOwnerPayload(dp, payload)
	if err != nil {
		return nil, err
	}

	modelUser := &model.User{}

	err = dp.Postgres().
		Model(&model.User{}).
		Select("organization_id").
		Where("id = ?", *payload.Id).
		First(modelUser).
		Error
	if err != nil {
		return nil, err
	}

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		err2 := dp2.Postgres().
			Model(&model.User{}).
			Where("organization_id = ?", modelUser.OrganizationId).
			Update("is_organization_owner", false).
			Error
		if err2 != nil {
			return err2
		}

		err2 = dp2.Postgres().
			Model(&model.User{}).
			Where("id = ?", *payload.Id).
			Update("is_organization_owner", true).
			Error
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return Read(dp, *payload.Id)
}

func validateMakeOwnerPayload(dp *depot.Depot, payload *MakeOwnerPayload) error {
	errs := v.Validate(v.Schema{
		v.F("id", payload.Id): v.All(
			v.Nonzero[*uint64](),

			v.Is(func(t *uint64) bool {
				return validator.UserActive(dp, *t)
			}).Msg("Team member should activate their account to take the ownership."),

			v.Is(func(t *uint64) bool {
				return validator.UserEmailVerified(dp, *t)
			}).Msg("Team member should verify their e-mail address to take the ownership"),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
