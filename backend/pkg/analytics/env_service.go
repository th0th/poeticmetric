package analytics

type EnvService interface {
	BasePath() string
	IsHosted() bool
}

type EnvServiceVars struct {
	BasePath      string `env:"BASE_PATH" envDefault:"/"`
	DatabaseDebug bool   `env:"DATABASE_DEBUG" envDefault:"false"`
	Debug         bool   `env:"DEBUG" envDefault:"false"`

	// Postgres
	PostgresDatabase string `env:"POSTGRES_DATABASE,notEmpty,required"`
	PostgresHost     string `env:"POSTGRES_HOST,notEmpty,required"`
	PostgresPassword string `env:"POSTGRES_PASSWORD,notEmpty,required"`
	PostgresPort     int    `env:"POSTGRES_PORT,notEmpty,required"`
	PostgresUser     string `env:"POSTGRES_USER,notEmpty,required"`

	// RabbitMQ
	RabbitMqHost     string `env:"RABBITMQ_HOST,notEmpty,required"`
	RabbitMqPassword string `env:"RABBITMQ_PASSWORD,notEmpty,required"`
	RabbitMqPort     int    `env:"RABBITMQ_PORT,notEmpty,required"`
	RabbitMqUser     string `env:"RABBITMQ_USER,notEmpty,required"`
	RabbitMqVhost    string `env:"RABBITMQ_VHOST,notEmpty,required"`
}
