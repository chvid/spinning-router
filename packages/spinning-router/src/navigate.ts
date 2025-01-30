import { link } from "./link";
import { Path } from "./Routes";

export const navigate = (path: Path, values: { [key: string]: string | number } = {}) => {
  window.location.hash = link(path, values);
};
