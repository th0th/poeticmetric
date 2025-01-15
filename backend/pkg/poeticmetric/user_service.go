package poeticmetric

import (
	"context"
	"time"
)

type UserService interface {
	ServiceWithPostgres

	ListOrganizationUsers(ctx context.Context, organizationID uint) ([]*OrganizationUser, error)
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

func (u *OrganizationUser) TableName() string {
	return "users"
}
