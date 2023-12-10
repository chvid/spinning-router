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
    <Location.Provider value={{ path: hash, match: "", params: {} }}>
      {element}
      {overlay}
    </Location.Provider>
  );
};
