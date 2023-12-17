import { SpinningRouter, Routes, link } from "spinning-router";

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
    return data.find(d => d.id == id)!;
  }
};

const IndexPage: React.FC<{ overview: PageOverview[] }> = ({ overview }) => (
  <div>
    <h1>Index</h1>
    <ul>
      {overview.map(d => (
        <li>
          <a href={link`/${d.id}`}>{d.title}</a>
        </li>
      ))}
    </ul>
  </div>
);

const DetailsPage: React.FC<{ details: PageDetails }> = ({ details }) => (
  <div>
    <h1>{details.title}</h1>
    <p>{details.body}</p>
    <p>
      <a href={link`/`}>To index</a>.
    </p>
  </div>
);

const routes = [
  { path: "/", component: async () => <IndexPage overview={await api.loadOverview()} /> },
  { path: "/:id", component: async ({ id }) => <DetailsPage details={await api.loadDetails(id)} /> }
] satisfies Routes;

export const App = () => <SpinningRouter routes={routes}></SpinningRouter>;
