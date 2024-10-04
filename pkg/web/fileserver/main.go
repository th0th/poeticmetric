package fileserver

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/go-errors/errors"
)

func New() (http.Handler, error) {
	subFs, err := fs.Sub(files, "files")
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return http.FileServerFS(subFs), nil
}

//go:embed files/*
var files embed.FS
