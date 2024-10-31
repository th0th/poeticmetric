package authentication

import (
	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
}

type service struct {
}

func New(params NewParams) poeticmetric.AuthenticationService {
	return &service{}
}
