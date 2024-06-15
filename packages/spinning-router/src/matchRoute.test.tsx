import React from "react";

import { test } from "@jest/globals";

import { matchRoute } from "./matchRoute";
import { Routes } from "./Routes";
import { link } from "./link";

const routes = [
  {
    path: "",
    component: async () => <div>root</div>
  },
  {
    path: ":id",
    component: async ({ id, children }: any) => <div>{children}</div>,
    routes: [
      {
        path: "settings",
        routes: [
          {
            path: "",
            component: async () => <div>settings</div>
          }
        ]
      },
      {
        path: "sales",
        routes: [
          {
            path: "invoices",
            component: async () => <div>invoices</div>
          },
          {
            path: "customers",
            component: async () => <div>customers</div>
          }
        ]
      }
    ]
  }
] satisfies Routes;

test("routes", async () => {
  expect((await matchRoute(routes, ""))?.element).toEqual(<div>root</div>);
  expect((await matchRoute(routes, "/"))?.element).toEqual(<div>root</div>);
  expect((await matchRoute(routes, "/42/settings"))?.element).toEqual(
    <div>
      <div>settings</div>
    </div>
  );
});

test("parameters", async () => {
  expect(
    await matchRoute(
      [
        {
          path: ":a/:b",
          component: async ({ a, b }) => (
            <div>
              <span>{a}</span>
              <span>{b}</span>
            </div>
          )
        }
      ],
      "/42/87"
    )
  ).toEqual({
    element: (
      <div>
        <span>42</span>
        <span>87</span>
      </div>
    ),
    parameters: { a: "42", b: "87" },
    path: ":a/:b"
  });
});

test("encoding", async () => {
  expect((await matchRoute([{ path: ":a", component: async ({ a }) => <div>{a}</div> }], link`/${"/æøå"}`.substring(1)))?.element).toEqual(<div>/æøå</div>);
});
