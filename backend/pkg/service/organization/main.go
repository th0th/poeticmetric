package organization

import (
	"context"
	_ "embed"
	"time"

	"github.com/go-errors/errors"
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

func New(params NewParams) poeticmetric.OrganizationService {
	return &service{
		emailService:      params.EmailService,
		envService:        params.EnvService,
		postgres:          params.Postgres,
		validationService: params.ValidationService,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) DeleteUnverifiedOrganizations(ctx context.Context) error {
	dateTime := time.Now()

	err := poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx context.Context) error {
		postgres := poeticmetric.ServicePostgres(ctx, s)

		var data poeticmetric.LogUnverifiedOrganizationsDeletionData
		err2 := postgres.
			Raw(deleteUnverifiedOrganizationsQuery, map[string]any{
				"unverifiedOrganizationDeletionDays": s.envService.UnverifiedOrganizationDeletionDays(),
			}).
			Find(&data).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		if len(data) > 0 {
			log := poeticmetric.Log{
				Data:     data,
				DateTime: dateTime,
				Kind:     poeticmetric.LogKindUnverifiedOrganizationsDeletion,
			}
			err2 = postgres.Create(&log).Error
			if err2 != nil {
				return errors.Wrap(err2, 0)
			}
		}

		return nil
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) ReadOrganization(ctx context.Context, organizationID uint) (*poeticmetric.OrganizationResponse, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationResponse := poeticmetric.OrganizationResponse{}
	err := postgres.First(&organizationResponse, poeticmetric.Organization{ID: organizationID}, "ID").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.Wrap(poeticmetric.ErrNotFound, 0)
		}

		return nil, errors.Wrap(err, 0)
	}

	return &organizationResponse, nil
}

func (s *service) UpdateOrganization(ctx context.Context, organizationID uint, request *poeticmetric.UpdateOrganizationRequest) error {
	err := s.validationService.UpdateOrganizationRequest(ctx, request)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.Organization{ID: organizationID}
	err = postgres.Select("ID").First(&organization, organization, "ID").Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	fields := []string{}

	if request.Name != nil {
		organization.Name = *request.Name
		fields = append(fields, "Name")
	}

	err = postgres.Model(&organization).Select(fields).Updates(&organization).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

//go:embed files/delete_unverified_organizations.sql
var deleteUnverifiedOrganizationsQuery string
