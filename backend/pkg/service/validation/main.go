package validation

import (
	_ "embed"

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

func New(params NewParams) poeticmetric.ValidationService {
	return &service{
		envService: params.EnvService,
		postgres:   params.Postgres,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}


