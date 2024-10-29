package analytics

import (
	"context"

	"github.com/pkg/errors"
)

type BootstrapService interface {
	ServiceWithPostgres

	Check(ctx context.Context) error
	Run(ctx context.Context, params *BootstrapServiceRunParams) (*User, error)
}

type BootstrapServiceRunParams struct {
	CreateDemoSite   *bool
	OrganizationName *string
	UserEmail        *string
	UserName         *string
	UserPassword     *string
	UserPassword2    *string
}

var (
	BootstrapServiceErrAlreadyDone = errors.New("bootstrap is already done")
)
