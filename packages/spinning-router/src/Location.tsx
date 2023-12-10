import { createContext } from "react";

export type LocationType = {
  path: string;
  match: string;
  params: { [key: string]: string };
};

export const Location = createContext<LocationType>({ path: "", match: "", params: {} });
