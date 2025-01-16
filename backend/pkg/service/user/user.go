package user

import (
	"context"
	"fmt"
	"net/mail"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) InviteOrganizationUser(ctx context.Context, organizationID uint, params *poeticmetric.InviteOrganizationUserParams) (*poeticmetric.OrganizationUser, error) {
	err := s.validationService.InviteOrganizationUserParams(ctx, organizationID, params)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	organization := poeticmetric.Organization{ID: organizationID}
	err = s.postgres.Select("Name").First(&organization, organization, "ID").Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	user := poeticmetric.User{
		Email:          *params.Email,
		Name:           *params.Name,
		OrganizationID: organizationID,
	}

	user.SetActivationToken()
	user.Organization = organization

	err = s.postgres.Transaction(func(postgres *gorm.DB) error {
		err2 := postgres.Create(&user).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		err2 = s.emailService.Send(poeticmetric.SendEmailParams{
			Subject:  fmt.Sprintf("Join %s on PoeticMetric", organization.Name),
			Template: poeticmetric.InviteEmailTemplate,
			TemplateData: poeticmetric.InviteEmailTemplateParams{
				User: &user,
			},
			To: &mail.Address{Address: user.Email, Name: user.Name},
		})
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	organizationUser, err := s.ReadOrganizationUser(ctx, user.ID)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return organizationUser, nil
}

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

func (s *service) ReadOrganizationUser(ctx context.Context, userID uint) (*poeticmetric.OrganizationUser, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationUser := poeticmetric.OrganizationUser{}
	err := postgres.First(&organizationUser, userID).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &organizationUser, nil
}
