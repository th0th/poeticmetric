package sites

import (
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/parser"
)

// ReadPublicSite godoc
// @Description Read a public site by its domain.
// @Param siteDomain path string true "Site Domain"
// @Router /public-sites/{siteDomain} [get]
// @Success 200 {object} poeticmetric.PublicSiteResponse
// @Failure 404 {object} responder.DetailResponse
// @Summary Read public site
// @Tags sites
func (h *Handler) ReadPublicSite(w http.ResponseWriter, r *http.Request) {
	siteDomain, err := parser.PathValue[string](r, "siteDomain")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	response, err := h.siteService.ReadPublicSite(r.Context(), siteDomain)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			h.responder.NotFound(w)
			return
		}

		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, response)
}
