export type AsyncComponent = (arg: any) => Promise<JSX.Element>;
export type Route = {
  path: string;
  routes?: Routes;
  component?: AsyncComponent;
};
export type Routes = readonly Route[];

export type AllPaths<R extends Routes, Prefix extends string = ""> = R extends readonly [infer First extends Route, ...infer Rest extends readonly Route[]]
  ?
      | (First extends { path: infer P extends string; routes?: infer S } ? `${Prefix}${P}` | (S extends Routes ? AllPaths<S, `${Prefix}${P}`> : never) : never)
      | AllPaths<Rest, Prefix>
  : never;

export interface Register {
  // routes: Routes;
}

export type Path = AllPaths<
  Register extends {
    routes: infer Routes;
  }
    ? Routes
    : never
>;
