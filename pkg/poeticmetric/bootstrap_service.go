package poeticmetric

import (
	"context"
	"errors"
)

type BootstrapService interface {
	Check(ctx context.Context) error
	Done(ctx context.Context) (bool, error)
	Run(ctx context.Context, params *BootstrapServiceRunParams) (*User, error)
}

type BootstrapServiceRunParams struct {
	CreateDemoSite   bool
	OrganizationName string
	UserEmail        string
	UserName         string
	UserPassword     string
	UserPassword2    string
}

var (
	BootstrapServiceErrAlreadyDone = errors.New("already done")
)
