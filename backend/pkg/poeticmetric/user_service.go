package poeticmetric

import (
	"context"
	"time"
)

type UserService interface {
	ServiceWithPostgres

	InviteOrganizationUser(ctx context.Context, organizationID uint, params *InviteOrganizationUserParams) (*OrganizationUser, error)
	ListOrganizationUsers(ctx context.Context, organizationID uint) ([]*OrganizationUser, error)
	ReadOrganizationUser(ctx context.Context, userID uint) (*OrganizationUser, error)
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

func (u *OrganizationUser) TableName() string {
	return "users"
}
