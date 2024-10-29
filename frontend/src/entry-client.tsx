import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";
import App from "~/components/App";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <HelmetProvider>
      <Router base={import.meta.env.VITE_BASE_PATH}>
        <App />
      </Router>
    </HelmetProvider>
  </StrictMode>,
);
