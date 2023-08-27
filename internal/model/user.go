package model

import (
	"context"
	"time"

	"github.com/go-errors/errors"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ActivationToken          *string
	CreatedAt                time.Time
	Email                    string
	EmailVerificationToken   *string
	Id                       uint
	IsActive                 bool
	IsEmailVerified          bool
	IsOrganizationOwner      bool
	LastAccessTokenCreatedAt *time.Time
	Name                     string
	Organization             Organization
	OrganizationId           uint
	Password                 string
	PasswordResetToken       *string
	UpdatedAt                time.Time
}

type UserRepository interface {
	Create(context.Context, *User) error
	ReadById(context.Context, uint) (*User, error)
}

func (u *User) SetPassword(rawPassword string) error {
	passwordBuffer, err := bcrypt.GenerateFromPassword([]byte(rawPassword), 10)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	u.Password = string(passwordBuffer)

	return nil
}
