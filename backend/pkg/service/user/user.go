package user

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ListOrganizationUsers(ctx context.Context, organizationID uint) ([]*poeticmetric.OrganizationUser, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationUsers := []*poeticmetric.OrganizationUser{}
	err := postgres.
		Find(&organizationUsers, poeticmetric.User{OrganizationID: organizationID}, "OrganizationID").
		Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return organizationUsers, nil
}
