package authentication

import (
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

// ReadPlan godoc
// @Description Read the current plan of the authenticated user's organization.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/plan [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationPlan
// @Summary Read plan
// @Tags authentication
func (h *Handler) ReadPlan(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	plan, err := h.authenticationService.ReadPlan(r.Context(), authentication.User.Organization.PlanID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, plan)
}
