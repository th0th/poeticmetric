import * as Sentry from "@sentry/nextjs";

if (!!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_STAGE,
    tracesSampleRate: 1.0,
  });
}
