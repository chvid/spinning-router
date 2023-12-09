import { test, beforeAll } from "@jest/globals";

import { matchRoute } from "./SpinningRouter";
import { Routes } from "./Routes";
import { link } from "./link";

const routes = [
  {
    path: "",
    component: async () => <p />
  },
  {
    path: ":id",
    component: async ({ id, children }: any) => <p>{children}</p>,
    routes: [
      {
        path: "settings",
        routes: [
          {
            path: "",
            component: async () => <p />
          }
        ]
      },
      {
        path: "sales",
        routes: [
          {
            path: "invoices",
            component: async () => <p /> // <InvoicesPage />,
          },
          {
            path: "customers",
            component: async () => <p /> // <CustomersPage />
          }
        ]
      }
    ]
  }
] satisfies Routes;

test("routes", async () => {
  console.log("match empty string", await matchRoute(routes, ""));
  console.log("match slash", await matchRoute(routes, "/"));
  console.log("match /42/settings", await matchRoute(routes, "/42/settings"));
});

test("link", async () => {
  const companyId = 42;
  console.log("link", link`/${companyId}/hello`);
});
