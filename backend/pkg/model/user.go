package model

import "time"

const (
	UserNameMaxLength     = 70
	UserNameMinLength     = 1
	UserPasswordMaxLength = 72
	UserPasswordMinLength = 8
)

type User struct {
	ActivationToken          *string
	CreatedAt                time.Time
	Email                    string
	EmailVerificationToken   *string
	Id                       uint64
	IsActive                 bool
	IsEmailVerified          bool
	IsOrganizationOwner      bool
	LastAccessTokenCreatedAt *time.Time
	Name                     string
	Organization             Organization
	OrganizationId           uint64
	Password                 *string
	PasswordResetToken       *string
	UpdatedAt                time.Time
}
