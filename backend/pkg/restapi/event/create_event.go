package event

import (
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/event"
	"github.com/poeticmetric/poeticmetric/backend/pkg/worker"
)

func createEvent(c *fiber.Ctx) error {
	dp := dm.Get(c)

	payload := &worker.CreateEventPayload{
		DateTime:  time.Now(),
		IpAddress: c.IP(),
		UserAgent: c.Get("user-agent"),
	}

	err := json.Unmarshal(c.Body(), payload)
	if err != nil {
		return err
	}

	err = event.ValidateCreatePayload(dp, payload)
	if err != nil {
		return err
	}

	if payload.Id == "" {
		payload.Id = uuid.NewString()
	}

	err = worker.CreateEvent(dp, payload)
	if err != nil {
		return err
	}

	return c.
		Status(fiber.StatusAccepted).
		JSON(map[string]string{
			"id": payload.Id,
		})
}
