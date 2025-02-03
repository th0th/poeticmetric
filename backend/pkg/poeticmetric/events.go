package poeticmetric

import (
	"context"
	"time"
)

type CreateEventParams struct {
	DateTime  time.Time
	Duration  *uint32 `json:"d"`
	ID        string  `json:"i"`
	IPAddress string
	Kind      *EventKind `json:"k"`
	Locale    *string    `json:"l"`
	Referrer  *string    `json:"r"`
	TimeZone  *string    `json:"t"`
	Url       *string    `json:"u"`
	UserAgent string
}

type EventService interface {
	Create(ctx context.Context, payload *CreateEventParams) error
}
