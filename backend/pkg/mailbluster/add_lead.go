package mailbluster

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
)

type AddLeadPayload struct {
	Email *string `json:"email"`
}

func AddLead(dp *depot.Depot, payload *AddLeadPayload) error {
	err := validateAddLeadPayload(payload)
	if err != nil {
		return err
	}

	reqBody := map[string]any{
		"email":            payload.Email,
		"overrideExisting": true,
		"subscribed":       true,
	}

	reqBodyJson, err := json.Marshal(reqBody)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.mailbluster.com/api/leads", bytes.NewBuffer(reqBodyJson))
	if err != nil {
		return errors.Wrap(err, 0)
	}

	req.Header.Set("content-type", "application/json")
	req.Header.Set("authorization", env.Get(env.MailBlusterApiKey))

	res, err := dp.HttpClient().Do(req)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusCreated {
		resBodyBytes, _ := io.ReadAll(res.Body)

		return errors.Errorf("received an unexpected response from MailBluster: (%d) %s", res.StatusCode, string(resBodyBytes))
	}

	return nil
}

func validateAddLeadPayload(payload *AddLeadPayload) error {
	errs := v.Validate(v.Schema{
		v.F("email", payload.Email): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is[*string](func(s *string) bool {
				return validator.Email(*s)
			}).Msg("Please provide a valid e-mail address."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
