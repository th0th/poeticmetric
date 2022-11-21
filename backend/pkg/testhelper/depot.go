package testhelper

import "github.com/poeticmetric/poeticmetric/backend/pkg/depot"

func NewDepot() *depot.Depot {
	s := depot.New()

	return s
}
