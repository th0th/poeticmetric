package cmd

import (
	"os"

	"github.com/rs/zerolog"
)

func LogPanic(err error, message string) {
	Logger.Panic().Stack().Err(err).Msg(message)
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
