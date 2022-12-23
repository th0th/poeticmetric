package model

import "time"

const (
	UserNameMaxLength = 70
	UserNameMinLength = 1
	UserPasswordMaxLength = 128
	UserPasswordMinLength = 8
)

type User struct {
	CreatedAt                time.Time `gorm:"not null"`
	Email                    string    `gorm:"not null;uniqueIndex"`
	EmailVerificationToken   *string   `gorm:"unique"`
	Id                       uint64    `gorm:"primaryKey"`
	IsEmailVerified          bool      `gorm:"not null"`
	IsOrganizationOwner      bool      `gorm:"not null"`
	LastAccessTokenCreatedAt *time.Time
	Name                     string       `gorm:"not null"`
	Organization             Organization `gorm:"constraint:OnDelete:CASCADE"`
	OrganizationId           uint64       `gorm:"not null"`
	Password                 string       `gorm:"not null"`
	PasswordResetToken       *string      `gorm:"unique"`
	UpdatedAt                time.Time    `gorm:"not null"`
}
