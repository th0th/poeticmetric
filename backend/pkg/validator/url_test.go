package validator

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestUrl(t *testing.T) {
	type args struct {
		v string
	}
	tests := []struct {
		args args
		want bool
	}{
		{args: args{v: "https://www.poeticmetric.com"}, want: true},
		{args: args{v: "https://www.webgazer.io"}, want: true},
		{args: args{v: "google.com"}, want: false},
		{args: args{v: "randomstuff"}, want: false},
		{args: args{v: "randomstuff.net"}, want: false},
	}
	for _, tt := range tests {
		t.Run(tt.args.v, func(t *testing.T) {
			assert.Equalf(t, tt.want, Url(tt.args.v), "Url(%v)", tt.args.v)
		})
	}
}
