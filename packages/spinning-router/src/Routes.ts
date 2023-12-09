export type AsyncComponent = (arg: any) => Promise<JSX.Element>;
export type Route = {
  path: string;
  routes?: Routes;
  component?: AsyncComponent;
};
export type Routes = Route[];
