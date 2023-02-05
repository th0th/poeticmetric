package testhelper

import "github.com/th0th/poeticmetric/backend/pkg/depot"

func NewDepot() *depot.Depot {
	s := depot.New()

	return s
}
