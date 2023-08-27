package toast

import (
	"encoding/json"

	"github.com/dchest/uniuri"
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	sm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/session"
)

type Variant = string

type Toast struct {
	Body    string
	Id      string
	Variant Variant
}

type Toasts []*Toast

type Input struct {
	Body    string
	Variant Variant
}

const (
	VariantDanger  Variant = "DANGER"
	VariantSuccess Variant = "SUCCESS"
)

const (
	LocalsKey  = "Toasts"
	SessionKey = "toasts"
)

func Add(c *fiber.Ctx, input *Input) {
	toasts := Get(c)

	toasts = append(toasts, &Toast{
		Body:    input.Body,
		Id:      uniuri.New(),
		Variant: input.Variant,
	})

	Set(c, toasts)
}

func Clear(c *fiber.Ctx) {
	s := sm.Get(c)

	s.Delete(SessionKey)

	err := s.Save()
	if err != nil {
		panic(errors.Wrap(err, 0))
	}
}

func Get(c *fiber.Ctx) Toasts {
	s := sm.Get(c)

	toasts := Toasts{}

	sessionToastsJson := s.Get(SessionKey)

	if sessionToastsJson != nil {
		err := json.Unmarshal([]byte(sessionToastsJson.(string)), &toasts)
		if err != nil {
			panic(errors.Wrap(err, 0))
		}
	}

	return toasts
}

func Set(c *fiber.Ctx, toasts Toasts) {
	SetInLocals(c, toasts)
	SetInSession(c, toasts)
}

func SetInLocals(c *fiber.Ctx, toasts Toasts) {
	c.Locals(LocalsKey, toasts)
}

func SetInSession(c *fiber.Ctx, toasts Toasts) {
	toastsJson, err := json.Marshal(toasts)
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	s := sm.Get(c)

	s.Set(SessionKey, string(toastsJson))

	err = s.Save()
	if err != nil {
		panic(errors.Wrap(err, 0))
	}
}
