package poeticmetric

import (
	"context"
)

type TrackingService interface {
	GetScript(ctx context.Context) ([]byte, error)
}
