package poeticmetric

import (
	"context"
	"time"
)

type AuthenticationService interface {
	ServiceWithPostgres

	CreateUserAccessToken(ctx context.Context, userID uint) (*AuthenticationServiceUserAccessToken, error)
	ReadUserAccessToken(ctx context.Context, userAccessTokenID uint) (*AuthenticationServiceUserAccessToken, error)
	ReadUserByEmailPassword(ctx context.Context, email string, password string) (*User, error)
	ReadUserByUserAccessToken(ctx context.Context, token string) (*User, *UserAccessToken, error)
}

type AuthenticationServiceUserAccessToken struct {
	CreatedAt time.Time `json:"createdAt"`
	ID        uint      `json:"id"`
	Token     string    `json:"token"`
}

func (*AuthenticationServiceUserAccessToken) TableName() string {
	return "user_access_tokens"
}
