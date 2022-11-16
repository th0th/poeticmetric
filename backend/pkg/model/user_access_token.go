package model

import (
	"fmt"
	"time"
)

type UserAccessToken struct {
	CreatedAt  time.Time `gorm:"not null"`
	Id         uint64    `gorm:"primaryKey"`
	LastUsedAt *time.Time
	Token      string `gorm:"not null"`
	User       User   `gorm:"constraint:OnDelete:CASCADE"`
	UserId     uint64 `gorm:"not null"`
}

const UserAccessTokenLastUsedAtPrefix = "userAccessTokenLastUsedAt"

func (t *UserAccessToken) LastUsedAtRedisKey() string {
	return fmt.Sprintf("%s:%d", UserAccessTokenLastUsedAtPrefix, t.Id)
}
