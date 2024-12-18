package poeticmetric

import (
	"context"
	"time"
)

type AuthenticationService interface {
	ServiceWithPostgres

	CreateUserAccessToken(ctx context.Context, userID uint) (*AuthenticationUserAccessToken, error)
	DeleteUserAccessToken(ctx context.Context, userAccessTokenID uint) error
	ReadUserAccessToken(ctx context.Context, userAccessTokenID uint) (*AuthenticationUserAccessToken, error)
	ReadUserByEmailPassword(ctx context.Context, email string, password string) (*User, error)
	ReadUserByUserAccessToken(ctx context.Context, token string) (*User, *UserAccessToken, error)
	ResetUserPassword(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmail(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
	ValidateUserPasswordResetToken(ctx context.Context, token string) (bool, error)
}

type AuthenticationUserAccessToken struct {
	CreatedAt time.Time `json:"createdAt"`
	ID        uint      `json:"id"`
	Token     string    `json:"token"`
}

type SendUserPasswordRecoveryEmailParams struct {
	Email *string `json:"email"`
}

type ResetUserPasswordParams struct {
	PasswordResetToken *string
	UserPassword       *string
	UserPassword2      *string
}

func (*AuthenticationUserAccessToken) TableName() string {
	return "user_access_tokens"
}
