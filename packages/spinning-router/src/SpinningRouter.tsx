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
  const [hash, setHash] = useState(() => location.hash.substring(1));
  const [element, setElement] = useState<any>(undefined);
  const [overlay, setOverlay] = useState<any>(undefined);
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  const invokeRoute = async (path: string) => {
    setOverlay(loadingIndicator);
    try {
      const match = await matchRoute(routes, path);
      if (match) {
        setElement(match.element);
        setParameters(match.parameters);
      } else {
        setElement(notFoundPage);
        setParameters({});
      }
    } catch (error) {
      setElement(errorPage({ error }));
      setParameters({});
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
    <Location.Provider value={{ path: hash, match: "", parameters }}>
      {element}
      {overlay}
    </Location.Provider>
  );
};
