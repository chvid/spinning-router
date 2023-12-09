import React from "react";
import renderer from "react-test-renderer";

import { test } from "@jest/globals";

import { matchRoute } from "./SpinningRouter";
import { Routes } from "./Routes";
import { link } from "./link";

const routes = [
  {
    path: "",
    component: async () => <p>root</p>
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
            component: async () => <p>settings</p>
          }
        ]
      },
      {
        path: "sales",
        routes: [
          {
            path: "invoices",
            component: async () => <p>invoices</p>
          },
          {
            path: "customers",
            component: async () => <p>customers</p>
          }
        ]
      }
    ]
  }
] satisfies Routes;

test("routes", async () => {
  expect(renderer.create(await matchRoute(routes, "")).toJSON()).toEqual({ type: "p", props: {}, children: ["root"] });
  expect(renderer.create(await matchRoute(routes, "/")).toJSON()).toEqual({ type: "p", props: {}, children: ["root"] });
  expect(renderer.create(await matchRoute(routes, "/42/settings")).toJSON()).toEqual({
    type: "p",
    props: {},
    children: [{ type: "p", props: {}, children: ["settings"] }]
  });
});

test("link", async () => {
  const companyId = 42;
  expect(link`/${companyId}/hello`).toEqual("#/42/hello");
});
