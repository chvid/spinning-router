import { createContext } from "react";

export type LocationType = {
  path: string;
  match: string;
  parameters: { [key: string]: string };
};

export const Location = createContext<LocationType>({ path: "", match: "", parameters: {} });
