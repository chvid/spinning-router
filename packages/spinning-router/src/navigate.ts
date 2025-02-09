import { link } from "./link";
import { Path, PathParameters } from "./Routes";

export const navigate = <P extends Path>(path: P, values?: PathParameters<P>) => {
  window.location.hash = link(path, values);
};
