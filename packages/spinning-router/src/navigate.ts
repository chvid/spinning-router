import { link } from "./link";

export const navigate = (strings: TemplateStringsArray, ...values: any[]) => {
  window.location.hash = link(strings, ...values);
};
