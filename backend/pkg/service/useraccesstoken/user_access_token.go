package useraccesstoken

import "time"

type UserAccessToken struct {
	CreatedAt time.Time `json:"createdAt"`
	Id        uint64    `json:"id"`
	Token     string    `json:"token"`
}
