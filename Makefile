TEST_ENV_FILE := ".env.example"

test:
	@export COMPOSE_PROJECT_NAME=poeticmetric-test

	@# prepare Postgres database
	@printf "Waiting for Postgres...\n"
	@docker compose --env-file $(TEST_ENV_FILE) run --rm --entrypoint 'bash -c "wait-for-it -s -q "$${POSTGRES_HOST}":"$${POSTGRES_PORT}" -- echo \"Postgres is ready!\""' rest-api 2> /dev/null
	@docker compose --env-file $(TEST_ENV_FILE) exec -- postgres bash -c 'export PGPASSWORD=$${POSTGRES_PASSWORD} && dropdb --if-exists --username=$${POSTGRES_USER} $${POSTGRES_DB}'
	@docker compose --env-file $(TEST_ENV_FILE) exec -- postgres bash -c 'export PGPASSWORD=$${POSTGRES_PASSWORD} && createdb --username=$${POSTGRES_USER} $${POSTGRES_DB}'
	@docker compose --env-file $(TEST_ENV_FILE) run --rm rest-api migrate-postgres up 2> /dev/null

	@# prepare ClickHouse database
	@printf "Waiting for ClickHouse...\n"
	@docker compose --env-file $(TEST_ENV_FILE) run --rm --entrypoint 'bash -c "wait-for-it -s -q "$${CLICKHOUSE_HOST}":"$${CLICKHOUSE_TCP_PORT}" -- echo \"ClickHouse is ready!\""' rest-api 2> /dev/null
	@docker compose --env-file $(TEST_ENV_FILE) exec -- clickhouse bash -c 'clickhouse-client --query "drop database if exists $${CLICKHOUSE_DB};"'
	@docker compose --env-file $(TEST_ENV_FILE) exec -- clickhouse bash -c 'clickhouse-client --query "create database $${CLICKHOUSE_DB};"'
	@docker compose --env-file $(TEST_ENV_FILE) run --rm rest-api migrate-clickhouse up 2> /dev/null

	@# run tests
	@docker compose --env-file $(TEST_ENV_FILE) run --rm rest-api run-tests ./... 2> /dev/null

	@# drop Postgres database
	@docker compose --env-file $(TEST_ENV_FILE) exec -- postgres bash -c 'export PGPASSWORD=$${POSTGRES_PASSWORD} && dropdb --if-exists --username=$${POSTGRES_USER} $${POSTGRES_DB}'

	@# drop ClickHouse database
	@docker compose --env-file $(TEST_ENV_FILE) exec -- clickhouse bash -c 'clickhouse-client --query "drop database if exists $${CLICKHOUSE_DB};"'

	@docker compose --env-file $(TEST_ENV_FILE) down -v 2> /dev/null

test-build:
	@docker compose --env-file $(TEST_ENV_FILE) build 2> /dev/null
