package model

import (
	"fmt"
	"time"

	"github.com/dchest/uniuri"
)

type UserSessionToken struct {
	CreatedAt  time.Time
	Id         uint
	LastUsedAt *time.Time
	Token      string
	User       User
	UserId     uint
}

const UserSessionTokenLastUsedAtPrefix = "userSessionTokenLastUsedAt"

func (t *UserSessionToken) LastUsedAtRedisKey() string {
	return fmt.Sprintf("%s:%d", UserSessionTokenLastUsedAtPrefix, t.Id)
}

func (t *UserSessionToken) SetToken() {
	t.Token = uniuri.NewLen(36)
}
