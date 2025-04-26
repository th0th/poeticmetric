CREATE TABLE logs (
  data jsonb,
  date_time timestamptz NOT NULL,
  id bigserial PRIMARY KEY,
  kind text NOT NULL
);
