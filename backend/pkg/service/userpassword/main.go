package userpassword

import (
	"golang.org/x/crypto/bcrypt"

	"github.com/th0th/poeticmetric/backend/pkg/pointer"
)

func GetHash(password string) (*string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, err
	}

	return pointer.Get(string(bytes)), nil
}
