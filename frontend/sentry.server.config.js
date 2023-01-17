import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_ENABLED === "true") {
  Sentry.init({
    tracesSampleRate: 1.0,
  });
}
