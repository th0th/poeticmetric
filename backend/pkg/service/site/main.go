package site

import (
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	ClickHouse        *gorm.DB
	EnvService        poeticmetric.EnvService
	Postgres          *gorm.DB
	ValidationService poeticmetric.ValidationService
}

type service struct {
	clickHouse        *gorm.DB
	envService        poeticmetric.EnvService
	postgres          *gorm.DB
	validationService poeticmetric.ValidationService
}

func New(params NewParams) poeticmetric.SiteService {
	return &service{
		clickHouse:        params.ClickHouse,
		envService:        params.EnvService,
		postgres:          params.Postgres,
		validationService: params.ValidationService,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}
