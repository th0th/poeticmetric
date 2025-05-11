import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, matchRoutes, RouterProvider } from "react-router";
import routes from "~/routes";

const rootElement = document.getElementById("root");

const lazyMatches = matchRoutes(routes, window.location)?.filter((m) => m.route.lazy);

async function fulfillLazyRoutes() {
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = m.route.lazy !== undefined && typeof m.route.lazy === "function" ? await m.route.lazy() : {};

        Object.assign(m.route, { ...routeModule, lazy: undefined });
      }),
    );
  }
}

if (rootElement) {
  fulfillLazyRoutes().then(() => {
    const router = createBrowserRouter(routes);

    hydrateRoot(rootElement, (
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    ));
  });
}


