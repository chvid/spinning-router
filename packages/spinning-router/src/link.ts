import { Path, PathParameters } from "./Routes";

export const unsafeLink = (path: string, values?: any) => {
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

export const link: <P extends Path>(path: P, values: PathParameters<P>) => string = unsafeLink;
