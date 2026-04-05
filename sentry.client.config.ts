// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://59acec076b7a0d52a148efd9805ac281@o4510321171562496.ingest.us.sentry.io/4511118781251584",

  // ✅ Mover tracePropagationTargets aquí (al nivel raíz)
  tracePropagationTargets: ["localhost", /^https:\/\/tratolibre\.vercel\.app/],

  // ✅ Configuración de samples
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0,

  debug: false,

  beforeSend(event) {
    if (process.env.NODE_ENV !== "production") {
      return null;
    }
    return event;
  },

  integrations: [
    Sentry.browserTracingIntegration(), // Ya no lleva tracePropagationTargets aquí
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
