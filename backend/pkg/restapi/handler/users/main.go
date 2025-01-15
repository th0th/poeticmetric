package users

import (
	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type Handler struct {
	userService poeticmetric.UserService
	responder   poeticmetric.RestApiResponder
}

type NewParams struct {
	UserService poeticmetric.UserService
	Responder   poeticmetric.RestApiResponder
}

func New(params NewParams) *Handler {
	return &Handler{
		userService: params.UserService,
		responder:   params.Responder,
	}
}
