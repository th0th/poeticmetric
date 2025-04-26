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
	EnvService poeticmetric.EnvService
	Postgres   *gorm.DB
}

type service struct {
	envService poeticmetric.EnvService
	postgres   *gorm.DB
}

func New(params NewParams) poeticmetric.OrganizationService {
	return &service{
		envService: params.EnvService,
		postgres:   params.Postgres,
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

//go:embed files/delete_unverified_organizations.sql
var deleteUnverifiedOrganizationsQuery string
