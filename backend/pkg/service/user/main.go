package user

import (
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	EmailService      poeticmetric.EmailService
	Postgres          *gorm.DB
	ValidationService poeticmetric.ValidationService
}

type service struct {
	emailService      poeticmetric.EmailService
	postgres          *gorm.DB
	validationService poeticmetric.ValidationService
}

func New(params NewParams) poeticmetric.UserService {
	return &service{
		emailService:      params.EmailService,
		postgres:          params.Postgres,
		validationService: params.ValidationService,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}
