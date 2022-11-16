package plan

type Plan struct {
	Id                       uint64  `json:"id"`
	IsLiveChatSupportEnabled bool    `json:"isLiveChatSupportEnabled"`
	MaxEventsPerMonth        *uint64 `json:"maxEventsPerMonth"`
	MaxUsers                 *uint64 `json:"maxUsers"`
	Name                     string  `json:"name"`
}
