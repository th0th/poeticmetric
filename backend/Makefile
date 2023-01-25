DEVELOPMENT_ENV_FILE := ".env.development"
TEST_ENV_FILE := ".env.test"

build:
	@go mod tidy
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) build

clickhouse-migrate-down: clickhouse-wait
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) run --rm rest-api migrate-clickhouse down --all 2> /dev/null

clickhouse-migrate-up: clickhouse-wait
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) run --rm rest-api migrate-clickhouse up 2> /dev/null

clickhouse-wait:
	@printf "Waiting for ClickHouse...\n"
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) run --rm --entrypoint 'bash -c "wait-for-it -s -q "$${POETICMETRIC_CLICKHOUSE_HOST}":"$${POETICMETRIC_CLICKHOUSE_TCP_PORT}" -- echo \"ClickHouse is ready!\""' rest-api 2> /dev/null

down:
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) down 2> /dev/null

migrate-up: postgres-migrate-up clickhouse-migrate-up

postgres-migrate-down: postgres-wait
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) run --rm rest-api migrate-postgres down --all 2> /dev/null

postgres-migrate-up: postgres-wait
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) run --rm rest-api migrate-postgres up 2> /dev/null

postgres-wait:
	@printf "Waiting for Postgres...\n"
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) run --rm --entrypoint 'bash -c "wait-for-it -s -q "$${POETICMETRIC_POSTGRES_HOST}":"$${POETICMETRIC_POSTGRES_PORT}" -- echo \"Postgres is ready!\""' rest-api 2> /dev/null

test: test-run test-postgres-drop-database test-clickhouse-drop-database test-down

test-build:
	@go mod tidy
	@docker compose --env-file $(TEST_ENV_FILE) build 2> /dev/null

test-clickhouse-create-database: test-clickhouse-wait
	@docker compose --env-file $(TEST_ENV_FILE) exec -- clickhouse bash -c 'clickhouse-client --query "create database $${CLICKHOUSE_DB};"'

test-clickhouse-drop-database: test-clickhouse-wait
	@docker compose --env-file $(TEST_ENV_FILE) exec -- clickhouse bash -c 'clickhouse-client --query "drop database if exists $${CLICKHOUSE_DB};"'

test-clickhouse-migrate-database: test-clickhouse-wait
	@docker compose --env-file $(TEST_ENV_FILE) run --rm rest-api migrate-clickhouse up 2> /dev/null

test-clickhouse-prepare: test-clickhouse-drop-database test-clickhouse-create-database test-clickhouse-migrate-database

test-clickhouse-wait:
	@printf "Waiting for ClickHouse...\n"
	@docker compose --env-file $(TEST_ENV_FILE) run --rm --entrypoint 'bash -c "wait-for-it -s -q "$${POETICMETRIC_CLICKHOUSE_HOST}":"$${POETICMETRIC_CLICKHOUSE_TCP_PORT}" -- echo \"ClickHouse is ready!\""' rest-api 2> /dev/null

test-down:
	@docker compose --env-file $(TEST_ENV_FILE) down -v 2> /dev/null

test-postgres-create-database: test-postgres-wait
	@docker compose --env-file $(TEST_ENV_FILE) exec -- postgres bash -c 'export PGPASSWORD=$${POETICMETRIC_POSTGRES_PASSWORD} && createdb --username=$${POSTGRES_USER} $${POSTGRES_DB}'

test-postgres-drop-database: test-postgres-wait
	@docker compose --env-file $(TEST_ENV_FILE) exec -- postgres bash -c 'export PGPASSWORD=$${POETICMETRIC_POSTGRES_PASSWORD} && dropdb --if-exists --username=$${POSTGRES_USER} $${POSTGRES_DB}'

test-postgres-migrate-database: test-postgres-wait
	@docker compose --env-file $(TEST_ENV_FILE) run --rm rest-api migrate-postgres up 2> /dev/null

test-postgres-prepare: test-postgres-drop-database test-postgres-create-database test-postgres-migrate-database

test-prepare: test-postgres-prepare test-clickhouse-prepare

test-run: test-prepare
	@docker compose --env-file $(TEST_ENV_FILE) run --rm rest-api run-tests ./... 2> /dev/null

test-postgres-wait:
	@printf "Waiting for Postgres...\n"
	@docker compose --env-file $(TEST_ENV_FILE) run --rm --entrypoint 'bash -c "wait-for-it -s -q "$${POETICMETRIC_POSTGRES_HOST}":"$${POETICMETRIC_POSTGRES_PORT}" -- echo \"Postgres is ready!\""' rest-api 2> /dev/null

up:
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) up -d

up-ingress:
	@docker compose --env-file $(DEVELOPMENT_ENV_FILE) up -d ingress
