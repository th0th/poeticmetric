CREATE TABLE "events" (
  "browser_name" Nullable(String),
  "browser_version" Nullable(String),
  "country_iso_code" Nullable(String),
  "date_time" DateTime,
  "device_type" Nullable(String),
  "duration" UInt32,
  "id" UUID,
  "is_bot" UInt8,
  "kind" String,
  "language" Nullable(String),
  "locale" Nullable(String),
  "operating_system_name" Nullable(String),
  "operating_system_version" Nullable(String),
  "referrer" Nullable(String),
  "site_id" UInt64,
  "time_zone" Nullable(String),
  "url" String,
  "user_agent" String,
  "utm_campaign" Nullable(String),
  "utm_content" Nullable(String),
  "utm_medium" Nullable(String),
  "utm_source" Nullable(String),
  "utm_term" Nullable(String),
  "visitor_id" String
) ENGINE = ReplacingMergeTree("duration")
    ORDER BY ("site_id", "id")
    SETTINGS index_granularity = 8192;

CREATE TABLE "events_buffer" AS "events"
  ENGINE = Buffer(currentDatabase(), "events", 16, 10, 100, 10000, 1000000, 10000000, 100000000);
