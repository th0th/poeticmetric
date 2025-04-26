package log

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	Postgres *gorm.DB
}

type service struct {
	postgres *gorm.DB
}

func New(params NewParams) poeticmetric.LogService {
	return &service{
		postgres: params.Postgres,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) CreateUnverifiedOrganizationsDeletionLog(ctx context.Context, data *poeticmetric.LogUnverifiedOrganizationsDeletionData) error {
	err := s.create(ctx, poeticmetric.LogKindUnverifiedOrganizationsDeletion, data)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) create(ctx context.Context, kind poeticmetric.LogKind, params any) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	log := poeticmetric.Log{
		Data: params,
		Kind: kind,
	}

	err := postgres.Create(&log).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
