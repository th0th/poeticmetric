package validator

import (
	"net/mail"
)

func Email(v string) bool {
	_, err := mail.ParseAddress(v)
	return err == nil
}
