import React, { useEffect, useState } from "react";

import { Location } from "./Location";

import { DefaultLoadingIndicator } from "./components/DefaultLoadingIndicator";
import { DefaultErrorPage } from "./components/DefaultErrorPage";
import { DefaultNotFoundPage } from "./components/DefaultNotFoundPage";
import { Routes } from "./Routes";
import { matchRoute } from "./matchRoute";

export const SpinningRouter: React.FC<{
  routes: Routes;
  errorPage?: React.FC<{ error: any }>;
  notFoundPage?: React.ComponentType;
  loadingIndicator?: React.ComponentType;
}> = ({ routes, errorPage = DefaultErrorPage, notFoundPage = DefaultNotFoundPage, loadingIndicator = DefaultLoadingIndicator }) => {
  const [path, setPath] = useState(() => location.hash.substring(1));
  const [match, setMatch] = useState("");
  const [element, setElement] = useState<any>(undefined);
  const [overlay, setOverlay] = useState<any>(undefined);
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  const invokeRoute = async (path: string) => {
    try {
      const match = await matchRoute(routes, path);
      if (match) {
        setMatch(match.path);
        setElement(match.element);
        setParameters(match.parameters);
      } else {
        setMatch("");
        window.scrollTo(0, 0);
        setElement(notFoundPage);
        setParameters({});
      }
    } catch (error) {
      setMatch("");
      window.scrollTo(0, 0);
      setElement(errorPage({ error }));
      setParameters({});
    }
  };
  const invokeRouteWithSpinner = async () => {
    const path = location.hash.substring(1);
    setOverlay(loadingIndicator);
    setPath(path);
    try {
      await invokeRoute(path);
      window.scrollTo(0, 0);
    } finally {
      setOverlay(undefined);
    }
  };
  useEffect(() => {
    invokeRouteWithSpinner();
  }, []);
  useEffect(() => {
    const updateHash = async () => {
      await invokeRouteWithSpinner();
    };
    const doSoftRefresh = async () => {
      await invokeRoute(location.hash.substring(1));
    };
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("softRefresh", doSoftRefresh);
    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("softRefresh", doSoftRefresh);
    };
  }, []);

  return (
    <Location.Provider value={{ path, match, parameters }}>
      {element}
      {overlay}
    </Location.Provider>
  );
};
