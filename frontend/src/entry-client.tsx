import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";
import App from "~/components/App";
import AppErrorBoundary from "~/components/AppErrorBoundary";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <HelmetProvider>
      <AppErrorBoundary>
        <Router>
          <App />
        </Router>
      </AppErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
