package main

import (
	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/internal/app/webapp"
	_ "github.com/th0th/poeticmetric/internal/env"
)

func main() {
	webApp := webapp.New()

	err := webApp.Run()
	if err != nil {
		panic(errors.Wrap(err, 0))
	}
}
