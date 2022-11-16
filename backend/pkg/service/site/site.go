package site

import "time"

type Site struct {
	CreatedAt time.Time `json:"createdAt"`
	Domain    string    `json:"domain"`
	Id        uint64    `json:"id"`
	Name      string    `json:"name"`
	UpdatedAt time.Time `json:"updatedAt"`
}
