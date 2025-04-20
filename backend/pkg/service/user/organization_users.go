package user

import (
	"context"
	"fmt"
	"net/mail"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) DeleteOrganizationUser(ctx context.Context, organizationID uint, userID uint) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{}
	err := postgres.
		Select("ID", "IsOrganizationOwner").
		First(&user, poeticmetric.User{ID: userID, OrganizationID: organizationID}, "ID", "OrganizationID").
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.Wrap(poeticmetric.ErrNotFound, 0)
		}
	}

	if user.IsOrganizationOwner {
		return errors.Wrap(poeticmetric.ErrCantDeleteOwnerUser, 0)
	}

	err = postgres.Delete(&user).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

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
			Template: poeticmetric.InvitationEmailTemplate,
			TemplateData: poeticmetric.InviteEmailTemplateParams{
				User: &user,
			},
			To: &mail.Address{Address: user.Email},
		})
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	organizationUser, err := s.ReadOrganizationUser(ctx, organizationID, user.ID)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return organizationUser, nil
}

func (s *service) ListOrganizationUsers(ctx context.Context, organizationID uint) ([]*poeticmetric.OrganizationUser, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationUsers := []*poeticmetric.OrganizationUser{}
	err := postgres.
		Order("is_organization_owner desc").
		Order("is_active").
		Order("name").
		Find(&organizationUsers, poeticmetric.User{OrganizationID: organizationID}, "OrganizationID").
		Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return organizationUsers, nil
}

func (s *service) ReadOrganizationUser(ctx context.Context, organizationID uint, userID uint) (*poeticmetric.OrganizationUser, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationUser := poeticmetric.OrganizationUser{}
	err := postgres.First(&organizationUser, poeticmetric.User{ID: userID, OrganizationID: organizationID}, "ID", "OrganizationID").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.Wrap(poeticmetric.ErrNotFound, 0)
		}

		return nil, errors.Wrap(err, 0)
	}

	return &organizationUser, nil
}

func (s *service) ResendOrganizationUserInvitationEmail(ctx context.Context, organizationID uint, params *poeticmetric.ResendOrganizationUserInvitationEmailParams) error {
	err := s.validationService.ResendOrganizationUserInvitationEmailParams(ctx, organizationID, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{}
	err = postgres.
		Joins("Organization", postgres.Select("Name")).
		Select("ActivationToken", "Email", "IsEmailVerified").
		First(&user, poeticmetric.User{ID: *params.UserID, OrganizationID: organizationID}, "ID", "OrganizationID").
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.Wrap(poeticmetric.ErrNotFound, 0)
		}

		return errors.Wrap(err, 0)
	}

	if user.IsEmailVerified {
		return errors.Wrap(poeticmetric.ErrUserAlreadyVerifiedEmail, 0)
	}

	err = s.emailService.Send(poeticmetric.SendEmailParams{
		Subject:  fmt.Sprintf("Join %s on PoeticMetric", user.Organization.Name),
		Template: poeticmetric.InvitationEmailTemplate,
		TemplateData: poeticmetric.InviteEmailTemplateParams{
			User: &user,
		},
		To: &mail.Address{Address: user.Email, Name: user.Name},
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) UpdateOrganizationUser(ctx context.Context, organizationID uint, userID uint, params *poeticmetric.UpdateOrganizationUserParams) error {
	err := s.validationService.UpdateOrganizationUserParams(ctx, organizationID, userID, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	update := poeticmetric.User{}
	var fields []string

	if params.Name != nil {
		update.Name = *params.Name
		fields = append(fields, "Name")
	}

	if len(fields) > 0 {
		postgres := poeticmetric.ServicePostgres(ctx, s)
		err = postgres.
			Model(&poeticmetric.User{}).
			Where(poeticmetric.User{ID: userID, OrganizationID: organizationID}, "ID", "OrganizationID").
			Select(fields).
			UpdateColumns(update).
			Error
		if err != nil {
			return errors.Wrap(err, 0)
		}
	}

	return nil
}
