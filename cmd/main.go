package cmd

import (
	"os"

	"github.com/go-errors/errors"
	"github.com/rs/zerolog"
)

func LogPanic(err error, message string) {
	Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg(message)
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
