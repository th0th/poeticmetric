import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "~/components/App";

export function render(path: string) {
  const html = renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );

  return { html };
}
