package validator

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestDomain(t *testing.T) {
	assert.True(t, Domain("poeticmetric.com"))
	assert.True(t, Domain("www.poeticmetric.com"))
	assert.True(t, Domain("status.poeticmetric.com"))
	assert.True(t, Domain("status2.poeticmetric.com"))
	assert.False(t, Domain("poeticmetric"))
	assert.False(t, Domain("io"))
	assert.False(t, Domain("webgazer."))
	assert.False(t, Domain(".webgazer"))
	assert.False(t, Domain("no-reply@poeticmetric.com"))
}
