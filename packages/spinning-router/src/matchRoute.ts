import { Routes } from "./Routes";

type Match = {
  path: string;
  parameters: { [key: string]: string };
  element: JSX.Element;
};

const doMatchRoute: (routes: Routes, querySplitted: string[], parameters: { [key: string]: string }) => Promise<Match | undefined> = async (
  routes,
  querySplitted,
  parameters
) => {
  for (let r of routes) {
    const pathSplitted = r.path.split("/").filter(e => e != "");

    if ((r.routes && pathSplitted.length <= querySplitted.length) || pathSplitted.length == querySplitted.length) {
      if (pathSplitted.every((e, i) => e.startsWith(":") || e == querySplitted[i])) {
        parameters = {
          ...parameters,
          ...Object.fromEntries(pathSplitted.filter(e => e.startsWith(":")).map((e, i) => [e.substring(1), decodeURIComponent(querySplitted[i])]))
        };

        if (r.routes) {
          let subRoute = await doMatchRoute(r.routes, querySplitted.slice(pathSplitted.length), parameters);
          return {
            element: r.component ? await r.component({ ...parameters, children: subRoute.element }) : subRoute.element,
            path: r.path + "/" + subRoute.path,
            parameters: subRoute.parameters
          };
        } else {
          return {
            element: r.component ? await r.component({ ...parameters }) : undefined,
            path: r.path,
            parameters
          };
        }
      }
    }
  }
  return undefined;
};

export const matchRoute: (routes: Routes, query: string) => Promise<Match | undefined> = async (routes, query) => {
  return await doMatchRoute(
    routes,
    query.split("/").filter(e => e != ""),
    {}
  );
};
