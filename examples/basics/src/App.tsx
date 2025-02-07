import { useContext } from "react";
import { SpinningRouter, Routes, Location, link } from "spinning-router";
import { unsafeLink } from "spinning-router/dist/link";

const DELAY = 500;

type PageDetails = {
  id: number;
  title: string;
  body: string;
};

type PageOverview = {
  id: number;
  title: string;
};

const data: PageDetails[] = [
  { id: 42, title: "Foo", body: "Bar" },
  { id: 87, title: "Baz", body: "Foo" }
];

const wait = (time: number) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const api = {
  async loadOverview() {
    await wait(DELAY);
    return data.map(d => ({ id: d.id, title: d.title }));
  },

  async loadDetails(id: number) {
    await wait(DELAY);
    const result = data.find(d => d.id == id);
    if (result) {
      return result;
    } else {
      throw new Error(`Id ${id} not found`);
    }
  }
};

const AnotherLongPage: React.FC = () => (
  <div>
    <h1>Another Long Page</h1>
    {new Array(42).fill(0).map((_, i) => (
      <p key={i}>bar</p>
    ))}
    <p>
      Link to <a href={link("/", {})}>home</a>.
    </p>
  </div>
);

const LongPage: React.FC = () => (
  <div>
    <h1>Long Page</h1>
    {new Array(42).fill(0).map((_, i) => (
      <p key={i}>foo</p>
    ))}
    <p>
      Link to <a href={link("/another-long-page", {})}>another long page</a>.
    </p>
  </div>
);

const IndexPage: React.FC<{ overview: PageOverview[] }> = ({ overview }) => (
  <div>
    <h1>Index</h1>
    <p>Simulating a slow server with delay of {DELAY} ms.</p>
    <ul>
      {overview.map((d, i) => (
        <li key={i}>
          <a href={link("/details/:id", { id: d.id })}>{d.title}</a>
        </li>
      ))}
    </ul>
    <p>
      Page <a href={link("/long-page", {})}>that is very long</a>.
    </p>
    <p>
      Page that triggers an error <a href={link("/details/:id", { id: 99 })}>error</a>.
    </p>
    <p>
      Page that does exist <a href={unsafeLink("/this-page-doesnt-exist")}>404 - not found</a>.
    </p>
  </div>
);

const DetailsPage: React.FC<{ details: PageDetails }> = ({ details }) => {
  const location = useContext(Location);
  return (
    <div>
      <h1>{details.title}</h1>
      <p>{details.body}</p>
      <p>
        <a href={link("/", {})}>To index</a>.
      </p>
      <p>Parameters are: {JSON.stringify(location)}</p>
    </div>
  );
};

const routes = [
  { path: "/", component: async () => <IndexPage overview={await api.loadOverview()} /> },
  { path: "/long-page", component: async () => <LongPage /> },
  { path: "/another-long-page", component: async () => <AnotherLongPage /> },
  { path: "/details/:id", component: async ({ id }) => <DetailsPage details={await api.loadDetails(id)} /> }
] as const satisfies Routes;

export const App = () => <SpinningRouter routes={routes}></SpinningRouter>;

declare module "spinning-router" {
  interface Register {
    routes: typeof routes;
  }
}
