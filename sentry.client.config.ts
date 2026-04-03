// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://59acec076b7a0d52a148efd9805ac281@o4510321171562496.ingest.us.sentry.io/4511118781251584",
  tracesSampleRate: 1.0,
  debug: false,
});
