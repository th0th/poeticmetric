package poeticmetric

import (
	"context"
	"time"
)

const (
	OrganizationDeletionDetailMaxLength = 1000
	OrganizationDeletionDetailMinLength = 2
)

type AuthenticationService interface {
	ServiceWithPostgres

	ChangeUserPassword(ctx context.Context, userID uint, params *ChangeUserPasswordParams) error
	CreateUserAccessToken(ctx context.Context, userID uint) (*AuthenticationUserAccessToken, error)
	DeleteOrganization(ctx context.Context, organizationID uint, params *OrganizationDeletionParams) error
	DeleteUserAccessToken(ctx context.Context, userAccessTokenID uint) error
	ListOrganizationDeletionReasons(ctx context.Context) ([]*OrganizationDeletionReason, error)
	ReadOrganization(ctx context.Context, organizationID uint) (*AuthenticationOrganization, error)
	ReadUser(ctx context.Context, userID uint) (*AuthenticationUser, error)
	ReadUserAccessToken(ctx context.Context, userAccessTokenID uint) (*AuthenticationUserAccessToken, error)
	ReadUserByEmailPassword(ctx context.Context, email string, password string) (*User, error)
	ReadUserByUserAccessToken(ctx context.Context, token string) (*User, *UserAccessToken, error)
	ResetUserPassword(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmail(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
	UpdateOrganization(ctx context.Context, organizationID uint, params *UpdateOrganizationParams) error
	UpdateUser(ctx context.Context, userID uint, params *UpdateAuthenticationUserParams) error
	ValidateUserPasswordResetToken(ctx context.Context, token string) (bool, error)
}

type AuthenticationOrganization struct {
	Name string `json:"name"`
}

type AuthenticationUser struct {
	CreatedAt           time.Time `json:"createdAt"`
	Email               string    `json:"email"`
	ID                  uint      `json:"id"`
	IsEmailVerified     bool      `json:"isEmailVerified"`
	IsOrganizationOwner bool      `json:"isOrganizationOwner"`
	Name                string    `json:"name"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

type AuthenticationUserAccessToken struct {
	CreatedAt time.Time `json:"createdAt"`
	ID        uint      `json:"id"`
	Token     string    `json:"token"`
}

type ChangeUserPasswordParams struct {
	NewPassword  *string `json:"newPassword"`
	NewPassword2 *string `json:"newPassword2"`
}

type OrganizationDeletionParams struct {
	Detail *string `json:"detail"`
	Reason *string `json:"reason"`
}

type OrganizationDeletionReason struct {
	DetailTitle *string `json:"detailTitle"`
	Order       int     `json:"order"`
	Reason      string  `json:"reason"`
}

type SendUserPasswordRecoveryEmailParams struct {
	Email *string `json:"email"`
}

type ResetUserPasswordParams struct {
	PasswordResetToken *string
	UserPassword       *string
	UserPassword2      *string
}

type UpdateAuthenticationUserParams struct {
	Name *string `json:"name"`
}

type UpdateOrganizationParams struct {
	Name *string `json:"name"`
}

func (o *AuthenticationOrganization) TableName() string {
	return "organizations"
}

func (*AuthenticationUserAccessToken) TableName() string {
	return "user_access_tokens"
}
