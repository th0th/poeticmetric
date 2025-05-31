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

	ActivateUser(ctx context.Context, params *ActivateUserParams) error
	ChangeUserPassword(ctx context.Context, userID uint, params *ChangeUserPasswordParams) error
	CreateUserAccessToken(ctx context.Context, userID uint) (*AuthenticationUserAccessToken, error)
	DeleteUserAccessToken(ctx context.Context, userAccessTokenID uint) error
	ReadUser(ctx context.Context, userID uint) (*AuthenticationUser, error)
	ReadUserAccessToken(ctx context.Context, userAccessTokenID uint) (*AuthenticationUserAccessToken, error)
	ReadUserByEmailPassword(ctx context.Context, email string, password string) (*User, error)
	ReadUserByUserAccessToken(ctx context.Context, token string) (*User, *UserAccessToken, error)
	ResendUserEmailAddressVerificationEmail(ctx context.Context, userID uint) error
	ResetUserPassword(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmail(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
	SignUp(ctx context.Context, params *SignUpParams) (*AuthenticationUser, error)
	UpdateUser(ctx context.Context, userID uint, params *UpdateAuthenticationUserParams) error
	ValidateUserPasswordResetToken(ctx context.Context, token string) (bool, error)
	VerifyUserEmailAddress(ctx context.Context, userID uint, params *VerifyUserEmailAddressParams) error
}

type ActivateUserParams struct {
	ActivationToken *string `json:"activationToken"`
	Name            *string `json:"name"`
	NewPassword     *string `json:"newPassword"`
	NewPassword2    *string `json:"newPassword2"`
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

type SendUserPasswordRecoveryEmailParams struct {
	Email *string `json:"email"`
}

type SignUpParams struct {
	OrganizationName     *string `example:"PoeticMetric" json:"organizationName"`
	OrganizationTimeZone *string `example:"UTC" json:"organizationTimeZone"`
	UserEmail            *string `example:"user@poeticmetric.com" json:"userEmail"`
	UserName             *string `example:"Name Surname" json:"userName"`
	UserPassword         *string `json:"userPassword"`
}

type ResetUserPasswordParams struct {
	PasswordResetToken *string
	UserPassword       *string
	UserPassword2      *string
}

type UpdateAuthenticationUserParams struct {
	Name *string `json:"name"`
}

type VerifyUserEmailAddressParams struct {
	UserEmailVerificationCode *string `json:"userEmailVerificationCode"`
}

func (*PlanResponse) TableName() string {
	return "plans"
}

func (*AuthenticationUserAccessToken) TableName() string {
	return "user_access_tokens"
}
