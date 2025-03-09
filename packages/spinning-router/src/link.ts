import { Path, PathParameters } from "./Routes";

export const unsafeLink = (path: string, values?: any) => {
  let result = [];

  for (let part of (path as string).split("/")) {
    if (part.startsWith(":")) {
      const key = part.substring(1);
      let value = values && values[key] !== undefined ? values[key] : (window as any).SpinningRouterLocation.parameters[key];
      result.push(encodeURIComponent(value));
    } else {
      result.push(part);
    }
  }

  return "#" + result.join("/");
};

export const link: <P extends Path>(path: P, values?: PathParameters<P>) => string = unsafeLink;
