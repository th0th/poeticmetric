package env

import (
	env2 "github.com/caarlos0/env/v11"

	"github.com/th0th/unius-analytics/backend/pkg/analytics"
)

type service struct {
	vars analytics.EnvServiceVars
}

func New() (analytics.EnvService, error) {
	e := service{}

	err := env2.Parse(&e.vars)
	if err != nil {
		return nil, err
	}

	return &e, nil
}

func (s *service) BasePath() string {
	return s.vars.BasePath
}
