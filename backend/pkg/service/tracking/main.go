package tracking

import (
	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/js"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	EnvService poeticmetric.EnvService
}

type service struct {
	envService poeticmetric.EnvService
	minify     *minify.M
}

func New(params NewParams) poeticmetric.TrackingService {
	m := minify.New()
	m.AddFunc("text/javascript", js.Minify)

	return &service{
		envService: params.EnvService,
		minify:     m,
	}
}
