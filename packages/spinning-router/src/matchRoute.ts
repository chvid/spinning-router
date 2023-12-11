import { Routes } from "./Routes";

const doMatchRoute: (routes: Routes, path: string[], parameters: { [key: string]: string }) => Promise<JSX.Element | undefined> = async (
  routes,
  path,
  parameters
) => {
  for (let r of routes) {
    const rPath = r.path.split("/").filter(e => e != "");

    if ((r.routes && rPath.length <= path.length) || rPath.length == path.length) {
      if (rPath.every((e, i) => e.startsWith(":") || e == path[i])) {
        const newParameters = Object.fromEntries(rPath.filter(e => e.startsWith(":")).map((e, i) => [e.substring(1), decodeURIComponent(path[i])]));
        let children = r.routes ? await doMatchRoute(r.routes, path.slice(rPath.length), { ...parameters, ...newParameters }) : undefined;
        return r.component ? await r.component!({ ...parameters, ...newParameters, children }) : children;
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
