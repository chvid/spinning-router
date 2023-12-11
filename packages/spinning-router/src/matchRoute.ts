import { Routes } from "./Routes";

const doMatchRoute: (routes: Routes, path: string[], parameters: { [key: string]: string }) => Promise<JSX.Element | undefined> = async (
  routes,
  path,
  parameters
) => {
  for (let r of routes) {
    const rPath = r.path.split("/").filter(e => e != "");

    if ((r.routes && rPath.length <= path.length) || rPath.length == path.length) {
      let match = true;

      for (let i in rPath) {
        if (rPath[i].startsWith(":")) {
          parameters[rPath[i].substring(1)] = decodeURIComponent(path[i]);
        } else {
          if (rPath[i] != path[i]) {
            match = false;
          }
        }
      }

      if (match) {
        let children = r.routes ? await doMatchRoute(r.routes, path.slice(rPath.length), parameters) : undefined;
        return r.component ? await r.component!({ ...parameters, children }) : children;
      }
    }
  }
  return undefined;
};

export const matchRoute: (routes: Routes, path: string) => Promise<JSX.Element | undefined> = async (routes, path) => {
  return await doMatchRoute(
    routes,
    path.split("/").filter(e => e != ""),
    {}
  );
};
