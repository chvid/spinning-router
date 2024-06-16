import { link } from "./link";

export const navigate = (path: string, values: { [key: string]: string | number } = {}) => {
  window.location.hash = link(path, values);
};
