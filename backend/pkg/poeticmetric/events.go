package poeticmetric

import (
	"context"
	"time"
)

type CreateEventParams struct {
	DateTime        time.Time
	DurationSeconds *uint32 `json:"d"`
	ID              string  `json:"i"`
	IPAddress       string
	Kind            *EventKind `json:"k"`
	Locale          *string    `json:"l"`
	Referrer        *string    `json:"r"`
	TimeZone        *string    `json:"t"`
	URL             *string    `json:"u"`
	UserAgent       string
}

type EventService interface {
	ServiceWithPostgres

	Create(ctx context.Context, payload *CreateEventParams) error
	OrganizationSalt(ctx context.Context, organizationID uint) (string, error)
}
