export const link = (path: string, values: { [key: string]: string | number } = {}) => {
  let result = [];

  for (let part of path.split("/")) {
    if (part.startsWith(":")) {
      result.push(encodeURIComponent(values[part.substring(1)]));
    } else {
      result.push(part);
    }
  }

  return "#" + result.join("/");
};
