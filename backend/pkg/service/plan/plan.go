package plan

type Plan struct {
	MaxEventsPerMonth *uint64 `json:"maxEventsPerMonth"`
	MaxUsers          *uint64 `json:"maxUsers"`
	Name              string  `json:"name"`
}
