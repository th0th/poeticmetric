package user

type User struct {
	Email               string `json:"email"`
	Id                  uint64 `json:"id"`
	IsOrganizationOwner bool   `json:"isOrganizationOwner"`
	Name                string `json:"name"`
}
