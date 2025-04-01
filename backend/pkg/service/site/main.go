package site

import (
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	ClickHouse        *gorm.DB
	Postgres          *gorm.DB
	ValidationService poeticmetric.ValidationService
}

type service struct {
	clickHouse        *gorm.DB
	postgres          *gorm.DB
	validationService poeticmetric.ValidationService
}

func New(params NewParams) poeticmetric.SiteService {
	return &service{
		clickHouse:        params.ClickHouse,
		postgres:          params.Postgres,
		validationService: params.ValidationService,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}
