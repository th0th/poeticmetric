import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { baseURL } from "~/lib/base";
import routes from "~/routes";

export async function render(path: string) {
  const { dataRoutes, query } = createStaticHandler(routes);
  const req = new Request(`${baseURL}${path}`);
  const context = await query(req);

  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);
  const helmetContext: { helmet?: any } = {};

  const body = renderToString((
    <HelmetProvider context={helmetContext}>
      <StaticRouterProvider context={context} router={router} />
    </HelmetProvider>
  ));

  const helmet = helmetContext?.helmet;

  const head = [
    helmet.title.toString(),
    helmet.priority.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join("");

  return { body, head };
}
