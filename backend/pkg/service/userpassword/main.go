package userpassword

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"golang.org/x/crypto/bcrypt"
)

func GetHash(password string) (*string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, err
	}

	return pointer.Get(string(bytes)), nil
}
