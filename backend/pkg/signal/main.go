package signal

import (
	"log"
	"os"
	"os/signal"
	"syscall"
)

func ExitWithSignal() {
	signals := make(chan os.Signal, 1)

	signal.Notify(signals, syscall.SIGINT, syscall.SIGKILL, syscall.SIGTERM)

	receivedSignal := <-signals

	log.Printf("Received %s signal. Signing off.", receivedSignal.String())
}