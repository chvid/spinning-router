export type AsyncComponent = (parameters: any) => Promise<JSX.Element>;
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

type SplitPathSegments<S extends string, Delimiter extends string = "/", Parts extends string[] = []> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? SplitPathSegments<Tail, Delimiter, [...Parts, Head]>
  : [...Parts, S];

type FilterColonParams<T> = T extends `:${infer Param}` ? Param : never;

type PathParameterName<P extends Path> = FilterColonParams<SplitPathSegments<P>[number]>;

export type PathParameters<P extends Path> = { [key in PathParameterName<P>]?: string | number };
