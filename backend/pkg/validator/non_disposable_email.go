package validator

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/getsentry/sentry-go"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
)

func nonDisposableEmail(dp *depot.Depot, v string) bool {
	var err error

	req, err := http.NewRequest(http.MethodGet, "https://isemaildisposable.webgazer.iox", nil)
	if err != nil {
		panic(err)
	}

	query := req.URL.Query()

	query.Add("email", v)

	req.URL.RawQuery = query.Encode()

	res, err := dp.HttpClient().Do(req)
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	result := &struct {
		IsDisposable bool `json:"isDisposable"`
	}{}

	err = json.Unmarshal(body, result)
	if err != nil {
		panic(err)
	}

	return !result.IsDisposable
}

func NonDisposableEmail(dp *depot.Depot, v string) (isValid bool) {
	defer func() {
		if r := recover(); r != nil {
			isValid = true

			var err error

			switch x := r.(type) {
			case string:
				err = errors.New(x)
			case error:
				err = x
			default:
				err = errors.New("unknown panic")
			}

			sentry.CaptureException(err)
		}
	}()

	isValid = nonDisposableEmail(dp, v)

	return
}
