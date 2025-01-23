package site

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func TestNew(t *testing.T) {
	postgres := &gorm.DB{}
	mockValidationService := &poeticmetric.ValidationServiceMock{}

	type args struct {
		params NewParams
	}
	tests := []struct {
		name string
		args args
		want poeticmetric.SiteService
	}{
		{
			name: "successful",
			args: args{
				params: NewParams{
					Postgres:          postgres,
					ValidationService: mockValidationService,
				},
			},
			want: &service{
				postgres:          postgres,
				validationService: mockValidationService,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := New(tt.args.params)
			assert.Equal(t, tt.want, got)
		})
	}
}
