import { Path } from "./Routes";

export const link = (path: Path, values: { [key: string]: string | number } = {}) => {
  let result = [];

  for (let part of (path as string).split("/")) {
    if (part.startsWith(":")) {
      result.push(encodeURIComponent(values[part.substring(1)]));
    } else {
      result.push(part);
    }
  }

  return "#" + result.join("/");
};
