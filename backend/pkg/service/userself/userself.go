package userself

import "time"

type UserSelf struct {
	CreatedAt           time.Time `json:"createdAt"`
	Email               string    `json:"email"`
	Id                  uint64    `json:"id"`
	IsEmailVerified     bool      `json:"isEmailVerified"`
	IsOrganizationOwner bool      `json:"isOrganizationOwner"`
	Name                string    `json:"name"`
	UpdatedAt           time.Time `json:"updatedAt"`
}
