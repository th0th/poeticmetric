ALTER TABLE "organizations"
  ADD COLUMN "google_oauth_refresh_token" text;

ALTER TABLE "sites"
  ADD COLUMN "google_search_console_site_url" text;
