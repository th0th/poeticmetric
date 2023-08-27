package signal

import (
	"log"
	"os"
	"os/signal"
	"syscall"
)

func RunAndExit(f func() int) {
	signals := make(chan os.Signal, 1)

	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	receivedSignal := <-signals

	log.Printf("Received %s signal. Signing off.", receivedSignal.String())

	os.Exit(f())
}
