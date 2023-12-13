import { Routes } from "./Routes";

type Match = {
  path: string;
  parameters: { [key: string]: string };
  element: JSX.Element;
};

const doMatchRoute: (routes: Routes, path: string[], parameters: { [key: string]: string }) => Promise<Match | undefined> = async (
  routes,
  path,
  parameters
) => {
  for (let r of routes) {
    const rPath = r.path.split("/").filter(e => e != "");

    if ((r.routes && rPath.length <= path.length) || rPath.length == path.length) {
      if (rPath.every((e, i) => e.startsWith(":") || e == path[i])) {
        parameters = {
          ...parameters,
          ...Object.fromEntries(rPath.filter(e => e.startsWith(":")).map((e, i) => [e.substring(1), decodeURIComponent(path[i])]))
        };
        let subRoute = r.routes ? await doMatchRoute(r.routes, path.slice(rPath.length), parameters) : undefined;
        return r.component ? { element: await r.component!({ ...parameters, children: subRoute?.element }), path: "", parameters: {} } : subRoute;
      }
    }
  }
  return undefined;
};

export const matchRoute: (routes: Routes, path: string) => Promise<Match | undefined> = async (routes, path) => {
  return await doMatchRoute(
    routes,
    path.split("/").filter(e => e != ""),
    {}
  );
};
