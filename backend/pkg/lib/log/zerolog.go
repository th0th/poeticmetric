package log

import (
	"strconv"

	"github.com/go-errors/errors"
	"github.com/rs/zerolog"
)

var (
	StackSourceFileName     = "source"
	StackSourceLineName     = "line"
	StackSourceFunctionName = "func"
)

// MarshalStack implements go-errors stack trace marshaling.
//
// zerolog.ErrorStackMarshaler = MarshalStack
func MarshalStack(err error) interface{} {
	var wrappedErr *errors.Error
	ok := errors.As(err, &wrappedErr)
	if !ok {
		return nil
	}

	st := wrappedErr.StackFrames()
	out := make([]map[string]string, 0, len(st))
	for _, frame := range st {
		out = append(out, map[string]string{
			StackSourceFileName:     frame.File,
			StackSourceLineName:     strconv.Itoa(frame.LineNumber),
			StackSourceFunctionName: frame.Name,
		})
	}

	return out
}

func LogSetDefaults() {
	zerolog.ErrorStackMarshaler = MarshalStack
}

