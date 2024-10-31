import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { Router } from "wouter";
import App from "~/components/App";
import AppErrorBoundary from "~/components/AppErrorBoundary";

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const body = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <AppErrorBoundary>
          <Router base={import.meta.env.VITE_BASE_PATH} ssrPath={url}>
            <App />
          </Router>
        </AppErrorBoundary>
      </HelmetProvider>
    </StrictMode>,
  );

  const helmet = helmetContext?.helmet;

  const head = [
    helmet?.title.toString(),
    helmet?.priority.toString(),
    helmet?.meta.toString(),
    helmet?.link.toString(),
    helmet?.script.toString(),
  ].join("");

  return { body, head };
}
