package organization

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/go-errors/errors"
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

type GetOrganizationDeletionOptionsResponse struct {
	DetailMaxLength int                                        `json:"detailMaxLength"`
	DetailMinLength int                                        `json:"detailMinLength"`
	Reasons         []*poeticmetric.OrganizationDeletionReason `json:"reasons"`
}

type Handler struct {
	envService          poeticmetric.EnvService
	responder           poeticmetric.RestApiResponder
	organizationService poeticmetric.OrganizationService
}

type NewParams struct {
	EnvService          poeticmetric.EnvService
	Responder           poeticmetric.RestApiResponder
	OrganizationService poeticmetric.OrganizationService
}

func New(params NewParams) *Handler {
	return &Handler{
		envService:          params.EnvService,
		responder:           params.Responder,
		organizationService: params.OrganizationService,
	}
}

// ChangePlan godoc
// @Description Change organization plan.
// @Param request body poeticmetric.ChangePlanRequest true "Request"
// @Router /organization/change-plan [post]
// @Security UserAccessTokenAuthentication
// @Success 202 {object} poeticmetric.ChangePlanResponse
// @Summary Change plan
// @Tags organization
func (h *Handler) ChangePlan(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	request := poeticmetric.ChangePlanRequest{}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	response, err := h.organizationService.ChangePlan(r.Context(), auth.User.OrganizationID, &request)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusAccepted, response)
}

func (h *Handler) CreateStripeBillingPortalSession(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	res, err := h.organizationService.CreateStripeBillingPortalSession(r.Context(), auth.User.OrganizationID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusCreated, res)
}

// DeleteOrganization godoc
// @Description Delete organization and all associated data irreversibly.
// @Param request body poeticmetric.OrganizationDeletionRequest true "Request"
// @Router /organization [delete]
// @Security BasicAuthentication
// @Success 204
// @Summary Delete organization
// @Tags organization
func (h *Handler) DeleteOrganization(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	request := poeticmetric.OrganizationDeletionRequest{}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	err = h.organizationService.DeleteOrganization(r.Context(), auth.User.OrganizationID, &request)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// GetOrganizationDeletionOptions godoc
// @Description List possible organization deletion reasons.
// @Router /organization/deletion-reasons [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationDeletionReason
// @Summary List organization deletion reasons
// @Tags organization
func (h *Handler) GetOrganizationDeletionOptions(w http.ResponseWriter, r *http.Request) {
	organizationDeletionReasons, err := h.organizationService.ListOrganizationDeletionReasons(r.Context())
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	response := GetOrganizationDeletionOptionsResponse{
		DetailMaxLength: poeticmetric.OrganizationDeletionDetailMaxLength,
		DetailMinLength: poeticmetric.OrganizationDeletionDetailMinLength,
		Reasons:         organizationDeletionReasons,
	}

	h.responder.JSON(w, http.StatusOK, response)
}

// ReadOrganization godoc
// @Description Read currently authenticated user's organization.
// @Router /organization [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.OrganizationResponse
// @Summary Read organization
// @Tags organization
func (h *Handler) ReadOrganization(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	user, err := h.organizationService.ReadOrganization(r.Context(), authentication.User.OrganizationID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, user)
}

// ReadPlan godoc
// @Description Read the current plan of the authenticated user's organization.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/plan [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.PlanResponse
// @Summary Read plan
// @Tags organization
func (h *Handler) ReadPlan(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	plan, err := h.organizationService.ReadPlan(r.Context(), authentication.User.Organization.PlanID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, plan)
}

func (h *Handler) StripeWebhook(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	stripeEvent, err := webhook.ConstructEvent(body, r.Header.Get("stripe-signature"), h.envService.StripeWebhookSigningSecret())
	if err != nil {
		if errors.Is(err, webhook.ErrNoValidSignature) ||
			errors.Is(err, webhook.ErrInvalidHeader) ||
			errors.Is(err, webhook.ErrNotSigned) ||
			errors.Is(err, webhook.ErrTooOld) {
			h.responder.Detail(w, http.StatusBadRequest, "Invalid parameters.")
			return
		}

		h.responder.Error(w, errors.Wrap(err, 0))
	}

	stripeSubscription := &stripe.Subscription{}
	err = json.Unmarshal(stripeEvent.Data.Raw, stripeSubscription)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	request := poeticmetric.UpdateOrganizationSubscriptionRequest{
		StripeSubscriptionID: &stripeSubscription.ID,
	}

	err = h.organizationService.UpdateOrganizationSubscription(r.Context(), &request)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.Detail(w, http.StatusOK, "OK.")
}

// UpdateOrganization godoc
// @Description Update currently authenticated user's organization.
// @Param request body poeticmetric.UpdateOrganizationRequest true "Request"
// @Router /organization [patch]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.OrganizationResponse
// @Summary Update organization
// @Tags organization
func (h *Handler) UpdateOrganization(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	request := poeticmetric.UpdateOrganizationRequest{}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	organization := &poeticmetric.OrganizationResponse{}
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.organizationService, func(ctx context.Context) error {
		err = h.organizationService.UpdateOrganization(ctx, authentication.User.OrganizationID, &request)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		organization, err = h.organizationService.ReadOrganization(ctx, authentication.User.OrganizationID)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, organization)
}
