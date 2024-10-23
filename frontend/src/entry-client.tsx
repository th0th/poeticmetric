import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { Router } from "wouter";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <Router base={import.meta.env.VITE_BASE_PATH}>
      <App />
    </Router>
  </StrictMode>,
);
