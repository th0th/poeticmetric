package authentication

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

// ActivateUser godoc
// @Description Activate user with the activation token.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/activate-user [post]
// @Success 200 {object} poeticmetric.AuthenticationUser
// @Summary Activate user
// @Tags authentication
func (h *Handler) ActivateUser(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.ActivateUserParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	err = h.authenticationService.ActivateUser(r.Context(), &params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.Detail(w, http.StatusOK, "User activated successfully.")
}

// ReadUser godoc
// @Description Read currently authenticated user.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/user [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationUser
// @Summary Read user
// @Tags authentication
func (h *Handler) ReadUser(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	user, err := h.authenticationService.ReadUser(r.Context(), authentication.User.ID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, user)
}

// ResendUserEmailAddressVerificationEmail godoc
// @Description Resend the e-mail with the e-mail address verification code to the user.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/resend-user-email-address-verification-email [post]
// @Success 200 {object} responder.DetailResponse
// @Summary Resend user e-mail address verification e-mail
// @Tags authentication
func (h *Handler) ResendUserEmailAddressVerificationEmail(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	err := h.authenticationService.ResendUserEmailAddressVerificationEmail(r.Context(), authentication.User.ID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.Detail(w, http.StatusOK, "OK.")
}

// SignUp godoc
// @Description Sign up a new user.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/sign-up [post]
// @Success 201 {object} poeticmetric.AuthenticationUser
// @Summary Sign up
// @Tags authentication
func (h *Handler) SignUp(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.SignUpParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	authenticationUser, err := h.authenticationService.SignUp(r.Context(), &params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusCreated, authenticationUser)
}

// UpdateUser godoc
// @Description Update currently authenticated user.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/user [patch]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationUser
// @Summary Update user
// @Tags authentication
func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	params := poeticmetric.UpdateAuthenticationUserParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	user := &poeticmetric.AuthenticationUser{}
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.authenticationService, func(ctx context.Context) error {
		err = h.authenticationService.UpdateUser(ctx, authentication.User.ID, &params)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		user, err = h.authenticationService.ReadUser(ctx, authentication.User.ID)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, user)
}

// VerifyUserEmailAddress godoc
// @Description Verify user's e-mail address by the verification code.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/verify-user-email-address [patch]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationUser
// @Summary Verify user e-mail address
// @Tags authentication
func (h *Handler) VerifyUserEmailAddress(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	params := poeticmetric.VerifyUserEmailAddressParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	user := &poeticmetric.AuthenticationUser{}
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.authenticationService, func(ctx context.Context) error {
		err = h.authenticationService.VerifyUserEmailAddress(ctx, authentication.User.ID, &params)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		user, err = h.authenticationService.ReadUser(ctx, authentication.User.ID)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, user)
}
