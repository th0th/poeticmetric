package poeticmetric

import (
	"context"
	"time"
)

type UserService interface {
	ServiceWithPostgres

	DeleteOrganizationUser(ctx context.Context, organizationID uint, userID uint) error
	InviteOrganizationUser(ctx context.Context, organizationID uint, params *InviteOrganizationUserParams) (*OrganizationUser, error)
	ListOrganizationUsers(ctx context.Context, organizationID uint) ([]*OrganizationUser, error)
	ReadOrganizationUser(ctx context.Context, organizationID uint, userID uint) (*OrganizationUser, error)
	UpdateOrganizationUser(ctx context.Context, organizationID uint, userID uint, params *UpdateOrganizationUserParams) error
}

type OrganizationUser struct {
	CreatedAt           time.Time `json:"createdAt"`
	Email               string    `json:"email"`
	ID                  uint64    `json:"id"`
	IsEmailVerified     bool      `json:"isEmailVerified"`
	IsOrganizationOwner bool      `json:"isOrganizationOwner"`
	Name                string    `json:"name"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

type InviteOrganizationUserParams struct {
	Email *string `json:"email"`
	Name  *string `json:"name"`
}

type UpdateOrganizationUserParams struct {
	Name *string `json:"name"`
}

func (u *OrganizationUser) TableName() string {
	return "users"
}
