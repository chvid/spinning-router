import { Routes } from "./Routes";

type Parameters = { [key: string]: any };

const doMatchRoute: (routes: Routes, path: string[], parentParameters: Parameters) => Promise<JSX.Element> = async (routes, path, parentParameters) => {
  for (let r of routes) {
    const rPath = r.path.split("/").filter(e => e != "");

    if ((r.routes && rPath.length <= path.length) || rPath.length == path.length) {
      let parameters = { ...parentParameters } as Parameters;
      let match = true;
      for (let i in rPath) {
        if (rPath[i].startsWith(":")) {
          parameters[rPath[i].substring(1)] = path[i];
        } else {
          if (rPath[i] != path[i]) {
            match = false;
          }
        }
      }

      if (match) {
        let children = undefined;
        if (r.routes) {
          children = await doMatchRoute(r.routes, path.slice(rPath.length), parameters);
        }
        if (r.component) {
          return await r.component!({ ...parameters, children });
        } else {
          if (children) {
            return children;
          }
        }
      }
    }
  }
  throw "Not Found";
};

export const matchRoute: (routes: Routes, path: string) => Promise<JSX.Element | undefined> = async (routes, path) => {
  try {
    return await doMatchRoute(
      routes,
      path.split("/").filter(e => e != ""),
      {}
    );
  } catch (error) {
    if (error == "Not Found") {
      return undefined;
    } else {
      throw error;
    }
  }
};
