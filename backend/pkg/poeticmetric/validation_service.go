package poeticmetric

import (
	"context"
)

type ValidationService interface {
	ServiceWithPostgres

	AuthenticationResetUserPasswordParams(ctx context.Context, params *AuthenticationResetUserPasswordParams) error
	AuthenticationSendUserPasswordRecoveryEmailParams(ctx context.Context, params *AuthenticationSendUserPasswordRecoveryEmailParams) error
}

