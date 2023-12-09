import React, { useEffect, useState } from "react";

import { Location } from "./Location";

import { DefaultLoadingIndicator } from "./components/DefaultLoadingIndicator";
import { DefaultErrorPage } from "./components/DefaultErrorPage";
import { DefaultNotFoundPage } from "./components/DefaultNotFoundPage";
import { Routes } from "./Routes";

type Parameters = { [key: string]: any };

export const doMatchRoute: (routes: Routes, path: string[], parentParameters: Parameters) => Promise<JSX.Element> = async (routes, path, parentParameters) => {
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
          parameters["children"] = children;
          return r.component!(parameters);
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
    return doMatchRoute(
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

export const SpinningRouter: React.FC<{
  routes: Routes;
  errorPage?: React.FC<{ error: any }>;
  notFoundPage?: React.ComponentType;
  loadingIndicator?: React.ComponentType;
}> = ({ routes, errorPage = DefaultErrorPage, notFoundPage = DefaultNotFoundPage, loadingIndicator = DefaultLoadingIndicator }) => {
  const [hash, setHash] = useState(() => location.hash.substring(1));
  const [element, setElement] = useState<any>(undefined);
  const [overlay, setOverlay] = useState<any>(undefined);
  const invokeRoute = async (path: string) => {
    setOverlay(loadingIndicator);
    try {
      const element = await matchRoute(routes, path);
      setElement(element);
      if (element) {
        setElement(element);
      } else {
        setElement(notFoundPage);
      }
    } catch (error) {
      console.log(error);
      setElement(errorPage({ error }));
    } finally {
      setOverlay(undefined);
    }
  };
  useEffect(() => {
    invokeRoute(hash);
  }, []);
  useEffect(() => {
    const updateHash = async () => {
      setHash(location.hash.substring(1));
      await invokeRoute(location.hash.substring(1));
    };
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("softRefresh", updateHash);
    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("softRefresh", updateHash);
    };
  }, []);

  return (
    <Location.Provider value={hash}>
      {element}
      {overlay}
    </Location.Provider>
  );
};
